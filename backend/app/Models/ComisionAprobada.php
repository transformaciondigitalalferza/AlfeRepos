<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ComisionAprobada extends Model
{
    protected $table = 'comisionaprobada';

    protected $primaryKey = 'id';

    public $incrementing = true;

    protected $keyType = 'int';

    public $timestamps = false;

    protected $fillable = [
        'codigo_proyecto',
        'codigo_unidad',
        'codigo_proforma',
        'username_creador',
        'moneda',
        'total_pagado',
        'precio_base_proforma',
        'financiamiento',
        'dormitorios',
        'desc_m2',
        'porcent_pagado',
        'fecha_migracion',
        'nombres',
        'fecseparacion',
        'fecinicial',
        'pagado',
    ];

    protected $casts = [
        'total_pagado' => 'decimal:2',
        'precio_base_proforma' => 'decimal:2',
        'desc_m2' => 'decimal:2',
        'porcent_pagado' => 'decimal:2',
        'dormitorios' => 'integer',
        'fecha_migracion' => 'date',
        'fecseparacion' => 'date',
        'fecinicial' => 'date',
        'pagado' => 'boolean',
    ];
}
