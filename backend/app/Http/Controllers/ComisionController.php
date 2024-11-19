<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\MigracionComision; // Importar el modelo

class ComisionController extends Controller
{
    /**
     * Ejecuta el procedimiento almacenado [SP_ComisionesProyecto].
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
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

    /**
     * Ejecuta una consulta específica sobre la tabla migracioncomisiones.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function obtenerMigraciones()
    {
        try {
            $migraciones = MigracionComision::where('estado', 1)
                ->where('porcent_pagado', '>=', 10)
                ->orderBy('username_creador')
                ->orderBy('nombres')
                ->get([
                    'fecseparacion',
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
}
