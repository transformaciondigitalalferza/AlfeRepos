<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property string $nombrecargo
 * @property string $descripcion
 * @property Procedimiento[] $procedimientos
 * @property Politica[] $politicas
 * @property Formato[] $formatos
 * @property User[] $users
 * @property Funcion[] $funcions
 */
class cargo extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'cargo';

    /**
     * @var array
     */
    protected $fillable = ['nombrecargo', 'descripcion'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function procedimientos()
    {
        return $this->hasMany('App\Models\Procedimiento', 'idcargo');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function politicas()
    {
        return $this->hasMany('App\Models\Politica', 'idcargo');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function formatos()
    {
        return $this->hasMany('App\Models\Formato', 'idcargo');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function users()
    {
        return $this->hasMany('App\Models\User', 'idcargo');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function funcions()
    {
        return $this->hasMany('App\Models\Funcion', 'idcargo');
    }
}
