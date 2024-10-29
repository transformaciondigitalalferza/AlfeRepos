<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property integer $idoperativo
 * @property string $nombreindicador
 * @property float $valormeta
 * @property float $valoractual
 * @property Objetivooperacional $objetivooperacional
 */
class Indicadore extends Model
{
    /**
     * @var array
     */
    protected $fillable = ['idoperativo', 'nombreindicador', 'valormeta', 'valoractual'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function objetivooperacional()
    {
        return $this->belongsTo('App\Models\Objetivooperacional', 'idoperativo');
    }
}
