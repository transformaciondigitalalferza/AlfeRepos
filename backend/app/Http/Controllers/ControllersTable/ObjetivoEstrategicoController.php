<?php

namespace App\Http\Controllers\ControllersTable;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Objetivoestrategico;


class ObjetivoEstrategicoController extends Controller
{
    public function index()
    {
        return response()->json(Objetivoestrategico::all(), 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'tipoobjetivo' => 'required|integer',
            'descripcion' => 'required|string',
            'fechainicio' => 'required|date',
            'fechafin' => 'required|date',
            'fechaactualizacion' => 'required|date',
        ]);

        $objetivo = Objetivoestrategico::create($validatedData);

        return response()->json($objetivo, 201);
    }

    public function show($id)
    {
        $objetivo = Objetivoestrategico::find($id);

        if (!$objetivo) {
            return response()->json(['message' => 'Objetivo no encontrado'], 404);
        }

        return response()->json($objetivo, 200);
    }

    public function update(Request $request, $id)
    {
        $objetivo = Objetivoestrategico::find($id);

        if (!$objetivo) {
            return response()->json(['message' => 'Objetivo no encontrado'], 404);
        }

        $validatedData = $request->validate([
            'tipoobjetivo' => 'sometimes|integer',
            'descripcion' => 'sometimes|string',
            'fechainicio' => 'sometimes|date',
            'fechafin' => 'sometimes|date',
            'fechaactualizacion' => 'sometimes|date',
        ]);

        $objetivo->update($validatedData);

        return response()->json($objetivo, 200);
    }

    public function destroy($id)
    {
        $objetivo = Objetivoestrategico::find($id);

        if (!$objetivo) {
            return response()->json(['message' => 'Objetivo no encontrado'], 404);
        }

        $objetivo->delete();

        return response()->json(['message' => 'Objetivo eliminado correctamente'], 200);
    }
}
