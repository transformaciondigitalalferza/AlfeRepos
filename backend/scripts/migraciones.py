import psycopg2
import pyodbc
import pandas as pd
from datetime import datetime
import sys

def validar_fecha(fecha_str):
    """
    Valida que la cadena de fecha esté en el formato YYYY-MM-DD.
    Retorna True si es válida, de lo contrario False.
    """
    try:
        datetime.strptime(fecha_str, '%Y-%m-%d')
        return True
    except ValueError:
        return False

def main():
    if len(sys.argv) != 3:
        print("Uso: python data_migration.py <start_date> <end_date>")
        print("Ejemplo: python data_migration.py 2024-08-01 2024-09-01")
        sys.exit(1)
    
    start_date = sys.argv[1]
    end_date = sys.argv[2]
    
    if not validar_fecha(start_date):
        print(f"Formato de fecha de inicio inválido: {start_date}. Usa el formato YYYY-MM-DD.")
        sys.exit(1)
    
    if not validar_fecha(end_date):
        print(f"Formato de fecha de fin inválido: {end_date}. Usa el formato YYYY-MM-DD.")
        sys.exit(1)
    
    try:
        redshift_conn = psycopg2.connect(
            dbname='f66t29dms9cpobn1',
            host='rssperant-elias.cmd1cn2chqlh.us-east-1.redshift.amazonaws.com',
            port='5439',
            user='tt78lt43r4op',
            password='eRh0v9H1d6ZP=='
        )
        print("Conexión exitosa a Amazon Redshift.")
    except Exception as e:
        print("Error al conectar a Amazon Redshift:", e)
        sys.exit(1)
    
    query =  '''
        WITH CTE_Comisiones AS (
            SELECT 
                qwer.codigo_proyecto,
                qwer.codigo_unidad,
                qwer.username_creador, 
                qwer.moneda, 
                SUM(qwer.monto_pagado) AS total_pagado, 
                qwer.precio_base_proforma,
                CASE 
                    WHEN qwer.tipo_financiamiento = 'crédito directo' THEN 'hipotecario' 
                    ELSE qwer.tipo_financiamiento 
                END AS financiamiento,
                qwer.dormitorios, 
                ROUND(qwer.descuento_m2, 1) AS desc_m2, 
                ROUND(SUM(qwer.monto_pagado) * 100 / qwer.precio_base_proforma) AS porcent_pagado, 
                qwer.codigo_proforma,
                p.monto_pagado
            FROM (
                SELECT 
                    pu.codigo_proyecto,
                    pu.codigo_unidad, 
                    pu.codigo_proforma,
                    pu.username_creador, 
                    p.nombres_cliente || ' ' || p.apellidos_cliente AS nombres, 
                    p.documento_cliente, 
                    p.fecha_pago, 
                    p.nombre, 
                    p.etiqueta, 
                    pu.moneda, 
                    p.monto_pagado, 
                    pu.tipo_financiamiento, 
                    pu.estado, 
                    u.precio_lista, 
                    u.precio_base_proforma, 
                    u.precio_venta, 
                    u.descuento_venta, 
                    u.area_total, 
                    (u.precio_base_proforma - u.precio_venta) /  (pu.area_techada + pu.area_libre) AS descuento_m2, 
                    u.precio_m2,
                    COALESCE(u.total_habitaciones, CAST(de.valor AS INT)) AS dormitorios
                FROM alferza.pagos p 
                JOIN alferza.proforma_unidad pu ON pu.codigo_proforma = p.codigo_proforma 
                JOIN alferza.unidades u ON u.codigo = pu.codigo_unidad 
                LEFT JOIN alferza.datos_extras de ON de.codigo = pu.codigo_unidad AND de.entidad = 'UNIDAD' AND de.nombre = 'dormitorios'
                WHERE p.fecha_pago BETWEEN %s AND %s
                AND (p.etiqueta = 'Separación'
                        OR p.etiqueta LIKE '%%Inicial%%')
                AND pu.estado != 'vencido'
                AND p.estado = 'pagado'
                AND pu.nombre_unidad NOT LIKE '%%E%%'
                AND pu.nombre_unidad NOT LIKE '%%D%%'
            ) AS qwer
            LEFT JOIN alferza.pagos p ON p.codigo_proforma = qwer.codigo_proforma AND p.etiqueta = 'Separación'
            GROUP BY 
                qwer.codigo_proyecto,
                qwer.codigo_unidad, 
                qwer.codigo_proforma,
                qwer.username_creador, 
                qwer.moneda, 
                qwer.tipo_financiamiento, 
                qwer.precio_base_proforma, 
                qwer.dormitorios, 
                qwer.descuento_m2,
                p.monto_pagado
        )
        SELECT 
            codigo_proyecto,
            codigo_unidad,
            codigo_proforma,
            username_creador,
            moneda,
            total_pagado,
            precio_base_proforma,
            financiamiento,
            dormitorios,
            desc_m2,
            ROUND(CASE 
                WHEN porcent_pagado < 10 THEN (total_pagado + monto_pagado) * 100 / precio_base_proforma
                ELSE porcent_pagado
            END) AS porcent_pagado
        FROM CTE_Comisiones;
    '''
    
    try:
        df = pd.read_sql_query(query, redshift_conn, params=[start_date, end_date])
        print("Datos extraídos de Redshift exitosamente.")
    except Exception as e:
        print("Error al extraer datos de Redshift:", e)
        redshift_conn.close()
        sys.exit(1)
        
    varchar_columns = [
        'codigo_proyecto',
        'codigo_unidad',
        'codigo_proforma',
        'username_creador',
        'moneda',
        'financiamiento'
    ]
    
    for col in varchar_columns:
        df[col] = df[col].astype(str)
    
    numeric_columns = [
        'total_pagado',
        'precio_base_proforma',
        'desc_m2',
        'porcent_pagado'
    ]
    
    for col in numeric_columns:
        df[col] = pd.to_numeric(df[col], errors='coerce')
        df[col] = df[col].fillna(0)
    
    for col in numeric_columns:
        df[col] = df[col].round(2)
    
    df['dormitorios'] = pd.to_numeric(df['dormitorios'], errors='coerce').fillna(0).astype(int)
    
    df['porcent_pagado'] = df['porcent_pagado'].clip(lower=0, upper=100)
    
    df = df.dropna(subset=[
        'codigo_proyecto',
        'codigo_unidad',
        'codigo_proforma',
        'username_creador',
        'moneda',
        'total_pagado',
        'precio_base_proforma',
        'financiamiento',
        'dormitorios',
        'desc_m2',
        'porcent_pagado'
    ])
    
    records = df[[
        'codigo_proyecto',
        'codigo_unidad',
        'codigo_proforma',
        'username_creador',
        'moneda',
        'total_pagado',
        'precio_base_proforma',
        'financiamiento',
        'dormitorios',
        'desc_m2',
        'porcent_pagado'
    ]].values.tolist()
    
    redshift_conn.close()
    
    print("Primeros registros extraídos:")
    print(df.head())
    
    try:
        sql_server_conn = pyodbc.connect(
            'DRIVER={ODBC Driver 17 for SQL Server};'
            'SERVER=localhost;'
            'PORT=1433;'
            'DATABASE=AlferzaXpert;'
            'UID=sa;'
            'PWD=shunashi;'
        )
        print("Conexión exitosa a SQL Server.")
    except Exception as e:
        print("Error al conectar a SQL Server:", e)
        sys.exit(1)
    
    cursor = sql_server_conn.cursor()
    
    try:
        update_query = "UPDATE dbo.migracioncomisiones SET estado = 0"
        cursor.execute(update_query)
        sql_server_conn.commit()
        print("Query UPDATE ejecutado correctamente.")
    except Exception as e:
        print("Error al ejecutar el query UPDATE:", e)
        sql_server_conn.rollback()
        sql_server_conn.close()
        sys.exit(1)
    
    insert_query = '''
    INSERT INTO dbo.migracioncomisiones 
    (codigo_proyecto, codigo_unidad, codigo_proforma, username_creador, moneda, total_pagado,
     precio_base_proforma, financiamiento, dormitorios, desc_m2, porcent_pagado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    '''
    
    try:
        cursor.fast_executemany = True
        cursor.executemany(insert_query, records)
        sql_server_conn.commit()
        print("Datos insertados en SQL Server correctamente.")
    except Exception as e:
        print("Error al insertar datos en SQL Server:", e)
        sql_server_conn.rollback()
        sql_server_conn.close()
        sys.exit(1)
    
    sql_server_conn.close()
    print("Conexión a SQL Server cerrada.")

if __name__ == "__main__":
    main()