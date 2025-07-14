import React from "react";
import { toast } from "react-toastify";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const StripeCheckoutButton = ({ productId }) => {
  const axiosSecure = useAxiosSecure();

  // Initiate Stripe Checkout
  const handleCheckout = async () => {
    try {
      // Request to initiate a Stripe Checkout session for the product
      const response = await axiosSecure.post(`/checkout/${productId}`);

      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl; // Redirect to Stripe Checkout page
      } else {
        toast.error("Error initiating payment!");
      }
    } catch (error) {
      toast.error("Error with Stripe Checkout!");
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700 transition duration-300"
    >
      Buy Product
    </button>
  );
};

export default StripeCheckoutButton;
