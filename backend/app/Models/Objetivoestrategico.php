<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Objetivoestrategico extends Model
{
    protected $table = 'objetivoestrategico';

    protected $fillable = ['tipoobjetivo', 'descripcion', 'fechainicio', 'fechafin', 'fechaactualizacion', 'IdPerspectiva'];

    public $timestamps = false;

    public function tipoperspectiva()
    {
        return $this->belongsTo('App\Models\Perspectiva', 'IdPerspectiva');
    }
    public function MCI(){
        return $this->hasMany('App\Models\MCI','IdEstrategico');
    }
}
