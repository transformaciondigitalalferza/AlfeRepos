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
        Schema::table('indicadores', function (Blueprint $table) {
            $table->foreign(['idoperativo'], 'FK__indicador__idope__04E4BC85')->references(['id'])->on('objetivooperacional')->onUpdate('NO ACTION')->onDelete('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('indicadores', function (Blueprint $table) {
            $table->dropForeign('FK__indicador__idope__04E4BC85');
        });
    }
};
