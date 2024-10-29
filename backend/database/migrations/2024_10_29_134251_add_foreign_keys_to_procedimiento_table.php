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
        Schema::table('procedimiento', function (Blueprint $table) {
            $table->foreign(['idrol'], 'FK__procedimi__idrol__14270015')->references(['id'])->on('rol')->onUpdate('NO ACTION')->onDelete('NO ACTION');
            $table->foreign(['idcargo'], 'FK__procedimi__idcar__1332DBDC')->references(['id'])->on('cargo')->onUpdate('NO ACTION')->onDelete('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('procedimiento', function (Blueprint $table) {
            $table->dropForeign('FK__procedimi__idrol__14270015');
            $table->dropForeign('FK__procedimi__idcar__1332DBDC');
        });
    }
};
