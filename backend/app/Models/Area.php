<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property integer $idresponsable
 * @property string $nombres
 * @property User[] $users
 * @property User $user
 * @property Subarea[] $subareas
 * @property Proyecto[] $proyectos
 */
class area extends Model
{
 
    protected $table = 'area';

    protected $fillable = ['idresponsable', 'nombres'];

    public function users()
    {
        return $this->hasMany('App\Models\User', 'idarea');
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User', 'idresponsable');
    }

    public function subareas()
    {
        return $this->hasMany('App\Models\Subarea', 'idarea');
    }

    public function proyectos()
    {
        return $this->hasMany('App\Models\Proyecto', 'idarea');
    }
}
