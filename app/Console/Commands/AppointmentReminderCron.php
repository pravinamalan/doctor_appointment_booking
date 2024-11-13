<?php

namespace App\Console\Commands;

use App\Http\Controllers\AppointmentController;
use App\Models\Doctor;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Twilio\Exceptions\TwilioException;
use Twilio\Rest\Client;
class AppointmentReminderCron extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'appointment_reminder:cron';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send appointment reminder messages';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        $appointment = [];
        $appointments = DB::table('appointments')->whereDate('slot_date', '=', Carbon::now()->addDay())->get();
        // Log::info($appointment);
        foreach ($appointments as $appointment) {
            $userData = User::find($appointment->user_id);
            $doctor = Doctor::find($appointment->doc_id);
            $formattedDate = Carbon::parse($appointment->slot_date)->format('d-M-Y');
            $formattedTime = Carbon::createFromFormat('H:i:s', $appointment->slot_time)->format('h:i A');

            if ($userData && $userData->phone !== null) {
                $controller = app(AppointmentController::class);
                $controller->sendAppointmentConfirmMessage($userData, $doctor, $formattedDate, $formattedTime);
            } else {
                Log::info("No phone number found for user {$appointment->user_id}.");
            }
        }
    }
}
