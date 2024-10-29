<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property integer $tipoobjetivo
 * @property string $descripcion
 * @property string $fechainicio
 * @property string $fechafin
 * @property string $fechaactualizacion
 * @property Tipoobjetivo $tipoobjetivo
 * @property Objetivooperacional[] $objetivooperacionals
 */
class Objetivoestrategico extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'objetivoestrategico';

    /**
     * @var array
     */
    protected $fillable = ['tipoobjetivo', 'descripcion', 'fechainicio', 'fechafin', 'fechaactualizacion'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function tipoobjetivo()
    {
        return $this->belongsTo('App\Models\Tipoobjetivo', 'tipoobjetivo');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function objetivooperacionals()
    {
        return $this->hasMany('App\Models\Objetivooperacional', 'idobjetivoestrategico');
    }
}
