<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Globalvar;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use PhpParser\Node\Expr\Cast\Object_;

class ShoppingController extends Controller
{
    public $global = null;

    public function __construct()
    {
        $this->global = new Globalvar();
    }

    public function create()
    {
        //Lista compras
        $auth = Auth()->user();

        $cedula = DB::table('keys')->where('email', '=', $auth->email)->first();
        $datosCliente = null;
        $listaCompras = [];
        if ($cedula->cedula != null) {
            $datosCliente = DB::table('clientes')->where('cedula', '=', $cedula->cedula)->first();
            $listaCompras = DB::table('lista_compras')->where('cliente', '=', $datosCliente->cedula)->get();
            foreach ($listaCompras as $item) {
                $productosComprados = DB::table('lista_productos_comprados')->where('cliente', '=', $datosCliente->cedula)->where('compra_n', '=', $item->compra_n)->get();
                $imagen = null;
                foreach ($productosComprados as $producto) {
                    $imagen = DB::table($this->global->getGlobalVars()->tablaImagenes)->where('fk_producto', '=', $producto->codigo)->first();
                    if ($imagen != null) {
                        $producto->imagen = $imagen->nombre_imagen;
                    }
                }
                $item->productos = $productosComprados;
            }
        }
        $info = DB::table('info_pagina')->first();
        $telefonosPagina = DB::table('telefonos_pagina')->get();
        $info->telefonos = $telefonosPagina;
        $globalVars = $this->global->getGlobalVars();
        $productos = DB::table('productos')->orderBy('id', 'desc')->get();
        foreach ($productos as $item) {
            $imagen = DB::table($this->global->getGlobalVars()->tablaImagenes)->where('fk_producto', '=', $item->id)->first();
            $item->imagen = $imagen->nombre_imagen;
        }

        $categorias = DB::table('categorias')->get();
        return Inertia::render('Shopping/MisCompras', compact('info', 'globalVars', 'productos', 'auth', 'categorias', 'listaCompras'));
    }

    public function registrarcompra(Request $request)
    {
        //Ingresar en lista de compras.
        $datos = json_decode(file_get_contents('php://input'));
        $get_compra_n = DB::table('lista_compras')->where('cliente', '=', $datos->cliente->cedula)->orderBy('id', 'desc')->pluck('compra_n');
        $compra_n = 1;
        if (count($get_compra_n) > 0) {
            $compra_n = $compra_n + $get_compra_n[0];
        }
        $lista=DB::table('lista_compras')->insert([
            'cliente'=> $datos->cliente->cedula,
            'compra_n'=> $compra_n,
            'fecha'=> $datos->fecha,
            'total_compra'=> $datos->totales->subtotal,
            'domicilio'=>$datos->totales->envio,
            'medio_de_pago'=>$datos->totales->medioPago,
            'comentarios'=>$datos->comentarios,
            'estado'=>'Recibida'
        ]);  
        $productos = $this->ingresarProductosComprados($datos, $compra_n);
        if($productos>0){
            DB::table('carrito_compras')->where('cliente', '=', Auth()->user()->email)->delete();
        }
        return response()->json($productos, 200, []);
    }

    public function ingresarProductosComprados($datos, $compra_n)
    {
        $nums = null;
        foreach ($datos->productos as $item) {
            DB::table('lista_productos_comprados')->insert([
                'cliente' => $datos->cliente->cedula,
                'compra_n' => $compra_n,
                'codigo' => $item->cod,
                'producto' => $item->producto,
                'cantidad' => $item->cantidad,
                'precio' => $item->valor
            ]);
            $this->restarInventario($item);
            $nums++;
        }
        return $nums;
    }

    public function restarInventario($item)
    {
        $actualCant = DB::table('productos')->where('id', '=', $item->cod)->first();
        $newCant = $actualCant->cantidad - $item->cantidad;
        DB::table('productos')->where('id', '=', $item->cod)->update([
            'cantidad' => $newCant
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth()->user();
        $carrito = DB::table('carrito_compras')->where('cliente', '=', $user->email)->get();
        $cant = $request->cantidad;
        if (count($carrito) > 0) {
            foreach ($carrito as $item) {
                if ($item->cod == $request->codigo) {
                    $cant = $cant + $item->cantidad;
                }
            }
            if ($cant !== $request->cantidad) {
                DB::table('carrito_compras')->where('cliente', '=', $user->email)->where('cod', '=', $request->codigo)->update([
                    'valor' => $request->valor,
                    'cantidad' => $cant,
                    'fecha' => $request->fecha
                ]);
            } else {
                $this->insertarCarrito($request);
            }
        } else {
            $this->insertarCarrito($request);
        }
        return Redirect::route('shopping.edit', $user->email);
    }

    public function insertarCarrito(Request $request)
    {
        DB::table('carrito_compras')->insert([
            'cod' => $request->codigo,
            'producto' => $request->nombre,
            'imagen' => $request->imagen,
            'valor' => $request->valor,
            'cantidad' => $request->cantidad,
            'cliente' => Auth()->user()->email,
            'fecha' => $request->fecha
        ]);
    }

    public function show(string $id)
    {
        if ($id == 'checkout') {
            // Al recargar la pagina se cargar get en vez de post shopping/checkout.
            return Redirect::route('shopping.edit', Auth()->user()->email);
        } else {
            //Muestra el numero de articulos en el icono de carrito de compras en navbar
            $carrito = DB::table('carrito_compras')->where('cliente', '=', $id)->get();
            return response()->json($carrito, 200, []);
        }
    }

    public function edit(string $id)
    {
        $auth = Auth()->user();
        $cedula = DB::table('keys')->where('email', '=', $auth->email)->first();
        $datosCliente = null;
        if ($cedula->cedula != null) {
            $datosCliente = DB::table('clientes')->where('cedula', '=', $cedula->cedula)->first();
            $telefonos = DB::table('telefonos_clientes')->where('cedula', '=', $cedula->cedula)->get();
            $tels = [];
            foreach ($telefonos as $tel) {
                $tels[] = $tel->telefono;
            }
            $datosCliente->telefonos = $tels;
        }
        $info = DB::table('info_pagina')->first();
        $telefonosPagina = DB::table('telefonos_pagina')->get();
        $info->telefonos = $telefonosPagina;
        $globalVars = $this->global->getGlobalVars();
        $productos = DB::table('productos')->select('id', 'referencia', 'categoria', 'nombre', 'cantidad', 'valor', 'descripcion')->orderBy('id', 'desc')->get();
        foreach ($productos as $item) {
            $imagen = DB::table($this->global->getGlobalVars()->tablaImagenes)->where('fk_producto', '=', $item->id)->first();
            $item->imagen = $imagen->nombre_imagen;
        }
        $carrito = DB::table('carrito_compras')->where('cliente', '=', $id)->get();
        $deptos = DB::table('departamentos')->get();
        $municipios = DB::table('municipios')->get();
        $categorias = DB::table('categorias')->get();
        $token = csrf_token();
        return Inertia::render('Shopping/Shopping', compact('info', 'globalVars', 'productos', 'auth', 'carrito', 'datosCliente', 'municipios', 'deptos', 'categorias', 'token'));
    }

    public function eliminar(string $id)
    {
        DB::table('carrito_compras')->where('cliente', '=', Auth()->user()->email)->where('cod', '=', $id)->delete();
        $carrito = DB::table('carrito_compras')->where('cliente', '=', Auth()->user()->email)->get();
        return response()->json($carrito, 200, []);
    }

    public function actualizarCarrito(string $cod, string $cant)
    {
        DB::table('carrito_compras')->where('cliente', '=', Auth()->user()->email)->where('cod', '=', $cod)->update([
            'cantidad' => $cant
        ]);
        $carrito = DB::table('carrito_compras')->where('cliente', '=', Auth()->user()->email)->get();
        return response()->json($carrito, 200, []);
    }
}
