<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MigracionesPagadas extends Model
{
    use HasFactory;

    protected $table = 'migracionespagadas';

    protected $fillable = [
        'codigo_unidad',
        'username_creador',
        'nombres',
        'fechapagocomision',
    ];

    public $timestamps = false;

    protected $primaryKey = 'id';
    protected $keyType = 'int';
}
