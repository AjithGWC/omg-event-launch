import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { CreditCard, Loader2, ArrowLeft, Gem, X } from "lucide-react";
import rezorpayIcon from "../../assets/razorpay-icon.svg";
import { useToast } from "../../hooks/use-toast";
import video1 from "../../assets/video1.mp4";
import { generalPostFunction } from "../../utils/commonFun";
import {
  CreateOrderPayload,
  CreateOrderResponse,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
} from "../../types/payment-api";
import { RazorpayResponse } from "../../types/razorpay";
import { RudrakshaBookingValues } from "../../schemas/rudraksha-booking-schema";

const PAYMENT_BASE_URL =
  "https://omg-order-and-payment-service-993414851442.asia-south1.run.app";

interface RudrakshaPaymentStepProps {
  totalTokenAmount: number;
  rudrakshaQuantity: number;
  participatingInEvent: boolean;
  numberOfMembers: number;
  userId: string;
  bookingData: RudrakshaBookingValues;
  bookingResponse?: {
    id?: string;
    addressId?: string;
    templeId?: string;
  } | null;
  onPaymentSuccess: () => void;
  onPaymentError?: (error: string) => void;
  onBack: () => void;
  onClose: () => void;
}

const RudrakshaPaymentStep = ({
  totalTokenAmount,
  rudrakshaQuantity,
  participatingInEvent,
  numberOfMembers,
  userId,
  bookingData,
  bookingResponse,
  onPaymentSuccess,
  onPaymentError,
  onBack,
  onClose,
}: RudrakshaPaymentStepProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Check if Razorpay is loaded
  useEffect(() => {
    if (!window.Razorpay) {
      console.error("Razorpay script not loaded");
      toast({
        title: "Payment Error",
        description:
          "Payment gateway is not available. Please refresh the page.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const generateReceipt = () => {
    return `rudraksha_${Date.now()}_${userId.slice(0, 8)}`;
  };

  const generateCustomerEmail = () => {
    // Generate email from phone number as fallback
    // TODO: Add email field to booking form for better UX
    return `${bookingData.phoneNumber}@rudraksha.omg`;
  };

  const handlePayment = async () => {
    if (!window.Razorpay) {
      toast({
        title: "Payment Error",
        description:
          "Payment gateway is not available. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    setIsInitializing(true);

    try {
      // Step 1: Create Razorpay Order
      const orderPayload: CreateOrderPayload = {
        // amount: totalTokenAmount * 100, // Convert to paise
        amount: totalTokenAmount, // Convert to paise
        userId: userId,
        currency: "INR",
        receipt: generateReceipt(),
        autoCapture: false,
        customerEmail: generateCustomerEmail(),
        customerPhone: bookingData.phoneNumber,
        notes: {
          bookingType: "rudraksha",
          quantity: rudrakshaQuantity.toString(),
          participatingInEvent: participatingInEvent.toString(),
        },
        metadata: {
          rudrakshaQuantity: rudrakshaQuantity,
          participatingInEvent: participatingInEvent,
          numberOfMembers: numberOfMembers,
          bookingId: bookingResponse?.id || null,
        },
      };

      const orderResponse = await generalPostFunction<CreateOrderResponse>(
        "/payments/orders",
        orderPayload,
        undefined,
        PAYMENT_BASE_URL
      );

      if (orderResponse.status !== 200 && orderResponse.status !== 201) {
        throw new Error("Failed to create payment order");
      }

      const razorpayOrderId = orderResponse.data.record.razorpayOrderId;

      if (!razorpayOrderId) {
        throw new Error("Razorpay order ID not received");
      }

      setIsInitializing(false);
      setIsProcessing(true);

      // Step 2: Initialize Razorpay Checkout
      // Get Razorpay key from order response (if provided), environment variable, or fallback to default test key
      // The key should be your Razorpay publishable key (starts with rzp_)
      const razorpayKey =
        orderResponse.data.razorpayKey ||
        process.env.REACT_APP_RAZORPAY_KEY ||
        "rzp_test_RwZ8BsBI6seUZG"; // Fallback test key

      if (!razorpayKey) {
        throw new Error(
          "Razorpay key is not configured. Please set VITE_RAZORPAY_KEY in your environment variables or ensure the backend returns razorpayKey in the order response."
        );
      }

      const razorpayOptions = {
        key: razorpayKey,
        amount: totalTokenAmount * 100,
        currency: "INR",
        name: "Maha Yaagam 2026",
        description: `Payment for ${rudrakshaQuantity} Blessed Rudraksha${
          rudrakshaQuantity > 1 ? "s" : ""
        }`,
        order_id: razorpayOrderId,
        handler: async (response: RazorpayResponse) => {
          await handlePaymentSuccess(response, razorpayOrderId);
        },
        prefill: {
          name: bookingData.fullName,
          email: generateCustomerEmail(),
          contact: bookingData.phoneNumber,
        },
        theme: {
          color: "#F59E0B", // Gold color matching the theme
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process",
            });
          },
        },
      };

      const rzp = new window.Razorpay(razorpayOptions);
      rzp.open();

      rzp.on(
        "payment.failed",
        (response: { error: { description: string } }) => {
          setIsProcessing(false);
          toast({
            title: "Payment Failed",
            description:
              response.error?.description || "Payment could not be processed",
            variant: "destructive",
          });
          onPaymentError?.(response.error?.description || "Payment failed");
        }
      );
    } catch (error) {
      setIsInitializing(false);
      setIsProcessing(false);
      console.error("Payment initialization error:", error);
      toast({
        title: "Payment Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to initialize payment",
        variant: "destructive",
      });
      onPaymentError?.(
        error instanceof Error ? error.message : "Payment initialization failed"
      );
    }
  };

  const handlePaymentSuccess = async (
    razorpayResponse: RazorpayResponse,
    razorpayOrderId: string
  ) => {
    try {
      // Helper function to get the first preferred date from array
      const getFirstPreferredDate = (): string | null => {
        if (
          !bookingData.preferredDate ||
          !Array.isArray(bookingData.preferredDate) ||
          bookingData.preferredDate.length === 0
        ) {
          return null;
        }
        return bookingData.preferredDate[0];
      };

      const firstPreferredDate = getFirstPreferredDate();

      // Step 2: Verify Payment
      const verifyPayload: VerifyPaymentPayload = {
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
        userId: userId,
        templeId:
          bookingResponse?.templeId || "00000000-0000-0000-0000-000000000000",
        addressId:
          bookingResponse?.addressId || "00000000-0000-0000-0000-000000000000",
        // orderType: "rudraksha",
        orderType: "event",
        status: "pending",
        scheduledDate: firstPreferredDate
          ? firstPreferredDate.includes("T")
            ? firstPreferredDate.split("T")[0]
            : firstPreferredDate
          : new Date().toISOString().split("T")[0],
        scheduledTimestamp: firstPreferredDate
          ? firstPreferredDate.includes("T")
            ? new Date(firstPreferredDate).toISOString()
            : new Date(`${firstPreferredDate}T00:00:00`).toISOString()
          : new Date().toISOString(),
        fulfillmentType: "delivery",
        subtotal: totalTokenAmount,
        discountAmount: 0,
        convenienceFee: 0,
        taxAmount: 0,
        totalAmount: totalTokenAmount,
        currency: "INR",
        contactName: bookingData.fullName,
        contactPhone: bookingData.phoneNumber,
        contactEmail: generateCustomerEmail(),
        // Include booking data for backend to create booking after order creation
        rudrakshaBookingData: {
          userId: userId,
          fullName: bookingData.fullName,
          phoneNumber: bookingData.phoneNumber,
          addressText: bookingData.addressText || "",
          addressPlaceId: bookingData.addressPlaceId,
          addressLat: bookingData.addressLat,
          addressLng: bookingData.addressLng,
          age: bookingData.age,
          gender: bookingData.gender,
          participatingInEvent: participatingInEvent,
          preferredDate: firstPreferredDate
            ? firstPreferredDate.includes("T")
              ? firstPreferredDate.split("T")[0]
              : firstPreferredDate
            : undefined,
          preferredTimeSlot: bookingData.preferredTimeSlot,
          numberOfPeople: numberOfMembers + 1, // Main person + members
          members: bookingData.members?.map((m) => ({
            idName: m.idName,
            idAge: m.idAge,
            idGender: m.idGender,
          })),
          rudrakshaQuantity: rudrakshaQuantity,
        },
      };

      const verifyResponse = await generalPostFunction<VerifyPaymentResponse>(
        "/payments/verify",
        verifyPayload,
        undefined,
        PAYMENT_BASE_URL
      );

      if (verifyResponse.status !== 200 && verifyResponse.status !== 201) {
        throw new Error("Payment verification failed");
      }

      // Payment verified successfully - order is now verified
      setIsProcessing(false);
      toast({
        title: "Payment Verified!",
        description: "Your payment has been verified successfully",
      });
      onPaymentSuccess();
    } catch (error) {
      setIsProcessing(false);
      console.error("Payment processing error:", error);
      toast({
        title: "Payment Processing Error",
        description:
          error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive",
      });
      onPaymentError?.(
        error instanceof Error ? error.message : "Payment processing failed"
      );
    }
  };

  return (
    <div className="flex flex-1 flex-col md:flex-row overflow-hidden w-full h-full relative">
      {/* Left side - Video background */}
      <div className="hidden md:block relative w-full md:w-1/2 h-full overflow-hidden">
        <div className="absolute inset-0">
          <video
            src={video1}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40 md:bg-gradient-to-r md:from-black/85 md:via-black/50 md:to-black/30" />
        </div>

        {/* Buttons and text on top of video */}
        <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-8">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 hover:border-white/50 text-white transition-all shadow-sm hover:shadow-md w-fit"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gold" />
          </button>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/50 md:via-black/30 md:to-transparent rounded-lg -m-4 md:-m-6" />
            <div className="relative p-4 md:p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-bold mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Secure Payment
              </p>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-gold mb-3 leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                Complete Your
                <span className="block text-3xl md:text-4xl text-white mt-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                  Divine Purchase
                </span>
              </h3>
              <p className="text-sm md:text-base text-white font-medium max-w-sm leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                Secure your blessed Rudraksha with our trusted payment gateway.
                Your spiritual journey awaits.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full md:w-1/2 flex-col flex-1 h-full bg-white md:border-l md:border-gray-200 overflow-y-auto relative">
        {/* Back button - top left corner (mobile only) */}
        <button
          onClick={onBack}
          className="md:hidden absolute top-4 left-4 z-50 p-2 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 transition-all shadow-sm hover:shadow-md"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gold" />
        </button>
        {/* Close button - top right corner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 transition-all shadow-sm hover:shadow-md"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-6 py-4">
          <div className="space-y-4 max-w-md mx-auto">
            {/* Header */}
            <div className="pt-2 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 border border-gray-300 px-3 py-1 mb-4">
                <Gem className="w-4 h-4 text-gold" />
                <span className="text-gold text-sm">
                  Pre-Book Blessed Rudraksha
                </span>
              </div>

              {/* Sub-header */}
              <h3 className="font-display text-xl font-bold text-black">
                Full Payment
              </h3>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-center mb-3">
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Amount to Pay
                </p>
                <p className="font-sans text-3xl font-bold text-gold">
                  ₹{totalTokenAmount}
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-black flex items-center gap-2">
                  <span className="text-gold">•</span>
                  <span>{rudrakshaQuantity || 1} Blessed Rudraksha</span>
                </p>
                <p className="text-black flex items-center gap-2">
                  <span className="text-gold">•</span>
                  <span>Chanted 1 Million times</span>
                </p>
                {participatingInEvent && (
                  <p className="text-black flex items-center gap-2">
                    <span className="text-gold">•</span>
                    <span>
                      Event participation for {numberOfMembers} person(s)
                    </span>
                  </p>
                )}
              </div>
            </div>

            <Button
              className="w-full bg-red-600 text-white hover:bg-red-700"
              onClick={handlePayment}
              disabled={isProcessing || isInitializing}
            >
              {isProcessing || isInitializing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isInitializing ? "Initializing..." : "Processing..."}
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay ₹{totalTokenAmount}
                </>
              )}
            </Button>

            <div className="text-xs text-center text-gray-600 flex items-center justify-center gap-1.5">
              <span>Secure payment powered by</span>
              <img src={rezorpayIcon} alt="Razorpay" className="w-12 h-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RudrakshaPaymentStep;
