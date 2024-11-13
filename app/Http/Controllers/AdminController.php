<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    protected $loggedInUser;
    protected $loggedInUserRoleId;


    public function __construct()
    {
        $this->loggedInUser = Auth::user();
        $this->loggedInUserRoleId = $this->loggedInUser->role_id;
    }

    public function adminDashboard(Request $request){
        $doctorController = app(DoctorController::class);
        $doctors = $doctorController->getDoctor($this->loggedInUser, $this->loggedInUserRoleId)->count();



        // * Get appointments count

        $appointments = $this->getAppointmentCount($this->loggedInUser, $this->loggedInUserRoleId);

        // *Get patients count

        $patients = $this->getPatient( $this->loggedInUser, $this->loggedInUserRoleId );

        // * Get lastest bookings

        $latestBookings = $this->getLatestAppointment($this->loggedInUser, $this->loggedInUserRoleId);

        return response() -> json([
            'doctors'        => $doctors,
            'appointments'   => $appointments,
            'patients'       => $patients,
            'latestBookings' => $latestBookings
        ]);
    }

    public function appointmentAction(Request $request) {
        $appointment = Appointment::find($request->appointmentId);

        if (!$appointment) {
            return response()->json([
                'message' => 'Appointment not found',
            ], 404);
        }

        if ($request->action == 'completed') {
            $appointment->update(['is_completed' => 1]);
        } elseif ($request->action == 'cancelled') {
            $appointment->update(['cancelled' => 1]);
        } else {
            return response()->json([
                'message' => 'Invalid action',
            ], 400);
        }
        $doctors = Doctor::where('availability',1)->count();
        $appointments = $this->getAppointmentCount($this->loggedInUser, $this->loggedInUserRoleId);
        $patients = $this->getPatient( $this->loggedInUser, $this->loggedInUserRoleId );
        $latestBookings =$this->getLatestAppointment($this->loggedInUser, $this->loggedInUserRoleId);
        $allAppointments = Appointment::with('user','doctor.doctorDetails')->get();

        return response()->json([
            'doctors'        => $doctors,
            'appointments'   => $appointments,
            'patients'       => $patients,
            'latestBookings' => $latestBookings,
            'allAppointments' => $allAppointments
        ]);
    }

    public function getPatient($loggedInUser, $loggedInUserRoleId){

        if ($loggedInUserRoleId == 1 || $loggedInUserRoleId == 2) {

            return User::where('role_id', 4)->count();

        } elseif ($loggedInUserRoleId === 3) {

            $patientIds  = Appointment::where('doc_id', $loggedInUser->id)
                ->pluck('user_id')
                ->unique();

            return User::whereIn('id', $patientIds)->count();
        }

        return 0;
    }

    public function getAppointmentCount($loggedInUser, $loggedInUserRoleId){
        Appointment::query();

        if ($loggedInUserRoleId == 1 || $loggedInUserRoleId == 2) {

            return Appointment::count();
        } elseif ($loggedInUserRoleId === 3) {

            return Appointment::where('doc_id', $loggedInUser->id)->count();
        }

        return 0;
    }

    public function getLatestAppointment($loggedInUser, $loggedInUserRoleId){
        $query = Appointment::with('user.userDetails', 'doctor.doctorDetails');

        if ($loggedInUserRoleId == 1 || $loggedInUserRoleId == 2) {

            $latestBookings = $query->latest()->take(5)->get();
        } elseif ($loggedInUserRoleId === 3) {

            $latestBookings = $query->where('doc_id', $loggedInUser->id)
                ->latest()
                ->take(5)
                ->get();
        } else {

            $latestBookings = collect();
        }

        return $latestBookings;
    }
}
