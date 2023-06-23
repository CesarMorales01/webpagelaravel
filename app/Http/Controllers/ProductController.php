<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Response;
use App\Models\Globalvar;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public $global = null;

    public function __construct()
    {
        $this->global = new Globalvar();
    }

    public function index()
    {
        $auth = Auth()->user();
        $promos = DB::table('promociones')->orderBy('id', 'desc')->get();
        $info = DB::table('info_pagina')->first();
        $telefonosPagina = DB::table('telefonos_pagina')->get();
        $info->telefonos = $telefonosPagina;
        $globalVars = $this->global->getGlobalVars();
        $productos = DB::table('productos')->orderBy('id', 'desc')->get();
        foreach ($productos as $producto) {
            $imagen = DB::table($this->global->getGlobalVars()->tablaImagenes)->where('fk_producto', '=', $producto->id)->first();
            $producto->imagen = $imagen;
        }
        $categorias = DB::table('categorias')->get();
        return Inertia::render('Welcome', compact('auth', 'promos', 'info', 'globalVars', 'productos', 'categorias'));
    }

    public function product(string $id)
    {
        $auth = Auth()->user();
        $info = DB::table('info_pagina')->first();
        $telefonosPagina = DB::table('telefonos_pagina')->get();
        $info->telefonos = $telefonosPagina;
        $globalVars = $this->global->getGlobalVars();
        $producto = DB::table('productos')->select('id', 'referencia', 'categoria', 'nombre', 'cantidad', 'valor', 'descripcion')->where('id', '=', $id)->first();
        $imagen = DB::table($this->global->getGlobalVars()->tablaImagenes)->where('fk_producto', '=', $id)->get();
        $producto->imagen = $imagen;
        $productos = DB::table('productos')->orderBy('id', 'desc')->get();
        foreach ($productos as $item) {
            $imagen = DB::table($this->global->getGlobalVars()->tablaImagenes)->where('fk_producto', '=', $item->id)->first();
            $item->imagen = $imagen;
        }
        $categorias = DB::table('categorias')->get();
        $token = csrf_token();
        return Inertia::render('Product/Product', compact('auth', 'info', 'globalVars', 'producto', 'categorias', 'productos', 'token'));
    }

    public function searchProduct(string $producto){
        $auth = Auth()->user();
        $info = DB::table('info_pagina')->first();
        $telefonosPagina = DB::table('telefonos_pagina')->get();
        $info->telefonos = $telefonosPagina;
        $globalVars = $this->global->getGlobalVars();
        $productos = DB::table('productos')->orWhere('nombre', 'like', '%'.$producto.'%')->orWhere('descripcion', 'like', '%'.$producto.'%')->orWhere('categoria', 'like', '%'.$producto.'%')->get();
        foreach ($productos as $item) {
            $imagen = DB::table($this->global->getGlobalVars()->tablaImagenes)->where('fk_producto', '=', $item->id)->first();
            $item->imagen = $imagen->nombre_imagen;
            $item->codigo=$item->id;
        }
        $allproducts = DB::table('productos')->orderBy('id', 'desc')->get();
        foreach ($allproducts as $item) {
            $imagen = DB::table($this->global->getGlobalVars()->tablaImagenes)->where('fk_producto', '=', $item->id)->first();
            $item->imagen = $imagen->nombre_imagen;
        }
        $categorias = DB::table('categorias')->get();
        return Inertia::render('Product/Search', compact('auth', 'info', 'globalVars', 'productos', 'allproducts', 'categorias', 'producto'));
    }
}
