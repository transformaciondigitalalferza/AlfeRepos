<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Procedimiento extends Model
{
    protected $table = 'procedimiento';

    protected $fillable = ['idcargo', 'idrol', 'archivo', 'nombre'];

    public function rol()
    {
        return $this->belongsTo('App\Models\Rol', 'idrol');
    }

    public function cargo()
    {
        return $this->belongsTo('App\Models\Cargo', 'idcargo');
    }
    public $timestamps = false;  

}
