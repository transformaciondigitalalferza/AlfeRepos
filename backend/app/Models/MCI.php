<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MCI extends Model
{
    protected $table = 'MCI';
    protected $fillable = ['Descripcion', 'IdEstrategico', 'Meta'];
    public $timestamps = false; 
    public function estrategico(){
        return $this->belongsTo('App\Models\Objetivoestrategico', 'IdEstrategico');
    }
    public function operacional(){
        return $this->hasMany('App\Models\Objetivooperacional','IdMCI');
    }
}
