<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use stdClass;

class Globalvar extends Model
{
    use HasFactory;

    public $globalVars;

    function __construct()
    {
        $this->globalVars = new stdClass();
       
       //$this->globalVars->thisUrl="https://tucasabonita.site/";
       $this->globalVars->thisUrl = "http://webpage.test/";

       $this->globalVars->urlRoot="https://bellohogar.online/";

        /* Se debe crear una url para las imagenes porque <img /> lee url no directorios.*/
         $this->globalVars->urlProd="https://bellohogar.online/";

        /*laravel no permite tablas con nombre en mayuscula y el proyecto ya esta con esta tabla con mayuscula*/
        $this->globalVars->tablaImagenes = "imagenes_productos";
    }


    public function getGlobalVars()
    {
        return $this->globalVars;
    }
}
