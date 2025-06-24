<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTablesNomina extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        /*Schema::create('catalogo_conceptos', function (Blueprint $table) {
            $table->id();
            $table->string("descripcion",150);
            $table->string("abreviatura",150);
            $table->smallInteger("tipo")->unsigned()->comment("1=percepcion, 2 retencion ");
            $table->string("clave",);
            $table->timestamps();
            $table->softDeletes();
        });
        
        Schema::create('catalogo_nomina', function (Blueprint $table) {
            $table->id();
            $table->date("fecha");
            $table->date("periodo_inicio");
            $table->date("periodo_fin");
            $table->string("tipo",2)->default('1')->comment("1=> ORODINARIA, 2 =>EXTRAORDINARIA");
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('catalogo_nomina_pago', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("catalogo_nomina_id")->unsigned();
            $table->bigInteger("catalogo_personal_id")->unsigned();
            $table->decimal("total_percepciones",15,2);
            $table->decimal("total_deducciones",15,2);
            $table->decimal("total_neto",15,2);
            

            $table->foreign('catalogo_personal_id')->references('id')->on('catalogo_personal');
            $table->foreign('catalogo_nomina_id')->references('id')->on('catalogo_nomina');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('catalogo_nomina_pago_detalle', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("catalogo_nomina_pago_id")->unsigned();
            $table->bigInteger("catalogo_conceptos_id")->unsigned();
            $table->mediumInteger("unidades")->unsigned();
            $table->decimal("importe_unitario",15,2);
            $table->decimal("subtotal",15,2);
            

            $table->foreign('catalogo_nomina_pago_id')->references('id')->on('catalogo_nomina_pago');
            $table->foreign('catalogo_conceptos_id')->references('id')->on('catalogo_conceptos');
            $table->timestamps();
            $table->softDeletes();
        });*/

        Schema::create('catalogo_nomina_periodicos', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("catalogo_conceptos_id")->unsigned();
            $table->bigInteger("catalogo_personal_id")->unsigned();
            $table->decimal("monto", 15,2)->default(0);
            $table->date("fecha_inicial")->nullable();
            $table->date("fecha_final")->nullable();
            

            $table->foreign('catalogo_conceptos_id')->references('id')->on('catalogo_conceptos');
            $table->foreign('catalogo_personal_id')->references('id')->on('catalogo_personal');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('catalogo_nomina_periodicos');
        /*Schema::dropIfExists('catalogo_nomina_pago_detalle');
        Schema::dropIfExists('catalogo_nomina_pago');
        Schema::dropIfExists('catalogo_nomina');
        Schema::dropIfExists('catalogo_conceptos');*/
    }
}
