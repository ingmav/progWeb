<?php

namespace App\Models\Inventario;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CatalogoPersonal extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_personal';
    protected $fillable = [
        'descripcion',
        'cargo',
        'user_id'
    ];
}
