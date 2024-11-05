<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @property integer $id
 * @property string $nombre
 * @property \Illuminate\Database\Eloquent\Collection $procedimientos
 * @property \Illuminate\Database\Eloquent\Collection $users
 */
class Rol extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'rol';

    /**
     * Los atributos que son asignables en masa.
     *
     * @var array
     */
    protected $fillable = ['nombre'];

    /**
     * Relación con el modelo Procedimiento.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function procedimientos()
    {
        return $this->hasMany('App\Models\Procedimiento', 'idrol', 'id');
    }

    /**
     * Relación con el modelo User.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function users()
    {
        return $this->hasMany('App\Models\User', 'idrol', 'id');
    }
}
