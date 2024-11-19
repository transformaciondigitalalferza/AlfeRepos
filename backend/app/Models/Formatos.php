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
class formatos extends Model
{
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
    public $timestamps = false;  

}
