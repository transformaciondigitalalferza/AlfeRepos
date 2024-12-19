<?php

use App\Http\Controllers\ControllersTable\PerspectivaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DataMigrationController;
use App\Http\Controllers\ComisionController;
use App\Http\Controllers\UserDataController;
use App\Http\Controllers\MigracionesPagadasController;

use App\Http\Controllers\ControllersTable\ProyectoController;
use App\Http\Controllers\ControllersTable\AreaController;
use App\Http\Controllers\ControllersTable\SubareaController;
use App\Http\Controllers\ControllersTable\RolController;
use App\Http\Controllers\ControllersTable\CargoController;
use App\Http\Controllers\ControllersTable\FormatosController;
use App\Http\Controllers\ControllersTable\ObjetivoEstrategicoController;
use App\Http\Controllers\ControllersTable\ObjetivoOperacionalController;

use App\Http\Controllers\Politicas\PoliticaController;
use App\Http\Controllers\Procedimientos\ProcedimientoController;
use App\Http\Controllers\ControllersTable\TareaController;
use App\Http\Controllers\ControllersTable\EstadoController;
use App\Http\Controllers\ControllersTable\ComisionAprobadaController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

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

Route::post('/run-migraciones', [DataMigrationController::class, 'run']);
Route::get('/comisiones', [ComisionController::class, 'obtenerComisiones']);
Route::apiResource('proyectos', ProyectoController::class);

Route::apiResource('areas', AreaController::class);
Route::resource('subareas', SubareaController::class);

Route::get('/roles', [RolController::class, 'index']);
Route::get('/roles/{id}', [RolController::class, 'show']);
Route::get('/userdata/{id}', [UserDataController::class, 'show']);
Route::get('/users', [UserController::class, 'getAllUsers']);

Route::get('/cargos', [CargoController::class, 'index']);
Route::get('/cargos/{id}', [CargoController::class, 'show']);

Route::apiResource('politicas', PoliticaController::class);
Route::apiResource('procedimientos', ProcedimientoController::class);
Route::apiResource('formatos', FormatosController::class);

Route::apiResource('objetivoestrategico', ObjetivoEstrategicoController::class);
Route::apiResource('objetivooperacional', ObjetivoOperacionalController::class);
Route::apiResource('tareas', TareaController::class);
Route::apiResource('estados', EstadoController::class);

Route::post('/comisiones/proyecto', [ComisionController::class, 'obtenerComisiones']);
Route::get('/migraciones', [ComisionController::class, 'obtenerMigraciones']);

Route::post('/aprobar-comisiones', [ComisionController::class, 'aprobarComisiones']);

Route::apiResource('migracionespagadas', MigracionesPagadasController::class);
Route::apiResource('comisionesaprobadas', ComisionAprobadaController::class);

Route::post('/comisiontodosproyectos',[ComisionController::class,'obtenerComisionTodosProyectos']);

Route::apiResource('perspectiva', PerspectivaController::class);