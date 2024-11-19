<?php

namespace App\Http\Controllers\ControllersTable;

use App\Http\Controllers\Controller;
use App\Models\Area;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class AreaController extends Controller
{
    /**
     * Muestra una lista paginada de las áreas con sus relaciones.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $areas = Area::with(['user', 'users', 'subareas', 'proyectos'])->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $areas
        ], Response::HTTP_OK);
    }

    /**
     * Almacena una nueva área en la base de datos.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Definir las reglas de validación
        $validator = Validator::make($request->all(), [
            'idresponsable' => 'required|integer|exists:users,id',
            'nombres' => 'required|string|max:255',
        ]);

        // Manejar errores de validación
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            // Crear la nueva área con los datos validados
            $area = Area::create($validator->validated());
            // Cargar las relaciones definidas
            $area->load(['user', 'users', 'subareas', 'proyectos']);

            return response()->json([
                'success' => true,
                'data' => $area,
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            // Manejar cualquier error inesperado durante la creación
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el área.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Muestra una área específica por su ID.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            // Buscar la área con sus relaciones
            $area = Area::with(['user', 'users', 'subareas', 'proyectos'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $area,
            ], Response::HTTP_OK);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Manejar el caso donde la área no es encontrada
            return response()->json([
                'success' => false,
                'message' => 'Área no encontrada.',
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            // Manejar cualquier otro error inesperado
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el área.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Actualiza una área existente en la base de datos.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            // Buscar la área a actualizar
            $area = Area::findOrFail($id);

            // Definir las reglas de validación, permitiendo campos opcionales
            $validator = Validator::make($request->all(), [
                'idresponsable' => 'sometimes|required|integer|exists:users,id',
                'nombres' => 'sometimes|required|string|max:255',
            ]);

            // Manejar errores de validación
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            // Actualizar la área con los datos validados
            $area->update($validator->validated());
            // Cargar las relaciones definidas
            $area->load(['user', 'users', 'subareas', 'proyectos']);

            return response()->json([
                'success' => true,
                'data' => $area,
            ], Response::HTTP_OK);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Manejar el caso donde la área no es encontrada
            return response()->json([
                'success' => false,
                'message' => 'Área no encontrada.',
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            // Manejar cualquier otro error inesperado
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el área.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
