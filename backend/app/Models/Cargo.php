<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class cargo extends Model
{
    protected $table = 'cargo';
    protected $fillable = ['nombrecargo', 'descripcion'];

    public function procedimientos()
    {
        return $this->hasMany('App\Models\Procedimiento', 'idcargo');
    }

    public function politicas()
    {
        return $this->hasMany('App\Models\Politica', 'idcargo');
    }

    public function formatos()
    {
        return $this->hasMany('App\Models\Formato', 'idcargo');
    }

    public function users()
    {
        return $this->hasMany('App\Models\User', 'idcargo');
    }

    public function funcions()
    {
        return $this->hasMany('App\Models\Funcion', 'idcargo');
    }
}
