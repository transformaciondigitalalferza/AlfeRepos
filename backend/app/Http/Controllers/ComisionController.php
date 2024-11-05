<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

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
}
