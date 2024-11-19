<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MigracionComision extends Model
{
    use HasFactory;

    protected $table = 'dbo.migracioncomisiones';

    protected $primaryKey = 'id';

    public $incrementing = true;

    protected $keyType = 'int';

    public $timestamps = false;

    protected $fillable = [
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
        'porcent_pagado',
        'fecha_migracion',
        'estado',
        'nombres',
        'fecseparacion',
    ];

    protected $casts = [
        'id' => 'integer',
        'codigo_proyecto' => 'string',
        'codigo_unidad' => 'string',
        'codigo_proforma' => 'string',
        'username_creador' => 'string',
        'moneda' => 'string',
        'total_pagado' => 'decimal:2',
        'precio_base_proforma' => 'decimal:2',
        'financiamiento' => 'string',
        'dormitorios' => 'integer',
        'desc_m2' => 'decimal:2',
        'porcent_pagado' => 'decimal:2',
        'fecha_migracion' => 'date',
        'estado' => 'boolean',
        'nombres' => 'string',
        'fecseparacion' => 'date',
    ];
}
