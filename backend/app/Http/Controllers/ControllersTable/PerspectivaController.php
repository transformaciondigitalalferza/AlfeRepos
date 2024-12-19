<?php

namespace App\Http\Controllers\ControllersTable;

use App\Http\Controllers\Controller;
use App\Models\Perspectiva;
use Illuminate\Http\Request;

class PerspectivaController extends Controller
{
    public function index()
    {
        $perspectivas = Perspectiva::all();
        return response()->json($perspectivas, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'Descripcion' => 'required|string|max:255'
        ]);

        $perspectiva = Perspectiva::create([
            'Descripcion' => $request->Descripcion
        ]);

        return response()->json($perspectiva, 201);
    }

    public function show($id)
    {
        $perspectiva = Perspectiva::find($id);

        if (!$perspectiva) {
            return response()->json(['message' => 'Perspectiva no encontrada'], 404);
        }

        return response()->json($perspectiva, 200);
    }

    public function update(Request $request, $id)
    {
        $perspectiva = Perspectiva::find($id);
        
        if (!$perspectiva) {
            return response()->json(['message' => 'Perspectiva no encontrada'], 404);
        }

        $request->validate([
            'Descripcion' => 'required|string|max:255'
        ]);

        $perspectiva->Descripcion = $request->Descripcion;
        $perspectiva->save();

        return response()->json($perspectiva, 200);
    }

    public function destroy($id)
    {
        $perspectiva = Perspectiva::find($id);

        if (!$perspectiva) {
            return response()->json(['message' => 'Perspectiva no encontrada'], 404);
        }

        $perspectiva->delete();

        return response()->json(['message' => 'Perspectiva eliminada con éxito'], 200);
    }
}
