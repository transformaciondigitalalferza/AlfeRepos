<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property integer $idarea
 * @property integer $idestaddo
 * @property string $codproyecto
 * @property string $nombreproyecto
 * @property Area $area
 * @property Estado $estado
 */
class proyecto extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'proyecto';

    /**
     * @var array
     */
    protected $fillable = ['idarea', 'idestaddo', 'codproyecto', 'nombreproyecto'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function area()
    {
        return $this->belongsTo('App\Models\Area', 'idarea');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function estado()
    {
        return $this->belongsTo('App\Models\Estado', 'idestaddo');
    }
}
