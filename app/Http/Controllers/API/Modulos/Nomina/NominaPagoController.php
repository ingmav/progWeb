<?php

namespace App\Http\Controllers\API\Modulos\Nomina;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;
use Validator, DB;

use App\Models\Nomina\NominaPago;


class NominaPagoController extends Controller
{
    public function index(Request $request){
        try{
            $loggedUser = auth()->userOrFail();

            $parametros = $request->all();
            
            $obj = NominaPago::with("Personal","PagosDetalles.Conceptos");

            
            if(isset($parametros['catalogo_nomina_id']))
            {
                $obj  = $obj->where("catalogo_nomina_id", $parametros['catalogo_nomina_id']);
            }
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $obj = $obj->where(function($query)use($parametros){
                    return $query->whereRaw('catalogo_personal_id in (select id from catalogo_personal where concat(nombres," ",apellido_paterno," ",apellido_materno) LIKE \'%' . $parametros['query'] .'%\')');
                });
            }

            /*if((isset($parametros['sort']) && $parametros['sort']) && (isset($parametros['direction']) && $parametros['direction'])){
                $obj = $obj->orderBy($parametros['sort'],$parametros['direction']);
            }else{*/
                //$obj = $obj->orderBy('fecha','desc');
            //}

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $obj = $obj->paginate($resultadosPorPagina);
            } else {
                $obj = $obj->get();
            }

            return response()->json(['data'=>$obj],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar obtener la lista de usuarios',0,$e);
        }
    }
}
