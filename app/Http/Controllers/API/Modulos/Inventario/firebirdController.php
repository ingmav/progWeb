<?php
namespace App\Http\Controllers\API\Modulos\Inventario;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;

use Validator, DB;

use App\Models\Inventario\CatalogoArticulos;
class firebirdController extends Controller
{
    public function index(Request $request){
        try{
            $articulo = DB::TABLE('users')->get();
            //$db = DB::connection('mysql')->statement('select * from users')->get();
            return response()->json(['data'=>$articulo],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar obtener la lista de usuarios',0,$e);
        }
    }

}
