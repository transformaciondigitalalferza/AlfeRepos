<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property integer $idcargo
 * @property string $archivo
 * @property string $nombre
 * @property Cargo $cargo
 */
class Politica extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'politica';

    /**
     * @var array
     */
    protected $fillable = ['idcargo', 'archivo', 'nombre'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function cargo()
    {
        return $this->belongsTo('App\Models\Cargo', 'idcargo');
    }
}
