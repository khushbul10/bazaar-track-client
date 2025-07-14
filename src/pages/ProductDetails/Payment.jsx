import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import PaymentForm from './PaymentForm';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = ({ product, setPaymentToggle }) => {
  return (
    <Elements className="w-full" stripe={stripePromise}>
      <PaymentForm setPaymentToggle={setPaymentToggle} product={product}></PaymentForm>
    </Elements>
  );
};

export default Payment;