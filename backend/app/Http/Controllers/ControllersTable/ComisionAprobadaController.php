<?php

namespace App\Http\Controllers\ControllersTable;

use App\Http\Controllers\Controller;
use App\Models\ComisionAprobada;
use Illuminate\Http\Request;

class ComisionAprobadaController extends Controller
{
    public function index()
    {
        $comisiones = ComisionAprobada::all();
        return response()->json($comisiones);
    }

    public function create()
    {
        // No se requiere para API (solo se usa para vistas).
    }

    public function store(Request $request)
    {
        $request->validate([
            'codigo_proyecto' => 'required|string',
            'codigo_unidad' => 'required|string',
            'total_pagado' => 'required|numeric',
            'precio_base_proforma' => 'required|numeric',
            'username_creador' => 'required|string',
            'moneda' => 'required|string',
            'dormitorios' => 'required|integer',
            'desc_m2' => 'required|numeric',
            'porcent_pagado' => 'required|numeric',
            'financiamiento' => 'required|string',
            'fecha_migracion' => 'required|date',
            'nombres' => 'required|string',
            'fecseparacion' => 'required|date',
            'fecinicial' => 'required|date',
            'pagado' => 'required|boolean',
        ]);

        $comision = ComisionAprobada::create($request->all());
        return response()->json($comision, 201);
    }

    public function show($id)
    {
        $comision = ComisionAprobada::find($id);

        if (!$comision) {
            return response()->json(['message' => 'Comisión no encontrada'], 404);
        }

        return response()->json($comision);
    }

    public function edit($id)
    {
        // No se requiere para API (solo se usa para vistas).
    }

    public function update(Request $request, $id)
    {
        $comision = ComisionAprobada::find($id);

        if (!$comision) {
            return response()->json(['message' => 'Comisión no encontrada'], 404);
        }

        $request->validate([
            'codigo_proyecto' => 'string',
            'codigo_unidad' => 'string',
            'total_pagado' => 'numeric',
            'precio_base_proforma' => 'numeric',
            'username_creador' => 'string',
            'moneda' => 'string',
            'dormitorios' => 'integer',
            'desc_m2' => 'numeric',
            'porcent_pagado' => 'numeric',
            'financiamiento' => 'string',
            'fecha_migracion' => 'date',
            'nombres' => 'string',
            'fecseparacion' => 'date',
            'fecinicial' => 'date',
            'pagado' => 'boolean',
        ]);

        $comision->update($request->all());
        return response()->json($comision);
    }

    public function destroy($id)
    {
        $comision = ComisionAprobada::find($id);

        if (!$comision) {
            return response()->json(['message' => 'Comisión no encontrada'], 404);
        }

        $comision->delete();
        return response()->json(['message' => 'Comisión eliminada con éxito']);
    }
}
