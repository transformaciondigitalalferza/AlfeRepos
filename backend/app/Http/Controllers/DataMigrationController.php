<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

class DataMigrationController extends Controller
{
    public function run(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d|after_or_equal:start_date',
        ]);

        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $pythonScript = base_path('scripts/migraciones.py');

        $pythonPath = 'C:\Users\ellaza\AppData\Local\Microsoft\WindowsApps\python.exe';

        $command = [$pythonPath, $pythonScript, $startDate, $endDate];

        $process = new Process($command);

        $process->setTimeout(300);

        try {
            $process->mustRun();
            $output = $process->getOutput();

            return response()->json([
                'status' => 'success',
                'message' => 'Script ejecutado correctamente.',
                'output' => $output,
            ]);
        } catch (ProcessFailedException $exception) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al ejecutar el script de Python.',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }
}
