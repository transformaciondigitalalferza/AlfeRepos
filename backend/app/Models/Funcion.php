<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property integer $idcargo
 * @property string $nombrefuncion
 * @property string $descripcion
 * @property Cargo $cargo
 */
class Funcion extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'funcion';

    /**
     * @var array
     */
    protected $fillable = ['idcargo', 'nombrefuncion', 'descripcion'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function cargo()
    {
        return $this->belongsTo('App\Models\Cargo', 'idcargo');
    }
}
