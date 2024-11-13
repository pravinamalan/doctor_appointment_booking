<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use PhpParser\Node\Stmt\TryCatch;

class UserController extends Controller
{
    public function userRegister(Request $request){
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
        ]);
        $user = User::updateOrCreate(
            [
                'email' => $request['email'],
            ],
            [
                'name' => $request['name'],
                'email' => $request['email'],
                'password' => Hash::make($request->input('password')),
                'password_text' => $request['password'],
                'role_id' => 4,
            ]
        );
        $user->userDetails()->updateOrCreate(
            ['user_id' => $user->id]
        );
        return response()->json([
            'status'  => true,
            'message' => 'Registered successfully',
            'data' => $user
        ]);
    }
    public function getUserProfile()
    {
        if (Auth::check()) {
            $user = Auth::user();
            $userId = $user->id;

            $profile = User::with('userDetails')->where('id', $userId)->first();

            return response()->json([
                'profile' => $profile,
            ]);
        } else {
            return response()->json([
                'profile' => [],
            ]);
        }
    }
    public function updateUserProfile(Request $request)
    {



        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = Auth::user();
        $userId = $user->id;

        // dd($request->toArray());

        $updateUser = User::find($userId);
        if ($updateUser) {
            $userData = $request->only(['name', 'email', 'phone']);
            $userDetailsData = $request->only(['address', 'dob', 'gender']);

            // $profileData = $request->except('image', 'password_text', 'imageFile');

            if ($request->hasFile('imageFile')) {
                $imageFile = $request->file('imageFile');

                $clientName = $request->input('name');
                $filename = str_replace(' ', '_', strtolower($clientName)) . '_' . uniqid() . '.' . $imageFile->getClientOriginalExtension();

                $imagePath = $imageFile->storeAs('public/user/user_image', $filename);

                $userDetailsData['image'] = Storage::url($imagePath);
            }

            // $updateUser->update($profileData);
            try{
                User::where('id', $userId)->update($userData);

                $user->userDetails()->updateOrCreate(
                    ['user_id' => $userId],
                    $userDetailsData
                );

                return response()->json([
                    'message' => 'User profile updated successfully',
                    'profile' => $user->load('userDetails'),
                ]);
            }catch (\Exception $e) {
                DB::rollBack();

                return response()->json([
                    'message' => 'Failed to update profile',
                    'error' => $e->getMessage(),
                ], 500);
            }

        } else {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

    }

    public function getUserAppointments(){
        if (Auth::check()) {
            $user = Auth::user();
            $userId = $user->id;

            $appointment = Appointment::with(['user','doctor.doctorDetails'])->where('user_id', $userId)->get();

            return response()->json([
                'appointment' => $appointment,
            ]);

        } else {
            return response()->json([
                'appointment' => [],
            ]);
        }
    }
    public function cancelAppointment(Request $request){
        $appointmentId = $request->input();

        if (Auth::check()) {
            $user = Auth::user();
            $userId = $user->id;
            $cancelAppointment = Appointment::where('id', $appointmentId)->update(['cancelled' => 1]);
            $appointment = Appointment::with('user','doctor')->where('user_id', $userId)->get();

            return response()->json([
                'status' => true,
                'appointment' => $appointment,
                'cancelAppointment' => $cancelAppointment
            ]);

        } else {
            return response()->json([
                'appointment' => [],
            ]);
        }
    }

}
