<?php

namespace App\Http\Controllers\ControllersTable;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class SubareaController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $subareas = DB::table("subarea")->get();
            return response()->json($subareas);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener las subáreas'], 500);
        }
    }
}
