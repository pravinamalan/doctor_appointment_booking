<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use PayPalCheckoutSdk\Orders\OrdersCreateRequest;
use PayPalCheckoutSdk\Orders\OrdersCaptureRequest;
use PayPalCheckoutSdk\Core\PayPalHttpClient;
use PayPalCheckoutSdk\Core\SandboxEnvironment;


class PaymentController extends Controller
{
    private $client;

    public function __construct()
    {
        $clientId = env('PAYPAL_CLIENT_ID');
        $clientSecret = env('PAYPAL_SECRET');
        $environment = new SandboxEnvironment($clientId, $clientSecret);
        $this->client = new PayPalHttpClient($environment);
    }

    public function createPaymentIntent(Request $request)
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        $amount = $request->amount * 100;
        $currency = 'inr';

        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => $amount,
                'currency' => $currency,
                'payment_method_types' => ['card'],
            ]);
             $appointmentData = Appointment::where('id', $request->id)->update(['payment' => 1]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
                'appointment'  => $appointmentData
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function createOrder(Request $request)
    {
        $amount = $request->amount;

        $orderRequest = new OrdersCreateRequest();
        $orderRequest->prefer('return=representation');
        $orderRequest->body = [
            'intent' => 'CAPTURE',
            'purchase_units' => [[
                'amount' => [
                    'currency_code' => 'USD',
                    'value' => $amount,
                ]
            ]]
        ];

        try {
            $response = $this->client->execute($orderRequest);
            return response()->json(['orderID' => $response->result->id]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function captureOrder(Request $request)
    {
        $orderID = $request->orderID;

        $captureRequest = new OrdersCaptureRequest($orderID);
        try {
            $response = $this->client->execute($captureRequest);
            return response()->json(['status' => 'Payment successful']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

}
