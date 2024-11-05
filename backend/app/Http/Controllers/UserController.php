<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getUserDetails($id)
    {
        try {
            $userDetails = DB::select(
                'SELECT u.name, u.email, c.nombrecargo, a.nombres 
                 FROM users u
                 JOIN cargo c ON c.id = u.idcargo
                 JOIN area a ON a.id = u.idarea
                 WHERE u.id = ?',
                [$id]
            );

            if (!empty($userDetails)) {
                return response()->json($userDetails[0], 200); 
            } else {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los detalles del usuario'], 500);
        }
    }

    public function getTaskDetails($id)
    {
        if (!is_numeric($id) || intval($id) <= 0) {
            return response()->json(['error' => 'ID de usuario inválido'], 400);
        }
    
        try {
            $taskDetails = DB::select(
                'SELECT
                    CAST(t.fechaactualizacion AS DATE) AS Fecha,
                    a.nombres,
                    u.name,
                    t.descripcion,
                    t.evidencia,
                    t.fechainicio,
                    t.fechafin,
                    e.descripcion AS estado_descripcion
                 FROM 
                    tarea t
                 JOIN users u ON u.id = t.idusers
                 JOIN cargo c ON c.id = u.idcargo
                 JOIN area a ON a.id = u.idarea
                 JOIN estado e ON e.id = t.idestado
                 WHERE u.id = ?',
                 [$id]  
            );
    
            if (!empty($taskDetails)) {
                return response()->json($taskDetails, 200);
            } else {
                return response()->json(['message' => 'No se encontraron tareas'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener las tareas'], 500);
        }
    }    
}
