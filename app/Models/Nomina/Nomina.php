<?php

namespace App\Models\Nomina;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Nomina extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_nomina';
    protected $fillable = [
      
    ];

    public function Pagos(){
        return $this->hasMany('App\Models\Nomina\NominaPago', "catalogo_nomina_id", "id");
    }
}
