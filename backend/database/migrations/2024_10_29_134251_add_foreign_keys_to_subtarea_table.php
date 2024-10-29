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
        Schema::table('subtarea', function (Blueprint $table) {
            $table->foreign(['idusers'], 'FK__subtarea__iduser__7C4F7684')->references(['id'])->on('users')->onUpdate('NO ACTION')->onDelete('NO ACTION');
            $table->foreign(['idestado'], 'FK__subtarea__idesta__7D439ABD')->references(['id'])->on('estado')->onUpdate('NO ACTION')->onDelete('NO ACTION');
            $table->foreign(['idtarea'], 'FK__subtarea__idtare__7B5B524B')->references(['id'])->on('tarea')->onUpdate('NO ACTION')->onDelete('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('subtarea', function (Blueprint $table) {
            $table->dropForeign('FK__subtarea__iduser__7C4F7684');
            $table->dropForeign('FK__subtarea__idesta__7D439ABD');
            $table->dropForeign('FK__subtarea__idtare__7B5B524B');
        });
    }
};
