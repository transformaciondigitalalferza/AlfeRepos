<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Objetivoestrategico extends Model
{
    protected $table = 'objetivoestrategico';

    protected $fillable = ['tipoobjetivo', 'descripcion', 'fechainicio', 'fechafin', 'fechaactualizacion'];

    public $timestamps = false; // Deshabilitar manejo automático de timestamps

    public function tipoobjetivo()
    {
        return $this->belongsTo('App\Models\Tipoobjetivo', 'tipoobjetivo');
    }

    public function objetivooperacionals()
    {
        return $this->hasMany('App\Models\Objetivooperacional', 'idobjetivoestrategico');
    }
}
