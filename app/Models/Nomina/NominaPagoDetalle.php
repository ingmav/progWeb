<?php

namespace App\Models\Nomina;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NominaPagoDetalle extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_nomina_pago_detalle';
    protected $fillable = [
      
    ];


    public function Conceptos(){
        return $this->belongsTo('App\Models\Nomina\CatalogoConceptos', "catalogo_conceptos_id", "id")->withTrashed();
    }
    
}
