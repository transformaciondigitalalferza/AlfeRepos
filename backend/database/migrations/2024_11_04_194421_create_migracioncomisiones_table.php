<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateMigracioncomisionesTable extends Migration
{
    /**
     * Ejecutar las migraciones.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('migracioncomisiones', function (Blueprint $table) {
            // Es recomendable agregar una clave primaria
            $table->bigIncrements('id');

            $table->string('codigo_proyecto', 255)->nullable();
            $table->string('codigo_unidad', 255)->nullable();
            $table->string('codigo_proforma', 255)->nullable();
            $table->string('username_creador', 255)->nullable();
            $table->string('moneda', 50)->nullable();
            $table->decimal('total_pagado', 15, 2)->nullable();
            $table->decimal('precio_base_proforma', 15, 2)->nullable();
            $table->string('financiamiento', 100)->nullable();
            $table->integer('dormitorios')->nullable();
            $table->decimal('desc_m2', 15, 2)->nullable();
            $table->decimal('porcent_pagado', 5, 2)->nullable();
            $table->date('fecha_migracion')->nullable()->default(DB::raw('GETDATE()'));
            $table->boolean('estado')->nullable()->default(1);

            // Opcional: Agregar timestamps (created_at y updated_at)
            $table->timestamps();
        });
    }

    /**
     * Revertir las migraciones.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('migracioncomisiones');
    }
}
