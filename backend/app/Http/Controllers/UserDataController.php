<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserDataController extends Controller
{
    public function show($id): JsonResponse
    {
        $resultado = DB::table('users as usrs')
            ->join('cargo as c', 'c.id', '=', 'usrs.idcargo')
            ->join('area as a', 'a.id', '=', 'usrs.idarea')
            ->join('subarea as sa', 'sa.id', '=', 'usrs.subarea')
            ->select(
                'usrs.name',
                'c.id as cargo_id',
                'c.nombrecargo',
                'a.id as area_id',
                'a.nombres as area_nombre',
                'sa.id as subarea_id',
                'sa.nombresubarea'
            )
            ->where('usrs.id', '=', $id)
            ->first();

        return response()->json($resultado);
    }
}
