<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\User;

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

    public function updateTask(Request $request, $idTarea)
    {
        if (!is_numeric($idTarea) || intval($idTarea) <= 0) {
            return response()->json(['error' => 'ID de tarea inválido'], 400);
        }

        $validatedData = $request->validate([
            'descripcion' => 'required|string|max:255',
            'estado' => 'required|integer|exists:estado,id',
            'evidencia' => 'nullable|string|max:255',
        ]);

        try {
            $tarea = DB::select('SELECT * FROM tarea WHERE id = ?', [$idTarea]);

            if (empty($tarea)) {
                return response()->json(['message' => 'Tarea no encontrada'], 404);
            }

            DB::update(
                'UPDATE tarea SET descripcion = ?, idestado = ?, evidencia = ?, fechaactualizacion = NOW() WHERE id = ?',
                [
                    $validatedData['descripcion'],
                    $validatedData['estado'],
                    $validatedData['evidencia'] ?? $tarea[0]->evidencia,
                    $idTarea
                ]
            );

            return response()->json(['message' => 'Tarea actualizada exitosamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar la tarea'], 500);
        }
    }

    public function getAllUsers(Request $request)
    {
        try {
            $users = User::select('id', 'name')->get();
            return response()->json($users, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener la lista de usuarios'], 500);
        }
    }
}
