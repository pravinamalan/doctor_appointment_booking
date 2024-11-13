<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::post('login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'adminLogout'])->name('logout');
Route::post('/register', [UserController::class, 'userRegister']);
// Route::post('/user-login', [AuthController::class, 'userLogin']);
Route::post('/user-logout', [AuthController::class, 'logout']);
Route::post('refresh', [AuthController::class, 'refresh']);
Route::get('get-role', [AuthController::class, 'getRole']);
Route::middleware(['auth:api', 'user'])->group(function ()  {

});
// Route::middleware(['auth:api', 'admin'])->group(function ()  {
    Route::apiResource('doctor', DoctorController::class);
    Route::get('/dashboard',[AdminController::class,'adminDashboard']);
    Route::post('/appointment-action',[AdminController::class,'appointmentAction']);
    Route::get('/appointments',[AppointmentController::class,'getAllAppointments']);
    Route::post('/book-appointment',[AppointmentController::class,'bookAppointment']);
    Route::post('/stripe-payment', [PaymentController::class, 'createPaymentIntent']);
    Route::post('/create-checkout-session', [PaymentController::class, 'createCheckoutSession']);
    Route::post('/create-paypal-order', [PaymentController::class, 'createOrder']);
    Route::post('/capture-paypal-order', [PaymentController::class, 'captureOrder']);


// });
Route::middleware(['auth:api', 'user'])->group(function ()  {
    Route::get('/user-profile', [UserController::class, 'getUserProfile']);
    Route::post('/update-user-profile', [UserController::class, 'updateUserProfile']);
    Route::get('/my-appointments', [UserController::class, 'getUserAppointments']);
    Route::post('/cancel-appointment', [UserController::class, 'cancelAppointment']);

});
