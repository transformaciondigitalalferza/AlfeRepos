<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property integer $idobjetivoestrategico
 * @property integer $idfrecuencia
 * @property string $descripcion
 * @property float $meta
 * @property string $fechainicio
 * @property string $fechafin
 * @property string $fechaactualizacion
 * @property Indicadore[] $indicadores
 * @property Frecuencia $frecuencia
 * @property Objetivoestrategico $objetivoestrategico
 * @property Tarea[] $tareas
 */
class Objetivooperacional extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'objetivooperacional';

    /**
     * @var array
     */
    protected $fillable = ['idobjetivoestrategico', 'idfrecuencia', 'descripcion', 'meta', 'fechainicio', 'fechafin', 'fechaactualizacion'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function indicadores()
    {
        return $this->hasMany('App\Models\Indicadore', 'idoperativo');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function frecuencium()
    {
        return $this->belongsTo('App\Models\Frecuencium', 'idfrecuencia');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function objetivoestrategico()
    {
        return $this->belongsTo('App\Models\Objetivoestrategico', 'idobjetivoestrategico');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function tareas()
    {
        return $this->hasMany('App\Models\Tarea', 'idobjoperacional');
    }
}
