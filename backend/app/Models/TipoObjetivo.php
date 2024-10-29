<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property string $descripcion
 * @property Objetivoestrategico[] $objetivoestrategicos
 */
class TipoObjetivo extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'tipoobjetivo';

    /**
     * @var array
     */
    protected $fillable = ['descripcion'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function objetivoestrategicos()
    {
        return $this->hasMany('App\Models\Objetivoestrategico', 'tipoobjetivo');
    }
}
