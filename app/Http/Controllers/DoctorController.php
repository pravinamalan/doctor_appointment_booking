<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class DoctorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $loggedInUser;
    protected $loggedInUserRoleId;


    public function __construct()
    {
        $this->loggedInUser = Auth::user();

        if($this->loggedInUser !== null){
            $this->loggedInUserRoleId = $this->loggedInUser->role_id;
        }
    }

    public function index()
    {
        $url = (empty($_SERVER['HTTPS']) ? 'http' : 'https') . "://$_SERVER[HTTP_HOST]";

        if($this->loggedInUserRoleId !== null){
            $doctors = $this->getDoctor($this->loggedInUser, $this->loggedInUserRoleId)->get();

            return response()->json(['status' => true, 'doctors' => $doctors], 200);

        }elseif($url == "http://127.0.0.1:8000"){

            $doctors = User::whereHas('doctorDetails', function ($query) {
                $query->where('availability', '1');
            })->with('doctorDetails', 'appointments')->get();

            return response()->json(['status' => true, 'doctors' => $doctors], 200);
        }
        else{
            return response()->json(['status' => true, 'doctors' => []], 200);
        }
    }

    public function getDoctor($loggedInUser, $loggedInUserRoleId){
        $query = User::whereHas('doctorDetails', function ($query) {
            // $query->where('availability', '1');
        })->with('doctorDetails', 'appointments');

        if ($loggedInUserRoleId === 3) {

            $query->where('id', $loggedInUser->id);
        }

        return $query;

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:doctors',
            'phone' => 'required|numeric|min:10',
            'password' => 'required|string|min:6',
            'experience' => 'required',
            'speciality' => 'required',
            'degree' => 'required|string',
            'fees' => 'required|numeric|min:2',
            'availability' => 'required',
            'about' => 'required|string',
            // 'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',

        ]);
        $data = $request->except('image', 'password_text', 'imageFile','password');
        $doctorData = $request->only(['name', 'email', 'phone']);
        $doctorDetailsData = $request->only(['degree','experience', 'speciality', 'fees','about','address','availability']);
        if ($request->hasFile('imageFile')) {
            $imageFile = $request->file('imageFile');

            $doctorName = $request->input('name');
            $filename = str_replace(' ', '_', strtolower($doctorName)) . '_' . uniqid() . '.' . $imageFile->getClientOriginalExtension();

            $imagePath = $imageFile->storeAs('public/doctor/doctor_profile_img', $filename);

            $doctorDetailsData['image'] = Storage::url($imagePath);
        };
        $password               = $request->input('password');
        $doctorData['password']       = bcrypt($password);
        $doctorData['password_text']  = $password;
        $doctorData['role_id'] =3;
        $doctorDetailsData['slots_booked'] ='';
        $addDoctor = User::create($doctorData);
        $addDoctor->doctorDetails()->updateOrCreate(
            ['user_id' => $addDoctor->id],
            $doctorDetailsData
        );
        if ($addDoctor) {
            return response()->json(['status' => true, 'message' => 'Doctor successfully added'], 200);
        } else {
            return response()->json(['status' => false, 'message' => 'Error occurred, Please try again!'], 500);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Doctor $doctor)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Doctor $doctor)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $doctor)
    {
        // Validate incoming data
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $doctor->id,
            'phone' => 'nullable|string|min:10|max:11',
            'doctor_details.fees' => 'nullable|numeric',
            'doctor_details.about' => 'nullable|string',
            'doctor_details.address' => 'nullable|string',
            'doctor_details.availability' => 'nullable|string',
            // 'doctor_details.imageFile' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ]);


        $doctorData = $request->only(['name', 'email', 'phone']);
        $doctorDetailsData = $request->input('doctor_details', []);


        if ($request->hasFile('doctor_details.imageFile')) {
            $imageFile = $request->file('doctor_details.imageFile');

            $doctorName = $request->input('name');
            $filename = str_replace(' ', '_', strtolower($doctorName))
                        . '_' . uniqid()
                        . '.' . $imageFile->getClientOriginalExtension();

            $imagePath = $imageFile->storeAs('public/doctor/doctor_profile_img', $filename);
            $doctorDetailsData['image'] = Storage::url($imagePath);
        }


        $isUpdated = $doctor->update($doctorData);


        $doctor->doctorDetails()->updateOrCreate(
            ['user_id' => $doctor->id],
            $doctorDetailsData
        );

        if ($isUpdated) {
            return response()->json([
                'status' => true,
                'message' => 'Doctor profile successfully updated',
                'profile' => $doctor->load('doctorDetails'),
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Error occurred, please try again!',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Doctor $doctor)
    {
        //
    }
}
