<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Rol extends Model
{
    use HasFactory;

    protected $table = 'rol';

    protected $fillable = ['nombre'];

    public function procedimientos()
    {
        return $this->hasMany('App\Models\Procedimiento', 'idrol', 'id');
    }

    public function users()
    {
        return $this->hasMany('App\Models\User', 'idrol', 'id');
    }
}
