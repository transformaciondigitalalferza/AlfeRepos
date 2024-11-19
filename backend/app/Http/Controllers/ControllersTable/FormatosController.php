<?php

namespace App\Http\Controllers\ControllersTable;

use App\Http\Controllers\Controller;
use App\Models\Formatos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FormatosController extends Controller
{
    public function index()
    {
        $formatos = Formatos::all();
        return response()->json($formatos);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'idcargo' => 'required|integer',
            'archivo' => 'required|file',
            'nombre' => 'required|string',
        ]);

        if ($request->hasFile('archivo')) {
            $file = $request->file('archivo');
            $path = $file->store('archivos', 'public');
            $validatedData['archivo'] = $path;
        }

        $formato = Formatos::create($validatedData);

        return response()->json($formato, 201);
    }

    public function show($id)
    {
        $formato = Formatos::find($id);
        if (!$formato) {
            return response()->json(['mensaje' => 'Formato no encontrado'], 404);
        }
        return response()->json($formato);
    }

    public function update(Request $request, $id)
    {
        $formato = Formatos::find($id);
        if (!$formato) {
            return response()->json(['mensaje' => 'Formato no encontrado'], 404);
        }

        $validatedData = $request->validate([
            'idcargo' => 'integer',
            'archivo' => 'file',
            'nombre' => 'string',
        ]);

        if ($request->hasFile('archivo')) {
            if ($formato->archivo && Storage::disk('public')->exists($formato->archivo)) {
                Storage::disk('public')->delete($formato->archivo);
            }

            $file = $request->file('archivo');
            $path = $file->store('archivos', 'public');
            $validatedData['archivo'] = $path;
        }

        $formato->update($validatedData);

        return response()->json($formato);
    }

    public function destroy($id)
    {
        $formato = Formatos::find($id);
        if (!$formato) {
            return response()->json(['mensaje' => 'Formato no encontrado'], 404);
        }

        if ($formato->archivo && Storage::disk('public')->exists($formato->archivo)) {
            Storage::disk('public')->delete($formato->archivo);
        }

        $formato->delete();

        return response()->json(['mensaje' => 'Formato eliminado correctamente']);
    }
}
