<?php

namespace App\Http\Controllers;

use App\Mail\ApoointmentMail;
use App\Models\Appointment;
use App\Models\DoctorDetails;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Twilio\Exceptions\TwilioException;
use Twilio\Rest\Client;
class AppointmentController extends Controller
{
    public function getAllAppointments(){
        $loggedInUser = Auth::user();
        $loggedInUserRoleId = $loggedInUser -> role_id;

        $allAppointments = Appointment::with('user','doctor.doctorDetails');
        if($loggedInUserRoleId == 1 || $loggedInUserRoleId == 2){
            $allAppointments =  $allAppointments-> get();
        }elseif ($loggedInUserRoleId === 3 ) {
            $allAppointments = $allAppointments->where(function ($query) use ($loggedInUser) {
                $query->where('doc_id', $loggedInUser->id);
            })->get();
        }

        return response()->json([
            'status'       => true,
            'appointments' => $allAppointments
        ]);
    }
    public function bookAppointment(Request $request){
        $doctorData = DoctorDetails::where('user_id',$request->doc_id)->first();
        $userData =  Auth::user();
        $formattedTime = \Carbon\Carbon::createFromFormat('h:i A', $request->slot_time)->format('H:i:s');

        $existingAppointment = Appointment::where('doc_id', $request->doc_id)
            ->where('slot_date', $request->slot_date)
            ->where('slot_time', $formattedTime)
            ->exists();

        if ($existingAppointment) {
            return response()->json([
                'status' => false,
                'message' => 'This slot is already booked for the selected date and time',
            ], 400);

        }
        $appointment = new Appointment([
            'user_id' => $userData->id,
            'doc_id' => $doctorData->user_id,
            'amount' => $doctorData->fees,
            'slot_date' => $request->input('slot_date'),
            'slot_time' => $formattedTime,

        ]);

        $appointment->save();

        $slotDateTime = Carbon::createFromFormat('Y-m-d H:i:s', $appointment->slot_date . ' ' . $appointment->slot_time);
        $formattedDate = $slotDateTime->format('D, M d, Y');
        $formattedTime = $slotDateTime->format('h:i A');
        $doctor = User::find($appointment->doc_id);
        if (!$doctor) {
            Log::error("Doctor with ID {$appointment->doc_id} not found.");
            throw new \Exception("Doctor details not found.");
        }

        $slotsBooked = $doctorData->slots_booked ? json_decode($doctorData->slots_booked, true) : [];

        $bookingSlotsDate = \Carbon\Carbon::createFromFormat('Y-m-d', $request->slot_date)->format('d_m_Y');

        if (!isset($slotsBooked[$bookingSlotsDate])) {
            $slotsBooked[$bookingSlotsDate] = [];
        }

        $formattedTimeForBooking = \Carbon\Carbon::createFromFormat('H:i:s', $appointment->slot_time)->format('h:i A');

        $slotsBooked[$bookingSlotsDate][] = $formattedTimeForBooking;

        $doctorData->slots_booked = json_encode($slotsBooked);
        $doctorData->save();


        // Send email for appoinment booking confirmation

        Mail::to($userData->email)->send(new ApoointmentMail(
            $userData->name,
            $formattedDate,
            $formattedTime,
            $doctor->name,
            $doctorData->speciality,
            $doctorData->address
        ));

        // send sms for appointment booking confirmation

        if($userData->phone !== null){
            $this->sendAppointmentConfirmMessage($userData,$doctor,$doctorData,$formattedDate,$formattedTime);
        }
         return response()->json([
            'status'  => true,
            'message' => 'Appointment Booked Successfully',
            'appointment' => $appointment,
        ]);
    }

    public function sendAppointmentConfirmMessage($userData,$doctor,$doctorData,$formattedDate,$formattedTime){
        try {
            $receiverNumber = '+91' . $userData->phone;
            // Log::info('receiverNumber: ' . $receiverNumber);

            $message = "Dear {$userData->name},\nYour appointment is confirmed for {$formattedDate} {$formattedTime} at ";

            if ($doctor) {
                $message .= "{$doctor->name}, {$doctorData->speciality}, {$doctorData->address}.\n";
            }

            $message .= "Thanks - prescripto";

            $sid = getenv("TWILIO_SID");
            $token = getenv("TWILIO_TOKEN");
            $twilioNumber = getenv("TWILIO_FROM");

            if (!$sid || !$token || !$twilioNumber) {
                throw new \Exception("Twilio credentials not configured properly.");
            }

            $client = new Client($sid, $token);

            $client->messages->create($receiverNumber, [
                'from' => $twilioNumber,
                'body' => $message
            ]);

            Log::info('Message sent successfully.');

        } catch (TwilioException $e) {
            Log::error('TwilioException: ' . $e->getMessage());
            // Handle Twilio exception, maybe retry or log for manual intervention
        } catch (\Exception $e) {
            Log::error('Exception: ' . $e->getMessage());
            // Handle other exceptions
        }
    }

}
