<?php

namespace App\Models\Nomina;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CatalogoConceptos extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_conceptos';
    protected $fillable = [
      
    ];

}
