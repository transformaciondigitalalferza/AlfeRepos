<?php

namespace App\Http\Controllers\ControllersTable;

use App\Http\Controllers\Controller;
use App\Models\Tarea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class TareaController extends Controller
{
    public function index()
    {
        $tareas = Tarea::with(['user', 'objetivooperacional', 'estado', 'subtareas'])->paginate(15);
        return response()->json($tareas, 200);
    }

    public function show(Tarea $tarea)
    {
        $tarea->load(['user', 'objetivooperacional', 'estado', 'subtareas']);
        return response()->json($tarea, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'idobjoperacional' => 'required|integer|exists:objetivooperacional,id',
            'idusers' => 'required|integer|exists:users,id',
            'idestado' => 'required|integer|exists:estado,id',
            'descripcion' => 'required|string',
            'evidencia' => 'nullable|file|mimes:jpg,jpeg,png,pdf',
            'fechainicio' => 'required|date',
            'fechafin' => 'nullable|date|after_or_equal:fechainicio',
        ]);

        if ($request->hasFile('evidencia')) {
            try {
                $path = $request->file('evidencia')->store('evidencias', 'public');
                $validated['evidencia'] = $path;
                Log::info('Archivo de evidencia almacenado:', ['path' => $path]);
            } catch (\Exception $e) {
                Log::error('Error al subir el archivo de evidencia:', ['error' => $e->getMessage()]);
                return response()->json(['message' => 'Error al subir el archivo de evidencia'], 500);
            }
        }

        $tarea = Tarea::create($validated);
        Log::info('Tarea creada correctamente:', ['tarea_id' => $tarea->id]);

        return response()->json($tarea, 201);
    }

    public function update(Request $request, Tarea $tarea)
    {
        $validated = $request->validate([
            'idobjoperacional' => 'sometimes|required|integer|exists:objetivooperacional,id',
            'idusers' => 'sometimes|required|integer|exists:users,id',
            'idestado' => 'sometimes|required|integer|exists:estado,id',
            'descripcion' => 'sometimes|required|string',
            'evidencia' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'fechainicio' => 'sometimes|required|date',
            'fechafin' => [
                'sometimes',
                'required',
                'date',
                function ($attribute, $value, $fail) use ($request, $tarea) {
                    $fechainicio = $request->input('fechainicio') ?? $tarea->fechainicio;
                    if (strtotime($value) < strtotime($fechainicio)) {
                        $fail('La fecha fin debe ser igual o posterior a la fecha inicio.');
                    }
                },
            ],
        ]);

        if ($request->hasFile('evidencia')) {
            Log::info('Archivo de evidencia detectado para actualización:', [
                'nombre_archivo' => $request->file('evidencia')->getClientOriginalName(),
                'tamaño_archivo' => $request->file('evidencia')->getSize(),
            ]);

            if ($tarea->evidencia && Storage::disk('public')->exists($tarea->evidencia)) {
                try {
                    Storage::disk('public')->delete($tarea->evidencia);
                    Log::info('Archivo de evidencia anterior eliminado:', ['path' => $tarea->evidencia]);
                } catch (\Exception $e) {
                    Log::error('Error al eliminar el archivo de evidencia anterior:', ['error' => $e->getMessage()]);
                    return response()->json(['message' => 'Error al eliminar el archivo de evidencia anterior'], 500);
                }
            }

            try {
                $path = $request->file('evidencia')->store('evidencias', 'public');
                $validated['evidencia'] = $path;
                Log::info('Nuevo archivo de evidencia almacenado:', ['path' => $path]);
            } catch (\Exception $e) {
                Log::error('Error al subir el nuevo archivo de evidencia:', ['error' => $e->getMessage()]);
                return response()->json(['message' => 'Error al subir el archivo de evidencia'], 500);
            }
        }

        $tarea->update($validated);
        Log::info('Tarea actualizada correctamente:', ['tarea_id' => $tarea->id]);

        return response()->json($tarea, 200);
    }

    public function destroy(Tarea $tarea)
    {
        if ($tarea->evidencia && Storage::disk('public')->exists($tarea->evidencia)) {
            try {
                Storage::disk('public')->delete($tarea->evidencia);
                Log::info('Archivo de evidencia eliminado al borrar la tarea:', ['path' => $tarea->evidencia]);
            } catch (\Exception $e) {
                Log::error('Error al eliminar el archivo de evidencia al borrar la tarea:', ['error' => $e->getMessage()]);
                return response()->json(['message' => 'Error al eliminar el archivo de evidencia'], 500);
            }
        }

        $tarea->delete();
        Log::info('Tarea eliminada correctamente:', ['tarea_id' => $tarea->id]);

        return response()->json(['message' => 'Tarea eliminada correctamente'], 200);
    }
}
