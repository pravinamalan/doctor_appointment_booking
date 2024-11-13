<?php

namespace App\Http\Controllers;

use App\Models\DoctorDetails;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class AuthController extends Controller
{

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');
        $token = Auth::attempt($credentials);

        if (!$token) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials',
            ], 401);
        }

        $user = User::with(['role:id,name'])->find(Auth::id());

        
        if ($user->role_id === 3) {

            $doctorDetails = DoctorDetails::where('user_id', $user->id)->first();


            if ($doctorDetails && $doctorDetails->availability == 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Doctor is not available',
                ], 403);
            }
        }


        if (isset($request->role_id) && $user->role_id !== (int)$request->role_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid role',
            ], 401);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Login Successfully',
            'data' => $user,
            'authorisation' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ]);
    }

    public function getRole()
    {
        if (Auth::check()) {

            $user = User::with(['role:id,name'])->find(Auth::id());
            return response()->json([
                'role' => $user->role->name,
            ]);
        }
        return response()->json(['message' => 'Unauthorized'], 401);
}
    public function logout()
    {
        Auth::logout();
        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
    }


    public function refresh()
    {
        if($token = Auth::refresh()) {
            return response()
            ->json([
                'status' => 'success'
            ], 200)
            ->header('Authorization', $token);
        }

        return response()->json([
            'error' => 'refresh_token_error'
        ], 401);
    }
    public function adminLogout()
    {
        // Clear session data
        Session::flush();

        // Return success response
        return response()->json([
            'message' => 'Logout successfully',
            'status' => 'success',
        ]);
    }
}
