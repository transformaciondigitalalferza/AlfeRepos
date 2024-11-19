<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Politica extends Model
{
    protected $table = 'politica';
    
    protected $fillable = ['idcargo', 'archivo', 'nombre'];

    public function cargo()
    {
        return $this->belongsTo('App\Models\Cargo', 'idcargo');
    }
    public $timestamps = false;  
}
