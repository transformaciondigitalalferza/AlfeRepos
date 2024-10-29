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
        Schema::table('politica', function (Blueprint $table) {
            $table->foreign(['idcargo'], 'FK__politica__idcarg__17036CC0')->references(['id'])->on('cargo')->onUpdate('NO ACTION')->onDelete('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('politica', function (Blueprint $table) {
            $table->dropForeign('FK__politica__idcarg__17036CC0');
        });
    }
};
