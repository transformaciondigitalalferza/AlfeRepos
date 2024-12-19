<?php

namespace App\Http\Controllers;

use App\Models\MigracionesPagadas;
use Illuminate\Http\Request;

class MigracionesPagadasController extends Controller
{
    public function index()
    {
        $migraciones = MigracionesPagadas::all();
        return response()->json($migraciones);
    }

    public function store(Request $request)
    {
        $request->validate([
            'codigo_unidad' => 'required|string|max:510',
            'username_creador' => 'required|string|max:510',
            'nombres' => 'required|string|max:255',
            'fechapagocomision' => 'nullable|date',
        ]);

        $migracion = MigracionesPagadas::create($request->all());

        return response()->json($migracion, 201);
    }

    public function show($id)
    {
        $migracion = MigracionesPagadas::find($id);

        if (!$migracion) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }

        return response()->json($migracion);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'codigo_unidad' => 'nullable|string|max:510',
            'username_creador' => 'nullable|string|max:510',
            'nombres' => 'nullable|string|max:255',
            'fechapagocomision' => 'nullable|date',
        ]);

        $migracion = MigracionesPagadas::find($id);

        if (!$migracion) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }

        $migracion->update($request->all());

        return response()->json($migracion);
    }

    public function destroy($id)
    {
        $migracion = MigracionesPagadas::find($id);

        if (!$migracion) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }

        $migracion->delete();

        return response()->json(['message' => 'Registro eliminado correctamente'], 200);
    }
}
