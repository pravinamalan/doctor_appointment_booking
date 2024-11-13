import React, { useState } from 'react';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { showToast } from '../utils/toast';
import Div from '../common/Div';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51Q9fftKQa3nGoF75J0URcqowoaJSLm2C4dsRYIhGtPsZrTJkuKRIRbS61OqFO3AqznsM8zYKhWNDxTbIrjREFbcu00Bik6l40J');
// const stripePromise = loadStripe(process.env.STRIPE_KEY)

const StripePaymentModal = ({ selectedAppointment, onClose,onPaymentComplete}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = {
                amount : selectedAppointment.amount,
                id: selectedAppointment.id
            }

            const  response = await axios.post('api/stripe-payment', data );

            const cardElement = elements.getElement(CardElement);
            const { paymentIntent, error } = await stripe.confirmCardPayment(response.data.clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (error) {
                setError(error.message);
            } else if (paymentIntent.status === 'succeeded') {
                showToast('Payment successful!','success');
                onPaymentComplete();
                onClose();
            }
        } catch (error) {
            setError('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Pay with Stripe</h2>
                <form onSubmit={handlePayment}>
                    <CardElement className="border p-3 mb-4" />
                    {error && <p className="text-red-500">{error}</p>}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded w-full"
                        disabled={!stripe || loading}
                    >
                        {loading ? 'Processing...' : 'Pay'}
                    </button>
                </form>
                <button
                    className="mt-4 w-full py-2 border rounded"
                    onClick={onClose}
                >
                    Close
                </button>
            </Div>
        </Div>
    );
};

const StripeModalWrapper = ({ selectedAppointment, isOpen, onClose,onPaymentComplete }) => {
    return (
        isOpen && (
            <Elements stripe={stripePromise}>
                <StripePaymentModal selectedAppointment={selectedAppointment} onClose={onClose} onPaymentComplete={onPaymentComplete} />
            </Elements>
        )
    );
};

export default StripeModalWrapper;
