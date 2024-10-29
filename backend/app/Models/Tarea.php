<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property integer $idobjoperacional
 * @property integer $idusers
 * @property integer $idestado
 * @property string $descripcion
 * @property string $evidencia
 * @property string $fechainicio
 * @property string $fechafin
 * @property string $fechaactualizacion
 * @property User $user
 * @property Objetivooperacional $objetivooperacional
 * @property Estado $estado
 * @property Subtarea[] $subtareas
 */
class tarea extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'tarea';

    /**
     * @var array
     */
    protected $fillable = ['idobjoperacional', 'idusers', 'idestado', 'descripcion', 'evidencia', 'fechainicio', 'fechafin', 'fechaactualizacion'];

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
    public function objetivooperacional()
    {
        return $this->belongsTo('App\Models\Objetivooperacional', 'idobjoperacional');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function estado()
    {
        return $this->belongsTo('App\Models\Estado', 'idestado');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function subtareas()
    {
        return $this->hasMany('App\Models\Subtarea', 'idtarea');
    }
}
