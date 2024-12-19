<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\MigracionComision;

class ComisionController extends Controller
{
    public function obtenerComisiones(Request $request)
    {
        $request->validate([
            'Numero' => 'required|integer',
        ]);

        $numero = $request->input('Numero');

        try {
            $comisiones = DB::select('EXEC [dbo].[SP_ComisionesProyecto] @Numero = ?', [$numero]);

            if (empty($comisiones)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontraron comisiones para el número proporcionado.',
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'success' => true,
                'data' => $comisiones,
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al ejecutar el procedimiento almacenado.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function obtenerMigraciones()
    {
        try {
            $migraciones = MigracionComision::where('estado', 1)
                ->where('porcent_pagado', '>=', 10)
                ->orderBy('username_creador')
                ->orderBy('nombres')
                ->get([
                    'id',
                    'fecseparacion',
                    'fecinicial',
                    'username_creador',
                    'nombres',
                    'codigo_unidad',
                    'precio_base_proforma',
                    'total_pagado',
                    'dormitorios',
                    'desc_m2',
                    'porcent_pagado'
                ]);

            if ($migraciones->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontraron migraciones que cumplan con los criterios.',
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'success' => true,
                'data' => $migraciones,
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las migraciones.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function aprobarComisiones(Request $request)
    {
        $request->validate([
            'idcomision' => 'required|string',
        ]);

        $idcomision = $request->input('idcomision');

        try {
            $query = "EXEC [dbo].[SP_AprobarComisiones] :idcomision";
            DB::statement($query, ['idcomision' => $idcomision]);

            return response()->json([
                'success' => true,
                'message' => 'Procedimiento almacenado ejecutado con éxito.',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al ejecutar el procedimiento almacenado.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    public function obtenerComisionTodosProyectos(Request $request)
    {
        $request->validate([
            'id' => 'required|string',
        ]);

        $id = $request->input('id');

        try {
            // Ejecutar el procedimiento almacenado usando los id proporcionados
            $query = "EXEC [dbo].[ComisionesTodosProyectos] :id";
            $comision = DB::select($query, ['id' => $id]);

            if (empty($comision)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontraron comisiones para los id proporcionados.',
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'success' => true,
                'data' => $comision,
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al ejecutar el procedimiento almacenado.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
