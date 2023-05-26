<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Inertia\Response;
use App\Models\Globalvar;

use Illuminate\Http\Request;
use Inertia\Inertia;
use stdClass;

class SessionController extends Controller
{
    public $global = null;

    public function __construct()
    {
        $this->global = new Globalvar();
    }

    public function login(string $messaje){
        $auth = Auth()->user();
        $info = DB::table('info_pagina')->first();
        $globalVars = $this->global->getGlobalVars();  
        $productos = DB::table('productos')->orderBy('id', 'desc')->get();
        foreach ($productos as $producto) {
            $imagen = DB::table($this->global->getGlobalVars()->tablaImagenes)->where('fk_producto', '=', $producto->id)->first();
            $producto->imagen = $imagen;
        }
        $request=new stdClass();
        $request->email='';
        return Inertia::render('Auth/Login', compact('info', 'globalVars', 'productos', 'auth', 'request'));
    }
}
