<?php

namespace App\Http\Controllers\ControllersTable;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\cargo;

class CargoController extends Controller
{
    public function index()
    {
        $cargos = cargo::all();
        return response()->json($cargos);
    }

    public function show($id)
    {
        $cargo = cargo::find($id);

        if ($cargo) {
            return response()->json($cargo);
        } else {
            return response()->json(['mensaje' => 'Cargo no encontrado'], 404);
        }
    }
}
