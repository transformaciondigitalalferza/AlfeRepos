<?php

namespace App\Http\Controllers\Procedimientos;

use App\Http\Controllers\Controller;
use App\Models\Procedimiento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProcedimientoController extends Controller
{
    public function index()
    {
        $procedimientos = Procedimiento::all();
        return response()->json($procedimientos);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'idcargo' => 'required|integer',
            'idrol' => 'required|integer',
            'archivo' => 'required|file',
            'nombre' => 'required|string',
        ]);

        if ($request->hasFile('archivo')) {
            $file = $request->file('archivo');
            $path = $file->store('archivos', 'public');
            $validatedData['archivo'] = $path;
        }

        $procedimiento = Procedimiento::create($validatedData);

        return response()->json($procedimiento, 201);
    }

    public function show($id)
    {
        $procedimiento = Procedimiento::find($id);
        if (!$procedimiento) {
            return response()->json(['mensaje' => 'Procedimiento no encontrado'], 404);
        }
        return response()->json($procedimiento);
    }

    public function update(Request $request, $id)
    {
        $procedimiento = Procedimiento::find($id);
        if (!$procedimiento) {
            return response()->json(['mensaje' => 'Procedimiento no encontrado'], 404);
        }

        $validatedData = $request->validate([
            'idcargo' => 'integer',
            'idrol' => 'integer',
            'archivo' => 'file',
            'nombre' => 'string',
        ]);

        if ($request->hasFile('archivo')) {
            if ($procedimiento->archivo && Storage::disk('public')->exists($procedimiento->archivo)) {
                Storage::disk('public')->delete($procedimiento->archivo);
            }

            $file = $request->file('archivo');
            $path = $file->store('archivos', 'public');
            $validatedData['archivo'] = $path;
        }

        $procedimiento->update($validatedData);

        return response()->json($procedimiento);
    }

    public function destroy($id)
    {
        $procedimiento = Procedimiento::find($id);
        if (!$procedimiento) {
            return response()->json(['mensaje' => 'Procedimiento no encontrado'], 404);
        }

        if ($procedimiento->archivo && Storage::disk('public')->exists($procedimiento->archivo)) {
            Storage::disk('public')->delete($procedimiento->archivo);
        }

        $procedimiento->delete();

        return response()->json(['mensaje' => 'Procedimiento eliminado correctamente']);
    }
}
