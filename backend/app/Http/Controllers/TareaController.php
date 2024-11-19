<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tarea;
use Illuminate\Support\Facades\Storage;

class TareaController extends Controller
{
    public function subirEvidencia(Request $request, $id)
    {
        $request->validate([
            'evidencia' => 'required|file|mimes:jpg,jpeg,png,gif,pdf,doc,docx',
        ]);

        $tarea = Tarea::findOrFail($id);

        if ($request->hasFile('evidencia')) {
            if ($tarea->evidencia) {
                Storage::delete($tarea->evidencia);
            }

            $rutaArchivo = $request->file('evidencia')->store('evidencias');

            $tarea->evidencia = $rutaArchivo;
            $tarea->save();

            return response()->json(['message' => 'Evidencia actualizada correctamente', 'ruta' => $rutaArchivo], 200);
        }

        return response()->json(['error' => 'No se pudo cargar el archivo'], 400);
    }
}
