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
        Schema::table('objetivoestrategico', function (Blueprint $table) {
            $table->foreign(['tipoobjetivo'], 'FK__objetivoe__tipoo__6B24EA82')->references(['id'])->on('tipoobjetivo')->onUpdate('NO ACTION')->onDelete('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('objetivoestrategico', function (Blueprint $table) {
            $table->dropForeign('FK__objetivoe__tipoo__6B24EA82');
        });
    }
};
