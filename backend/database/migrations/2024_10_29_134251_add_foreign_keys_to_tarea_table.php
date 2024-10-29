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
        Schema::table('tarea', function (Blueprint $table) {
            $table->foreign(['idusers'], 'FK__tarea__idusers__76969D2E')->references(['id'])->on('users')->onUpdate('NO ACTION')->onDelete('NO ACTION');
            $table->foreign(['idobjoperacional'], 'FK__tarea__idobjoper__75A278F5')->references(['id'])->on('objetivooperacional')->onUpdate('NO ACTION')->onDelete('NO ACTION');
            $table->foreign(['idestado'], 'FK__tarea__idestado__778AC167')->references(['id'])->on('estado')->onUpdate('NO ACTION')->onDelete('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tarea', function (Blueprint $table) {
            $table->dropForeign('FK__tarea__idusers__76969D2E');
            $table->dropForeign('FK__tarea__idobjoper__75A278F5');
            $table->dropForeign('FK__tarea__idestado__778AC167');
        });
    }
};
