<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ApoointmentMail extends Mailable
{
    use Queueable, SerializesModels;

    public $userName;
    public $appointmentDate;
    public $appointmentTime;
    public $doctorName;
    public $doctorSpeciality;
    public $doctorAddress;
    /**
     * Create a new message instance.
     */
    public function __construct($userName, $appointmentDate, $appointmentTime, $doctorName, $doctorSpeciality, $doctorAddress)
    {
        $this->userName = $userName;
        $this->appointmentDate = $appointmentDate;
        $this->appointmentTime = $appointmentTime;
        $this->doctorName = $doctorName;
        $this->doctorSpeciality = $doctorSpeciality;
        $this->doctorAddress = $doctorAddress;
    }

    /**
     * Get the message envelope.
     */


    /**
     * Get the message content definition.
     */


    public function build()
    {
        return $this->view('email.appointment_book')
            ->subject('Appointment Confirmation')
            ->with([
                'userName' => $this->userName,
                'appointmentDate' => $this->appointmentDate,
                'appointmentTime' => $this->appointmentTime,
                'doctorName' => $this->doctorName,
                'doctorSpeciality' => $this->doctorSpeciality,
                'doctorAddress' => $this->doctorAddress,
            ]);
    }
    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
