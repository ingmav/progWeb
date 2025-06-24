<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;
use App\Models\Capacitacion\RelTrabajadorPuesto;
use Validator, DB;

use App\Models\Inventario\CatalogoPersonal;
use App\Models\Nomina\CatalogoConceptos;

class CatalogosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {

            $parametros = $request->all();
            //return response()->json(['data'=>$parametros],HttpResponse::HTTP_OK);

            $resultado = [];
            foreach ($parametros as $key => $value) {
                switch ($value) {
                    case 'personal':
                        $resultado['personal'] = CatalogoPersonal::select("id", "cargo", DB::RAW("concat(nombres,' ', apellido_paterno,' ',apellido_materno) as nombre_completo"), "deleted_at")->get();
                        break;
                    case 'conceptos':
                        $resultado['conceptos'] = CatalogoConceptos::all();
                        break;
                }
            }
            $obj = [];
            return response()->json(['data' => $resultado], HttpResponse::HTTP_OK);
        } catch (\Exception $e) {
            throw new \App\Exceptions\LogError('Ocurrio un error al intentar obtener la lista de usuarios', 0, $e);
        }

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
