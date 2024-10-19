<?php

namespace App\Http\Controllers\API\Modulos\Inventario;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;

use Validator, DB;

use App\Models\Inventario\CatalogoPersonal;

class PersonalController extends Controller
{
    public function index(Request $request){
        try{
            $loggedUser = auth()->userOrFail();

            $parametros = $request->all();
            $obj = CatalogoPersonal::getModel();

            
            //Filtros, busquedas, ordenamiento
            if($parametros['query']){
                $obj = $obj->where(function($query)use($parametros){
                    return $query->where('descripcion','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('cargo','LIKE','%'.$parametros['query'].'%');
                });
            }

            if((isset($parametros['sort']) && $parametros['sort']) && (isset($parametros['direction']) && $parametros['direction'])){
                $obj = $obj->orderBy($parametros['sort'],$parametros['direction']);
            }else{
                $obj = $obj->orderBy('updated_at','desc');
            }

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

    public function VerHistorial(Request $request){
        try{
            $parametros = $request->all();
            $obj = CatalogoPersonal::Join("movtos_detalles", "movtos_detalles.catalogo_personal_id", "catalogo_personal.id")
                                        ->Join("movtos", "movtos.id", "movtos_detalles.movtos_id")
                                        ->Join("catalogo_articulos", "catalogo_articulos.id", "movtos_detalles.articulo_id")
                                        ->Join("catalogo_unidad", "catalogo_unidad.id", "catalogo_articulos.catalogo_unidad_id")
                                        ->orderBy("movtos.fecha_movimiento", "desc")
                                        ->select(
                                            "catalogo_personal.id",
                                            "movtos.fecha_movimiento", 
                                                "catalogo_articulos.descripcion", 
                                                DB::RAW("IF(movtos.tipo_movto=1,'ENTRADA','SALIDA') AS tipo_movimiento"),
                                                "movtos_detalles.cantidad",
                                                "catalogo_unidad.abreviatura")
                                        ->where("catalogo_personal.id", $parametros['trabajador_id']);

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 7;
    
                $obj = $obj->paginate($resultadosPorPagina);
            } else {
                $obj = $obj->get();
            }

            return response()->json(['data'=>$obj],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar obtener la lista de usuarios',0,$e);
        }
    }

    public function show($id, Request $request){
        try{
            $loggedUser = auth()->userOrFail();

            $parametros = $request->all();
            $obj = CatalogoPersonal::find($id);

            return response()->json(['data'=>$obj],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar obtener la lista de usuarios',0,$e);
        }
    }

    public function store(Request $request){
        try{
            $validation_rules = [
                'descripcion' => 'required',
                'cargo' => 'required'
            ];
        
            $validation_eror_messages = [
                'descripcion.required' => 'El nombre es requerido',
                'cargo.required' => 'El cargo es requerido',
            ];

            $parametros = $request->all(); 
            $parametros = $parametros['params']; 
            $resultado = Validator::make($parametros,$validation_rules,$validation_eror_messages);

            if($resultado->passes()){
                DB::beginTransaction();
                $usuario = auth()->userOrFail();
                if(isset($parametros['id']) && $parametros['id']!=0)
                {
                    $obj = CatalogoPersonal::find($parametros['id']);
                }else
                {
                    $obj = new CatalogoPersonal();
                }
                $obj->descripcion = strtoupper($parametros['descripcion']);
                $obj->cargo = strtoupper($parametros['cargo']);
                $obj->user_id = $usuario->id;
                $obj->save();
                DB::commit();
                return response()->json(['data'=>$obj],HttpResponse::HTTP_OK);
            }else{
                return response()->json(['mensaje' => 'Error en los datos del formulario', 'validacion'=>$resultado->passes(), 'errores'=>$resultado->errors()], HttpResponse::HTTP_CONFLICT);
            }
        }catch(\Exception $e){
            DB::rollback();
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar guardar el rol',0,$e);
        }
    }

    public function destroy($id)
    {
        try{
            $rol = CatalogoPersonal::find($id);
            $rol->delete();

            return response()->json(['data'=>'Registro eliminado'], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar eliminar el rol',0,$e);
        }
    }
}
