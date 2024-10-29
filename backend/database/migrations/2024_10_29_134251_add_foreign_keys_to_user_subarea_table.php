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
        Schema::table('user_subarea', function (Blueprint $table) {
            $table->foreign(['id'], 'FK__user_subarea__id__47DBAE45')->references(['id'])->on('users')->onUpdate('NO ACTION')->onDelete('NO ACTION');
            $table->foreign(['subarea_id'], 'FK__user_suba__subar__48CFD27E')->references(['id'])->on('subarea')->onUpdate('NO ACTION')->onDelete('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_subarea', function (Blueprint $table) {
            $table->dropForeign('FK__user_subarea__id__47DBAE45');
            $table->dropForeign('FK__user_suba__subar__48CFD27E');
        });
    }
};
