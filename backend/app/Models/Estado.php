<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class estado extends Model
{
    protected $table = 'estado';

    protected $fillable = ['descripcion'];

    public function tareas()
    {
        return $this->hasMany('App\Models\Tarea', 'idestado');
    }

    public function subtareas()
    {
        return $this->hasMany('App\Models\Subtarea', 'idestado');
    }

    public function proyectos()
    {
        return $this->hasMany('App\Models\Proyecto', 'idestaddo');
    }
}
