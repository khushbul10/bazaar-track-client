import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import Loader from "../../Shared/Loader/Loader";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

const PaymentForm = ({ product, setPaymentToggle }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  // const { handleUpdateStatus, isUpdating } = useUpdateTrackingStatus();
  const navigate = useNavigate();

  const [error, setError] = useState(null);



  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted");
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    // Get a reference to the CardElement
    const card = elements.getElement(CardElement);
    if (!card) {
      // CardElement not found
      return;
    }

    // Create a payment method using the card details
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      // Handle error in payment method creation
      setError(error.message);
      console.error("Error creating payment method:", error);
    } else {
      // Payment method created successfully
      console.log("Payment Method created:", paymentMethod);
      setError(null);
      // You can now send the paymentMethod.id to your server for processing
      // For example, you might want to call your backend API to complete the payment
      // create payment intent
      const paymentIntentResponse = await axiosSecure.post(
        "/create-payment-intent",
        {
          amount: product.pricePerUnit * 100, // Convert to cents
          paymentMethodId: paymentMethod.id,
          productId: product._id,
        }
      );
      console.log("Payment Intent Response:", paymentIntentResponse.data);
      const { clientSecret } = paymentIntentResponse.data;
      // Confirm the payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName, // Use sender's name as billing name
            email: user.email, // Use sender's email for billing
          },
        },
      });
      if (result.error) {
        // Show error to your customer (e.g., insufficient funds)
        setError(result.error.message);
        console.error("Payment confirmation error:", result.error);
      } else {
        // The payment has been processed!
        if (result.paymentIntent.status === "succeeded") {
          await axiosSecure.post("/orders", {
            productId: product._id,
            productName: product.itemName,
            marketName: product.marketName,
            transactionId: result.paymentIntent.id,
            price: product.pricePerUnit,
            buyerName: user.displayName,
            buyerEmail: user.email,
            date: new Date().toISOString(),
          }).then(() => {
            // Update tracking status
            // handleUpdateStatus({
            //   trackingId: parcelInfo.tracking_id,
            //   newStatus: "paid",
            //   location: parcelInfo.senderCenter,
            //   note: "Payment confirmed",
            // })
            // Swal.fire({
            //   title: "Payment Successful",
            //   text: `Your payment of $${parcelInfo.cost} has been successfully processed.`,
            //   icon: "success",
            //   confirmButtonText: "OK",
            // });
            // Optionally, redirect to a success page or update UI
            // navigate("/dashboard/my-parcels");
            toast.success("Payment successful! Your order has been placed.");
            setPaymentToggle(false); // Close the payment modal
          }).catch((error) => {
            console.error("Error confirming payment:", error);
            setError("Payment confirmation failed. Please try again.");
          });
        } else {
          // Payment not successful, handle accordingly
          setError("Payment not successful. Please try again.");
        }
      }
    }
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto my-10 p-6 border rounded-lg shadow-lg"
      >
        <CardElement className="border p-4 rounded-md shadow-sm"></CardElement>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Product Information</h3>
          <p>
            <strong>Name: </strong> {product.itemName}
          </p>
          <p>
            <strong>Vendor Name: </strong> {product.vendorName}
          </p>
          <p className="text-xl">
            <strong>Amount:</strong>{" "}
            <span className="badge badge-secondary font-bold">
              ${product.pricePerUnit}
            </span>
          </p>
        </div>
        <button
          type="submit"
          disabled={!stripe}
          className="btn btn-primary w-full mt-4"
        >
          Pay Now
        </button>
      </form>
      {error && (
        <div className="text-red-500 text-center mt-4">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;