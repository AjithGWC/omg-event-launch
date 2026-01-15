import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";
import { Gem, ArrowLeft } from "lucide-react";
import { cn } from "../../lib/utils";
import { RudrakshaBookingValues } from "../../schemas/rudraksha-booking-schema";
import { generalGetFunction, generalPostFunction } from "../../utils/commonFun";
import RudrakshaLoginStep from "./RudrakshaLoginStep";
import RudrakshaDetailsStep from "./RudrakshaDetailsStep";
import RudrakshaPaymentStep from "./RudrakshaPaymentStep";
import RudrakshaSuccessStep from "./RudrakshaSuccessStep";
import axios from "axios";

interface RudrakshaBookingProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "login" | "details" | "payment" | "success";

interface MeUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  phoneNumber: string;
  address?: string | null;
}

const RUDRAKSHA_PRICE = 999; // Price per Rudraksha
const TOKEN_AMOUNT = 999; // Full payment per Rudraksha

const RudrakshaBooking = ({ isOpen, onClose }: RudrakshaBookingProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("login");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [bookingData, setBookingData] = useState<RudrakshaBookingValues | null>(null);
  const [bookingResponse, setBookingResponse] = useState<{ id?: string; addressId?: string; templeId?: string } | null>(null);
  const [userDetails, setUserDetails] = useState<MeUser | null>(null);

  const fetchUserDetailsWithToken = useCallback(async () => {
    setIsCheckingToken(true);
    try {
      const response = await generalGetFunction<{
        success: boolean;
        message: string;
        data: { user: MeUser };
      }>("/users/me", undefined, "https://omg-identity-service-993414851442.asia-south1.run.app");

      if (response.status === 200 || response.status === 201) {
        const user = response.data?.data?.user;
        if (user) {
          setUserDetails(user);

          // Normalize phone number for the form (strip +91 if present)
          const rawPhone = user.phoneNumber || "";
          const normalizedPhone =
            rawPhone.startsWith("+91") && rawPhone.length > 3
              ? rawPhone.slice(3)
              : rawPhone;

          setPhoneNumber(normalizedPhone);
          setUserId(user.id);

          // Directly go to details step since the user is already verified
          setStep("details");
          setIsCheckingToken(false);
          return;
        }
      }
      // If no user data, go to login
      setStep("login");
      setIsCheckingToken(false);
    } catch (error) {
      console.error("Error fetching user details with token:", error);

      // If token is invalid/expired, clear it and send user to login step
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("token");
        setUserDetails(null);
        setPhoneNumber("");
        setUserId(null);
        setStep("login");
        setIsCheckingToken(false);

        toast({
          title: "Session expired",
          description: "Please verify your mobile number again to continue.",
          variant: "destructive",
        });
      } else {
        setStep("login");
        setIsCheckingToken(false);
        // Don't show toast for other errors to avoid bad UX
      }
    }
  }, [toast]);

  useEffect(() => {
    if (!isOpen) {
      setIsCheckingToken(false);
      return;
    }

    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setStep("login");
      setIsCheckingToken(false);
      return;
    }

    // Check token before showing any step
    void fetchUserDetailsWithToken();
  }, [isOpen, fetchUserDetailsWithToken]);

  const handleLoginVerified = (verifiedPhoneNumber: string, verifiedUserId: string) => {
    setPhoneNumber(verifiedPhoneNumber);
    setUserId(verifiedUserId);
    setUserDetails(null);
    setStep("details");
  };

  const handleDetailsSubmit = async (data: RudrakshaBookingValues) => {
    // Store booking data in state - booking will be created after payment verification
    setBookingData(data);
    setStep("payment");
    toast({
      title: "Details Saved",
      description: "You can now proceed to payment",
    });
  };

  const handlePaymentSuccess = () => {
    setStep("success");
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
    // Optionally stay on payment step or go back to details
  };

  // Reset form when closing
  const handleClose = () => {
    setStep("login");
    setPhoneNumber("");
    setUserId(null);
    setBookingData(null);
    setBookingResponse(null);
    setIsLoading(false);
    setIsCheckingToken(false);
    setUserDetails(null);
    onClose();
  };

  // Calculate values for payment and success steps
  const rudrakshaQuantity = bookingData?.rudrakshaQuantity || 1;
  const totalTokenAmount = TOKEN_AMOUNT * rudrakshaQuantity;
  const participatingInEvent = bookingData?.participatingInEvent || false;
  const numberOfMembers = (bookingData?.members?.length || 0) + 1;

  if (!isOpen) return null;

  // Show loading state while checking token to avoid showing login step briefly
  if (isCheckingToken) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <div className="w-full max-w-5xl h-[90vh] max-h-[90vh] bg-white rounded-2xl border border-gray-200 shadow-divine flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            <p className="text-black text-sm">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/70 backdrop-blur-md">
      <div className={cn(
        "w-full bg-white md:rounded-2xl border-none md:border md:border-gray-200 shadow-divine animate-in fade-in zoom-in duration-300 flex flex-col overflow-hidden",
        step === "login" || step === "payment" || step === "success"
          ? "h-[100dvh] max-w-5xl md:my-auto md:h-[90vh] md:max-h-[90vh]"
          : "h-[100dvh] max-w-7xl md:my-auto md:h-[95vh] md:max-h-[95vh]"
      )}>
        {/* Login Step */}
        {step === "login" && (
          <RudrakshaLoginStep
            onVerified={handleLoginVerified}
            onCancel={handleClose}
            showHeader={true}
          />
        )}

        {/* Details Step */}
        {step === "details" && phoneNumber && (
          <RudrakshaDetailsStep
            phoneNumber={phoneNumber}
            initialFullName={
              userDetails?.displayName ||
              `${userDetails?.firstName ?? ""} ${userDetails?.lastName ?? ""}`.trim() ||
              ""
            }
            initialAddressText={userDetails?.address ?? ""}
            onSubmit={handleDetailsSubmit}
            onBack={() => setStep("login")}
            onClose={handleClose}
            isLoading={isLoading}
          />
        )}

        {/* Payment Step */}
        {step === "payment" && bookingData && userId && (
          <RudrakshaPaymentStep
            totalTokenAmount={totalTokenAmount}
            rudrakshaQuantity={rudrakshaQuantity}
            participatingInEvent={participatingInEvent}
            numberOfMembers={numberOfMembers}
            userId={userId}
            bookingData={bookingData}
            bookingResponse={bookingResponse}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            onBack={() => setStep("details")}
            onClose={handleClose}
          />
        )}

        {/* Success Step */}
        {step === "success" && bookingData && (
          <RudrakshaSuccessStep
            rudrakshaQuantity={rudrakshaQuantity}
            totalTokenAmount={totalTokenAmount}
            participatingInEvent={participatingInEvent}
            numberOfMembers={numberOfMembers}
            onDone={handleClose}
            showHeader={true}
          />
        )}
      </div>
    </div>
  );
};

export default RudrakshaBooking;
