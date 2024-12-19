<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Perspectiva extends Model
{
    protected $table = 'Perspectiva';
    protected $fillable = ['Descripcion'];
    public $timestamps = false;
    public function objetivoestrategico()
    {
        return $this->HasMany('App\Models\Objetivoestrategico');
    }
}
