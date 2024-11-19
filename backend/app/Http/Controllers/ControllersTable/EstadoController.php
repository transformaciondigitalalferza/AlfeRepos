<?php

namespace App\Http\Controllers\ControllersTable;

use App\Http\Controllers\Controller;
use App\Models\Estado;
use Illuminate\Http\Request;

class EstadoController extends Controller
{
    // Listar todos los estados
    public function index()
    {
        return response()->json(Estado::all(), 200);
    }

    // Mostrar un estado específico
    public function show($id)
    {
        $estado = Estado::find($id);

        if (!$estado) {
            return response()->json(['message' => 'Estado no encontrado'], 404);
        }

        return response()->json($estado, 200);
    }

    // Crear un nuevo estado
    public function store(Request $request)
    {
        $validated = $request->validate([
            'descripcion' => 'required|string|max:255',
        ]);

        $estado = Estado::create($validated);

        return response()->json($estado, 201);
    }

    // Actualizar un estado existente
    public function update(Request $request, $id)
    {
        $estado = Estado::find($id);

        if (!$estado) {
            return response()->json(['message' => 'Estado no encontrado'], 404);
        }

        $validated = $request->validate([
            'descripcion' => 'sometimes|required|string|max:255',
        ]);

        $estado->update($validated);

        return response()->json($estado, 200);
    }

    // Eliminar un estado
    public function destroy($id)
    {
        $estado = Estado::find($id);

        if (!$estado) {
            return response()->json(['message' => 'Estado no encontrado'], 404);
        }

        $estado->delete();

        return response()->json(['message' => 'Estado eliminado correctamente'], 200);
    }
}
