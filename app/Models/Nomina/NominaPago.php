<?php

namespace App\Models\Nomina;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use DB;
class NominaPago extends Model
{
    use SoftDeletes;
    protected $table = 'catalogo_nomina_pago';
    protected $fillable = [
      
    ];

    public function PagosDetalles(){
        return $this->hasMany('App\Models\Nomina\NominaPagoDetalle', "catalogo_nomina_pago_id", "id");
    }

    public function Personal(){
        return $this->belongsTo('App\Models\Inventario\CatalogoPersonal', "catalogo_personal_id", "id")->withTrashed()->select("id", "cargo", DB::RAW("concat(nombres,' ', apellido_paterno,' ',apellido_materno) as nombre_completo"), "deleted_at");
    }
}
