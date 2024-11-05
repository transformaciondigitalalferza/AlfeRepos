<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Registro de usuarios.
     */
    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'idcargo' => 'nullable|exists:cargos,id',
            'idarea' => 'nullable|exists:areas,id',
            'subarea' => 'nullable|exists:subareas,id',
            'estado' => 'boolean',
        ]);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'idcargo' => $validatedData['idcargo'] ?? null,
            'idarea' => $validatedData['idarea'] ?? null,
            'subarea' => $validatedData['subarea'] ?? null,
            'estado' => $validatedData['estado'] ?? true,
        ]);
        
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Usuario registrado correctamente',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    /**
     * Inicio de sesión de usuarios.
     */
    public function login(Request $request)
    {
        Log::info('Solicitud de login recibida', $request->only(['email']));

        try {
            $validatedData = $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);

            Log::info('Datos de login validados', ['email' => $validatedData['email']]);

            $user = User::where('email', $validatedData['email'])->first();

            if (!$user || !Hash::check($validatedData['password'], $user->password)) {
                Log::warning('Intento fallido de login para email: ' . $validatedData['email']);

                return response()->json([
                    'message' => 'Correo electrónico o contraseña incorrectos.'
                ], 401);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('Token creado para usuario', ['user_id' => $user->id]);

            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user'=> $user,
            ], 200);
        } catch (ValidationException $e) {
            Log::warning('Errores de validación en el login', $e->errors());

            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error inesperado durante el login', ['error' => $e->getMessage()]);

            return response()->json(['message' => 'Error al iniciar sesión. Inténtalo de nuevo más tarde.'], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete(); // Elimina el token actual
            Log::info('Token eliminado correctamente para usuario', ['user_id' => $request->user()->id]);

            return response()->json(['message' => 'Sesión cerrada correctamente'], 200);
        } catch (\Exception $e) {
            Log::error('Error durante el cierre de sesión', ['error' => $e->getMessage()]);

            return response()->json(['message' => 'Error al cerrar la sesión. Inténtalo de nuevo más tarde.'], 500);
        }
    }
}
