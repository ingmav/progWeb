<?php

namespace App\Http\Controllers\API\Modulos\Nomina;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;
use App\Models\Capacitacion\RelTrabajadorPuesto;
use Validator, DB;

use App\Models\Inventario\CatalogoPersonal;

class AsistenciaController extends Controller
{
    public function index(Request $request){
        try{
            $loggedUser = auth()->userOrFail();

            $parametros = $request->all();
            $obj = [];
            return response()->json(['data'=>$obj],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar obtener la lista de usuarios',0,$e);
        }
    }


    public function importar(Request $request){
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
            //DB::statement("CREATE  TABLE __asistencia (id int AUTO_INCREMENT PRIMARY KEY, departamento varchar(250), empleado varchar(250),entrada date, salida date, horas decimal(12,2))");
            
            $index = 0;
            $bandera = 0;

            foreach ($parametros as $key => $value) {
                if(isset($value['Departamento']))
                {
                    $registros[$key]['departamento'] = $value['Departamento'];
                    $registros[$key]['empleado'] = $value['Empleado'];
                    $registros[$key]['entrada'] = $value['Entrada'];
                    $registros[$key]['salida'] = $value['Salida'];
                    $registros[$key]['horas'] = $value['Horas trabajadas'];
                    $bandera++;
                    if($bandera == 1000)
                    {
                        $index++;
                        $bandera = 0;
                    }
                }
            }
            
            foreach ($registros as $key => $value) {
                DB::TABLE("__asistencia")->insert($value);
            }
            
        }catch(\Exception $e){
            DB::rollback();
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar guardar el rol',0,$e);
        }
    }

}
