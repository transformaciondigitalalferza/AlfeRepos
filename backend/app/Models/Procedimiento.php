<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property integer $idcargo
 * @property integer $idrol
 * @property string $archivo
 * @property string $nombre
 * @property Rol $rol
 * @property Cargo $cargo
 */
class Procedimiento extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'procedimiento';

    /**
     * @var array
     */
    protected $fillable = ['idcargo', 'idrol', 'archivo', 'nombre'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function rol()
    {
        return $this->belongsTo('App\Models\Rol', 'idrol');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function cargo()
    {
        return $this->belongsTo('App\Models\Cargo', 'idcargo');
    }
}
