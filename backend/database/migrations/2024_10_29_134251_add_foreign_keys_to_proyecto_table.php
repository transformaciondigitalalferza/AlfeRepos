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
        Schema::table('proyecto', function (Blueprint $table) {
            $table->foreign(['idarea'], 'FK__proyecto__idarea__01142BA1')->references(['id'])->on('area')->onUpdate('NO ACTION')->onDelete('NO ACTION');
            $table->foreign(['idestaddo'], 'FK__proyecto__idesta__02084FDA')->references(['id'])->on('estado')->onUpdate('NO ACTION')->onDelete('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('proyecto', function (Blueprint $table) {
            $table->dropForeign('FK__proyecto__idarea__01142BA1');
            $table->dropForeign('FK__proyecto__idesta__02084FDA');
        });
    }
};
