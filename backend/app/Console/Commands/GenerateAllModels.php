<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GenerateAllModels extends Command
{
    protected $signature = 'generate:models {--schema= : Database schema}';

    protected $description = 'Genera modelos Eloquent para todas las tablas de la base de datos';

    public function handle()
    {
        // Obtener el esquema de la opción o usar 'dbo' por defecto
        $schema = $this->option('schema') ?? 'dbo';

        // Obtener la lista de tablas del esquema especificado
        $tables = DB::select("
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA = ?
        ", [$schema]);

        if (empty($tables)) {
            $this->error("No se encontraron tablas en el esquema '$schema'.");
            return;
        }

        foreach ($tables as $table) {
            $tableName = $table->TABLE_NAME;

            // Convertir el nombre de la tabla a formato de modelo (StudlyCase)
            $modelName = Str::studly(Str::singular($tableName));

            $this->info("Generando modelo para la tabla: $tableName");

            $params = [
                'name' => $modelName,
                '--table-name' => $tableName,
                '--connection' => 'sqlsrv', // Asegúrate de que coincide con tu conexión
            ];

            // Llamar al comando de generación de modelo
            $this->call('krlove:generate:model', $params);
        }

        $this->info('Generación de modelos completada.');
    }
}
