import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import toast from "react-hot-toast";

const PaymentVerify = () => {
   const [searchParams] = useSearchParams();
   const navigate = useNavigate();
   const { backendUrl, token, setCartItem } = useContext(ShopContext);
   const [verifying, setVerifying] = useState(true);
   const [paymentStatus, setPaymentStatus] = useState(null);

   // Get query parameters from URL
   const pidx = searchParams.get('pidx');
   const status = searchParams.get('status');
   const transaction_id = searchParams.get('transaction_id');
   const purchase_order_id = searchParams.get('purchase_order_id');
   const amount = searchParams.get('amount');

   useEffect(() => {
      const verifyPayment = async () => {
         try {
            if (!pidx || !purchase_order_id) {
               toast.error("Invalid payment parameters");
               navigate('/orders');
               return;
            }

            // Check initial status from URL
            if (status === 'User canceled') {
               setPaymentStatus('canceled');
               setVerifying(false);
               toast.error("Payment was canceled");
               setTimeout(() => navigate('/cart'), 3000);
               return;
            }

            // Verify payment with backend
            const response = await axios.post(
               backendUrl + '/api/order/khalti/verify',
               {
                  pidx,
                  purchase_order_id,
                  transaction_id,
                  amount,
                  status
               },
               { headers: { token } }
            );

            setVerifying(false);

            if (response.data.success && response.data.verified) {
               setPaymentStatus('success');
               setCartItem({});
               toast.success("Payment verified successfully!");
               setTimeout(() => navigate('/orders'), 3000);
            } else {
               setPaymentStatus('failed');
               toast.error(response.data.message || "Payment verification failed");
               setTimeout(() => navigate('/cart'), 3000);
            }

         } catch (error) {
            console.log(error);
            setVerifying(false);
            setPaymentStatus('error');
            toast.error(error.response?.data?.message || "Payment verification error");
            setTimeout(() => navigate('/cart'), 3000);
         }
      };

      verifyPayment();
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
         <div className="max-w-md w-full bg-white border rounded-lg shadow-lg p-8 text-center">
            {verifying ? (
               <>
                  <div className="mb-4">
                     <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900"></div>
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">Verifying Payment...</h2>
                  <p className="text-gray-600">Please wait while we verify your payment with Khalti</p>
               </>
            ) : (
               <>
                  {paymentStatus === 'success' && (
                     <>
                        <div className="mb-4">
                           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                           </div>
                        </div>
                        <h2 className="text-2xl font-semibold text-green-600 mb-2">Payment Successful!</h2>
                        <p className="text-gray-600 mb-4">Your order has been placed successfully.</p>
                        {transaction_id && (
                           <p className="text-sm text-gray-500">Transaction ID: {transaction_id}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-4">Redirecting to orders page...</p>
                     </>
                  )}
                  
                  {paymentStatus === 'failed' && (
                     <>
                        <div className="mb-4">
                           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
                              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                           </div>
                        </div>
                        <h2 className="text-2xl font-semibold text-red-600 mb-2">Payment Failed</h2>
                        <p className="text-gray-600 mb-4">Your payment could not be verified.</p>
                        <p className="text-sm text-gray-500 mt-4">Redirecting to cart...</p>
                     </>
                  )}

                  {paymentStatus === 'canceled' && (
                     <>
                        <div className="mb-4">
                           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100">
                              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                              </svg>
                           </div>
                        </div>
                        <h2 className="text-2xl font-semibold text-yellow-600 mb-2">Payment Canceled</h2>
                        <p className="text-gray-600 mb-4">You have canceled the payment.</p>
                        <p className="text-sm text-gray-500 mt-4">Redirecting to cart...</p>
                     </>
                  )}

                  {paymentStatus === 'error' && (
                     <>
                        <div className="mb-4">
                           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
                              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                           </div>
                        </div>
                        <h2 className="text-2xl font-semibold text-red-600 mb-2">Verification Error</h2>
                        <p className="text-gray-600 mb-4">An error occurred while verifying payment.</p>
                        <p className="text-sm text-gray-500 mt-4">Redirecting to cart...</p>
                     </>
                  )}
               </>
            )}
         </div>
      </div>
   );
};

export default PaymentVerify;
