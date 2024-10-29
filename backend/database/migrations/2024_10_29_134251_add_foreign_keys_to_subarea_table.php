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
        Schema::table('subarea', function (Blueprint $table) {
            $table->foreign(['idarea'], 'FK__subarea__idarea__44FF419A')->references(['id'])->on('area')->onUpdate('NO ACTION')->onDelete('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('subarea', function (Blueprint $table) {
            $table->dropForeign('FK__subarea__idarea__44FF419A');
        });
    }
};
