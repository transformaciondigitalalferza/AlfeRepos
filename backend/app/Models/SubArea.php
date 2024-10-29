<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property integer $idarea
 * @property string $nombresubarea
 * @property User[] $users
 * @property Area $area
 * @property User[] $users
 */
class subarea extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'subarea';

    /**
     * @var array
     */
    protected $fillable = ['idarea', 'nombresubarea'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function users()
    {
        return $this->hasMany('App\Models\User', 'subarea');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function area()
    {
        return $this->belongsTo('App\Models\Area', 'idarea');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users_subarea()
    {
        return $this->belongsToMany('App\Models\User', 'user_subarea', null, 'id');
    }
}
