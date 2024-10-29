<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property integer $idtarea
 * @property integer $idusers
 * @property integer $idestado
 * @property string $descripcion
 * @property string $evidencia
 * @property string $fechainicio
 * @property string $fechafin
 * @property string $fechaactualizacion
 * @property User $user
 * @property Estado $estado
 * @property Tarea $tarea
 */
class subtarea extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'subtarea';

    /**
     * @var array
     */
    protected $fillable = ['idtarea', 'idusers', 'idestado', 'descripcion', 'evidencia', 'fechainicio', 'fechafin', 'fechaactualizacion'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo('App\Models\User', 'idusers');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function estado()
    {
        return $this->belongsTo('App\Models\Estado', 'idestado');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function tarea()
    {
        return $this->belongsTo('App\Models\Tarea', 'idtarea');
    }
}
