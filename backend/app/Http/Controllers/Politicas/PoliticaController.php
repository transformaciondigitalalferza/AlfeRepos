<?php

namespace App\Http\Controllers\Politicas;

use App\Http\Controllers\Controller;
use App\Models\Politica;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PoliticaController extends Controller
{
    public function index()
    {
        $politicas = Politica::all();
        return response()->json($politicas);
    }

    public function show($id)
    {
        $politica = Politica::find($id);
        if (!$politica) {
            return response()->json(['mensaje' => 'Política no encontrada'], 404);
        }
        return response()->json($politica);
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

        $politica = Politica::create($validatedData);

        return response()->json($politica, 201);
    }

    public function update(Request $request, $id)
    {
        $politica = Politica::find($id);
        if (!$politica) {
            return response()->json(['mensaje' => 'Política no encontrada'], 404);
        }

        $validatedData = $request->validate([
            'idcargo' => 'integer',
            'archivo' => 'file',
            'nombre' => 'string',
        ]);

        if ($request->hasFile('archivo')) {
            if ($politica->archivo && Storage::disk('public')->exists($politica->archivo)) {
                Storage::disk('public')->delete($politica->archivo);
            }

            $file = $request->file('archivo');
            $path = $file->store('archivos', 'public');
            $validatedData['archivo'] = $path;
        }

        $politica->update($validatedData);

        return response()->json($politica);
    }

    public function destroy($id)
    {
        $politica = Politica::find($id);
        if (!$politica) {
            return response()->json(['mensaje' => 'Política no encontrada'], 404);
        }

        if ($politica->archivo && Storage::disk('public')->exists($politica->archivo)) {
            Storage::disk('public')->delete($politica->archivo);
        }

        $politica->delete();

        return response()->json(['mensaje' => 'Política eliminada correctamente']);
    }
}
