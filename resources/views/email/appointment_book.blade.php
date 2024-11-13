<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #eaeaea;
            padding: 20px;
        }
        .header {
            text-align: center;
            background-color: #4CAF50;
            color: white;
            padding: 10px 0;
        }
        .content {
            padding: 20px;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
        }
        .appointment-details {
            margin-top: 20px;
            background-color: #f9f9f9;
            padding: 15px;
            border: 1px solid #ddd;
        }
        .appointment-details h3 {
            margin: 0 0 10px 0;
            font-size: 18px;
            color: #4CAF50;
        }
        .appointment-details p {
            margin: 5px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Appointment Confirmed</h1>
        </div>
        <div class="content">
            <p>Dear <strong>{{ $userName }}</strong>,</p>
            <p>Your appointment has been confirmed. Please find the details below:</p>

            <div class="appointment-details">
                <h3>Appointment Details</h3>
                <p><strong>Date:</strong> {{ $appointmentDate }}</p>
                <p><strong>Time:</strong> {{ $appointmentTime }}</p>
                <p><strong>Doctor:</strong> Dr. {{ $doctorName }} ({{ $doctorSpeciality }})</p>
                <p><strong>Location:</strong> {{ $doctorAddress }}</p>
            </div>

            <p>If you have any questions, feel free to contact us.</p>
            <p>Thank you for choosing our services!</p>
        </div>

        <div class="footer">
            <p>&copy; 2024 Prescripto. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
