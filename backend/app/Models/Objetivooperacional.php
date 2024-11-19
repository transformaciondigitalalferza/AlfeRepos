<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Objetivooperacional extends Model
{
    use HasFactory;

    protected $table = 'objetivooperacional';

    protected $fillable = [
        'idobjetivoestrategico',
        'idfrecuencia',
        'descripcion',
        'meta',
        'fechainicio',
        'fechafin',
        'fechaactualizacion',
        'idarea', // Añadido
    ];

    public $timestamps = false;  

    // Relación con Indicadores
    public function indicadores()
    {
        return $this->hasMany('App\Models\Indicadore', 'idoperativo');
    }

    // Relación con Frecuencia
    public function frecuencium()
    {
        return $this->belongsTo('App\Models\Frecuencium', 'idfrecuencia');
    }

    // Relación con Objetivo Estratégico
    public function objetivoestrategico()
    {
        return $this->belongsTo('App\Models\Objetivoestrategico', 'idobjetivoestrategico');
    }

    // Relación con Tareas
    public function tareas()
    {
        return $this->hasMany('App\Models\Tarea', 'idobjoperacional');
    }

    // Relación con Área
    public function area()
    {
        return $this->belongsTo('App\Models\Area', 'idarea');
    }
}
