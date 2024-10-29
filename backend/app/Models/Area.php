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
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'area';

    /**
     * @var array
     */
    protected $fillable = ['idresponsable', 'nombres'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function users()
    {
        return $this->hasMany('App\Models\User', 'idarea');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo('App\Models\User', 'idresponsable');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function subareas()
    {
        return $this->hasMany('App\Models\Subarea', 'idarea');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function proyectos()
    {
        return $this->hasMany('App\Models\Proyecto', 'idarea');
    }
}
