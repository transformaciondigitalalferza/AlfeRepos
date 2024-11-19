<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Tarea extends Model
{
    // Especifica el nombre de la tabla si no sigue la convención plural
    protected $table = 'tarea';

    // Campos asignables masivamente
    protected $fillable = [
        'idobjoperacional',
        'idusers',
        'idestado',
        'descripcion',
        'evidencia',
        'fechainicio',
        'fechafin',
        'fechaactualizacion',
    ];

    /**
     * Casteo de atributos para manejar tipos de datos.
     * 
     * Utilizamos 'date' con el formato 'Y-m-d' para asegurar que las fechas se serialicen en 'YYYY-MM-DD'.
     */
    protected $casts = [
        'fechainicio' => 'date:Y-m-d',
        'fechafin' => 'date:Y-m-d',
        'fechaactualizacion' => 'date:Y-m-d',
    ];

    // Atributos que se agregarán al modelo cuando se convierta a arrays o JSON
    protected $appends = ['evidencia_url'];

    // Indica si el modelo tiene marcas de tiempo (created_at, updated_at). Lo desactivamos.
    public $timestamps = false;

    /**
     * Método boot para manejar eventos de creación y actualización.
     * 
     * Actualiza 'fechaactualizacion' automáticamente al crear o actualizar una tarea.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($tarea) {
            $tarea->fechaactualizacion = now()->format('Y-m-d');
        });

        static::updating(function ($tarea) {
            $tarea->fechaactualizacion = now()->format('Y-m-d');
        });
    }

    /**
     * Relación con el modelo User.
     */
    public function user()
    {
        return $this->belongsTo('App\Models\User', 'idusers');
    }

    /**
     * Relación con el modelo ObjetivoOperacional.
     */
    public function objetivooperacional()
    {
        return $this->belongsTo('App\Models\Objetivooperacional', 'idobjoperacional');
    }

    /**
     * Relación con el modelo Estado.
     */
    public function estado()
    {
        return $this->belongsTo('App\Models\Estado', 'idestado');
    }

    /**
     * Relación con el modelo Subtarea.
     */
    public function subtareas()
    {
        return $this->hasMany('App\Models\Subtarea', 'idtarea');
    }

    /**
     * Accesor para obtener la URL completa de la evidencia.
     * 
     * @return string|null
     */
    public function getEvidenciaUrlAttribute()
    {
        return $this->evidencia ? Storage::url($this->evidencia) : null;
    }

    // Atributos ocultos al serializar (puedes agregar si es necesario)
    protected $hidden = [];
}
