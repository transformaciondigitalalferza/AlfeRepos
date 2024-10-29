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
        Schema::table('formatos', function (Blueprint $table) {
            $table->foreign(['idcargo'], 'FK__formatos__idcarg__19DFD96B')->references(['id'])->on('cargo')->onUpdate('NO ACTION')->onDelete('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('formatos', function (Blueprint $table) {
            $table->dropForeign('FK__formatos__idcarg__19DFD96B');
        });
    }
};
