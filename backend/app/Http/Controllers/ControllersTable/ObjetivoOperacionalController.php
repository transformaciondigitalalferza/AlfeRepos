<?php

namespace App\Http\Controllers\ControllersTable;

use App\Http\Controllers\Controller;
use App\Models\Objetivooperacional;
use Illuminate\Http\Request;

class ObjetivoOperacionalController extends Controller
{
    public function index()
    {
        $objetivos = Objetivooperacional::all();
        return response()->json($objetivos, 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'idobjetivoestrategico' => 'required|integer|exists:objetivoestrategico,id',
            'idfrecuencia' => 'required|integer|exists:frecuencia,id',
            'descripcion' => 'required|string|max:255',
            'meta' => 'required|numeric',
            'fechainicio' => 'required|date',
            'fechafin' => 'nullable|date', // Opcional
            'fechaactualizacion' => 'required|date',
            'idarea' => 'nullable|integer|exists:area,id', // Opcional
        ]);

        $objetivo = Objetivooperacional::create($validatedData);
        return response()->json($objetivo, 201);
    }

    public function show($id)
    {
        $objetivo = Objetivooperacional::find($id);

        if (!$objetivo) {
            return response()->json(['message' => 'Objetivo Operacional no encontrado'], 404);
        }

        return response()->json($objetivo, 200);
    }

    public function update(Request $request, $id)
    {
        $objetivo = Objetivooperacional::find($id);
    
        if (!$objetivo) {
            return response()->json(['message' => 'Objetivo Operacional no encontrado'], 404);
        }
    
        $validatedData = $request->validate([
            'idobjetivoestrategico' => 'sometimes|integer|exists:objetivoestrategico,id',
            'idfrecuencia' => 'sometimes|integer|exists:frecuencia,id',
            'descripcion' => 'sometimes|string|max:255',
            'meta' => 'sometimes|numeric',
            'fechainicio' => 'sometimes|date',
            'fechafin' => 'nullable|date', // Opcional
            'fechaactualizacion' => 'sometimes|date',
            'idarea' => 'nullable|integer|exists:area,id', // Opcional
        ]);
    
        $objetivo->update($validatedData);
        return response()->json($objetivo, 200);
    }    

    public function destroy($id)
    {
        $objetivo = Objetivooperacional::find($id);

        if (!$objetivo) {
            return response()->json(['message' => 'Objetivo Operacional no encontrado'], 404);
        }

        $objetivo->delete();
        return response()->json(['message' => 'Objetivo Operacional eliminado correctamente'], 200);
    }
}
