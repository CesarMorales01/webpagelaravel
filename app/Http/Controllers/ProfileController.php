<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Globalvar;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public $global = null;

    public function __construct()
    {
        $this->global = new Globalvar();
    }

    public function create()
    {
        $info = DB::table('info_pagina')->first();
        $globalVars = $this->global->getGlobalVars();
        $productos = DB::table('productos')->orderBy('id', 'desc')->get();
        foreach ($productos as $producto) {
            $imagen = DB::table($this->global->getGlobalVars()->tablaImagenes)->where('fk_producto', '=', $producto->id)->first();
            $producto->imagen = $imagen;
        }
        $auth = Auth()->user();
        $token = csrf_token();
        return Inertia::render('Profile/CrearCuenta', compact('auth','info', 'globalVars', 'productos', 'token'));
    }

    public function redirectLogin($request){
        
    }
   
    public function store(Request $request)
    {
        
        $auth = Auth()->user();
        $info = DB::table('info_pagina')->first();
        $globalVars = $this->global->getGlobalVars();  
        $productos = DB::table('productos')->orderBy('id', 'desc')->get();
        foreach ($productos as $producto) {
            $imagen = DB::table($this->global->getGlobalVars()->tablaImagenes)->where('fk_producto', '=', $producto->id)->first();
            $producto->imagen = $imagen;
        }
        return Redirect::route('gologin')->with('message', 'something');

      //  return Inertia::render();
         
       // app('App\Http\Controllers\Auth\AuthenticatedSessionController')->store($request);
        /*
        DB::table('keys')->insert([
            'name'=> $request->nombre,
            'email'=>$request->mail,
            'password'=> Hash::make($request->clave)
        ]);

        
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
        */
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    public function destroy(Request $request)//: RedirectResponse
    {
        return response()->json($request, 200, []);
        /*
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
        */
    }

    public function checkemail(string $email)
    {
        $validar= DB::table('keys')->where('email', '=', $email)->first();
        if($validar!=null){
            return response()->json($validar->email, 200, []);
        }else{
            return response()->json("vacio", 200, []);
        }  
    }
}
