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
        Schema::table('users', function (Blueprint $table) {
            $table->foreign(['idarea'], 'FK__users__idarea__1BC821DD')->references(['id'])->on('area')->onUpdate('NO ACTION')->onDelete('NO ACTION');
            $table->foreign(['subarea'], 'FK__users__subarea__1CBC4616')->references(['id'])->on('subarea')->onUpdate('NO ACTION')->onDelete('NO ACTION');
            $table->foreign(['idcargo'], 'FK__users__idcargo__1AD3FDA4')->references(['id'])->on('cargo')->onUpdate('NO ACTION')->onDelete('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign('FK__users__idarea__1BC821DD');
            $table->dropForeign('FK__users__subarea__1CBC4616');
            $table->dropForeign('FK__users__idcargo__1AD3FDA4');
        });
    }
};
