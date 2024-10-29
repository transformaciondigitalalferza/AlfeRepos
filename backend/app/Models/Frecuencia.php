<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property string $descripcion
 * @property Objetivooperacional[] $objetivooperacionals
 */
class Frecuencia extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'frecuencia';

    /**
     * @var array
     */
    protected $fillable = ['descripcion'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function objetivooperacionals()
    {
        return $this->hasMany('App\Models\Objetivooperacional', 'idfrecuencia');
    }
}
