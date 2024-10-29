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
        Schema::table('objetivooperacional', function (Blueprint $table) {
            $table->foreign(['idfrecuencia'], 'FK__objetivoo__idfre__6FE99F9F')->references(['id'])->on('frecuencia')->onUpdate('NO ACTION')->onDelete('NO ACTION');
            $table->foreign(['idobjetivoestrategico'], 'FK__objetivoo__idobj__6EF57B66')->references(['id'])->on('objetivoestrategico')->onUpdate('NO ACTION')->onDelete('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('objetivooperacional', function (Blueprint $table) {
            $table->dropForeign('FK__objetivoo__idfre__6FE99F9F');
            $table->dropForeign('FK__objetivoo__idobj__6EF57B66');
        });
    }
};
