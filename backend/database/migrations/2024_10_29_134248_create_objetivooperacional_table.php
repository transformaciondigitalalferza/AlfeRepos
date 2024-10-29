<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('objetivooperacional', function (Blueprint $table) {
            $table->increments('id');
            $table->string('descripcion', 200)->nullable();
            $table->integer('idobjetivoestrategico')->nullable();
            $table->decimal('meta', 18, 0)->nullable();
            $table->integer('idfrecuencia')->nullable();
            $table->date('fechainicio')->nullable();
            $table->date('fechafin')->nullable();
            $table->dateTime('fechaactualizacion')->nullable()->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('objetivooperacional');
    }
};
