import React, { useEffect, useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { getRequest } from '../apis/api_call';
import { showToast } from '../utils/toast';
import { cancelAppointment } from './../apis/user';
import { assets } from '../assets/assets';
import { formatDateTime } from '../helpers/formatDateTime';
import StripeModalWrapper from './StripePaymentModal';
import axios from 'axios';
import Div from '../common/Div';

const MyAppointments = () => {
    const [myAppointment, setMyAppointment] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isStripeOpen, setIsStripeOpen] = useState(false);

    const handleStripeOpen = () => setIsStripeOpen(true);
    const handleStripeClose = () => setIsStripeOpen(false);

    const getAppointmentData = async () => {
        try {
            const appointment = await getRequest('/api/my-appointments');
            setMyAppointment(appointment.appointment);
        } catch (error) {
            console.error('Error fetching appointments', error);
        }
    };

    const cancelAppointmentData = async (appointmentId) => {
        const data = { appointmentId };
        try {
            setIsLoading(true);
            await cancelAppointment('/api/cancel-appointment', data);
            getAppointmentData();
            showToast('Appointment Cancelled', 'success');
        } catch (error) {
            console.error('Error cancelling the appointment', error);
            showToast('Error cancelling the appointment', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAppointmentData();
    }, []);
    const handlePaymentCompletion = () => {
        getAppointmentData();
    };

    const onlinePayment = (appointment) => {
        setSelectedPayment(appointment);
    };
    const createOrder = async () => {
        const response = await axios.post('/api/create-paypal-order', {
            appointmentId: selectedPayment.id,
            amount: selectedPayment.amount,
        });
        return response.data.orderID;
    };

    const captureOrder = async (data) => {
        await axios.post('/api/capture-paypal-order', { orderID: data.orderID });
        showToast('Payment successful!', 'success');
        handlePaymentCompletion();
    };

    return (
        <Div>
            <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
                My appointments
            </p>
            <Div>
                {myAppointment.map((item) => (
                    <Div
                        className="grid grid-col-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
                        key={item.id}
                    >
                        <Div>
                            <img
                                className="w-32 bg-indigo-50"
                                src={item?.doctor?.doctor_details?.image}
                                alt=""
                            />
                        </Div>
                        <Div className="flex-1 text-sm text-zinc-600">
                            <p className="text-neutral-800 font-semibold">
                                {item.doctor.name}
                            </p>
                            <p>{item.speciality}</p>
                            <p className="text-zinc-700 font-medium mt-1">
                                Address:
                            </p>
                            <p className="text-xs">
                                {item?.doctor?.doctor_details?.address}
                            </p>
                            <p className="text-sm mt-1">
                                <span className="text-sm text-neutral-700 font-medium">
                                    Date & Time:
                                </span>
                                {formatDateTime(item.slot_date, item.slot_time)}
                            </p>
                        </Div>
                        <Div className="flex flex-col gap-1 justify-end">
                            {item.cancelled !=1 && item.payment ==1 && <button className='text-sm text-gray-900 text-center sm:min-w-48 py-2 border bg-blue-200'>Paid</button>}
                            {item.cancelled === 1 ? (
                                <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                                    Appointment Cancelled
                                </button>
                            ) : (
                                <>
                                    {item.payment !== 1 ? (
                                        <>
                                            {selectedPayment?.id === item.id ? (
                                                <Div className="flex flex-col gap-2 justify-end">
                                                    {/* <button className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center">
                                                        <img
                                                            className="max-w-20 max-h-5"
                                                            src={
                                                                assets.paypal_logo
                                                            }
                                                            alt="Paypal"
                                                        />
                                                    </button> */}
                                                    <PayPalScriptProvider
                                                        options={{ "client-id": "AWjqatPPfbrvzLEFIckxtJ4t859zIfSJQ5-cAEHe9mshMjMLVwRK8XS5BKmmw2QN8sY5BImjhalJZ44E", currency: "USD" }}
                                                    >
                                                        <PayPalButtons
                                                            createOrder={createOrder}
                                                            onApprove={captureOrder}
                                                            onError={(err) => console.error('PayPal Payment Error:', err)}
                                                        />
                                                    </PayPalScriptProvider>
                                                    <StripeModalWrapper
                                                        selectedAppointment={
                                                            selectedPayment
                                                        }
                                                        isOpen={isStripeOpen}
                                                        onClose={
                                                            handleStripeClose
                                                        }
                                                        onPaymentComplete={handlePaymentCompletion}
                                                    />
                                                    <button
                                                        onClick={
                                                            handleStripeOpen
                                                        }
                                                        className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center"
                                                    >
                                                        <img
                                                            className="max-w-20 max-h-5"
                                                            src={
                                                                assets.stripe_logo
                                                            }
                                                            alt="Stripe"
                                                        />
                                                    </button>
                                                </Div>
                                            ) : (
                                                <button
                                                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-500"
                                                    onClick={() =>
                                                        onlinePayment(item)
                                                    }
                                                >
                                                    Pay Online
                                                </button>
                                            )}
                                            <button
                                                onClick={() =>
                                                    cancelAppointmentData(
                                                        item.id
                                                    )
                                                }
                                                className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-500 mt-2"
                                            >
                                                {isLoading
                                                    ? "Loading..."
                                                    : "Cancel Appointment"}
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                cancelAppointmentData(item.id)
                                            }
                                            className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-500 mt-2"
                                        >
                                            {isLoading
                                                ? "Loading..."
                                                : "Cancel Appointment"}
                                        </button>
                                    )}
                                </>
                            )}
                        </Div>
                    </Div>
                ))}
            </Div>
        </Div>
    );
};

export default MyAppointments;
