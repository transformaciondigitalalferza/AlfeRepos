<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TareaController;
use App\Http\Controllers\DataMigrationController;
use App\Http\Controllers\ComisionController;
use App\Http\Controllers\ControllersTable\ProyectoController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->get('/dashboard', function (Request $request) {
    return response()->json([
        'user' => $request->user()
    ]);
});
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::get('/user-details/{id}', [UserController::class, 'getUserDetails']);
Route::get('/tasks/user/{id}', [UserController::class, 'getTaskDetails']);
Route::post('/tarea/{id}/subir-evidencia', [TareaController::class, 'subirEvidencia']);

Route::post('/run-migraciones', [DataMigrationController::class, 'run']);
Route::get('/comisiones', [ComisionController::class, 'obtenerComisiones']);
Route::apiResource('proyectos', ProyectoController::class);
