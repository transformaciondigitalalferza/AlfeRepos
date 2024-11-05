<?php

namespace App\Http\Controllers\ControllersTable;

use App\Http\Controllers\Controller;
use App\Models\proyecto;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class ProyectoController extends Controller
{
    public function index()
    {
        $proyectos = proyecto::with(['area', 'estado'])->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $proyectos
        ], Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'idarea' => 'required|integer|exists:area,id',
            'idestaddo' => 'required|integer|exists:estado,id',
            'codproyecto' => 'required|string|max:255|unique:proyecto,codproyecto',
            'nombreproyecto' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $proyecto = proyecto::create($validator->validated());
            $proyecto->load(['area', 'estado']);

            return response()->json([
                'success' => true,
                'data' => $proyecto,
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el proyecto.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show($id)
    {
        try {
            $proyecto = proyecto::with(['area', 'estado'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $proyecto,
            ], Response::HTTP_OK);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Proyecto no encontrado.',
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el proyecto.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $proyecto = proyecto::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'idarea' => 'sometimes|required|integer|exists:area,id',
                'idestaddo' => 'sometimes|required|integer|exists:estado,id',
                'codproyecto' => 'sometimes|required|string|max:255|unique:proyecto,codproyecto,' . $id,
                'nombreproyecto' => 'sometimes|required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $proyecto->update($validator->validated());
            $proyecto->load(['area', 'estado']);

            return response()->json([
                'success' => true,
                'data' => $proyecto,
            ], Response::HTTP_OK);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Proyecto no encontrado.',
            ], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el proyecto.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
