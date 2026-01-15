import { useState, useMemo, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "../hooks/use-toast";
import {
  CheckCircle,
  User,
  Phone,
  MapPin,
  ChevronDownIcon,
  Clock,
  Sun,
  Moon,
  Loader2,
  Info,
  Asterisk,
  Users,
  X,
} from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  registrationFormSchema,
  RegistrationFormValues,
} from "../schemas/registration-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "../lib/utils";
import ValidationErrorMessage from "./ui/validation-error-message";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { ScrollArea } from "./ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { generalPostFunction } from "../utils/commonFun";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "./ui/tooltip";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import video1 from "../assets/video1.mp4";

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

// Time slots configuration
const TIME_SLOTS = [
  {
    start: "06:00:00",
    end: "08:00:00",
    label: "Early Morning",
    icon: Sun,
    period: "Morning",
  },
  {
    start: "08:00:00",
    end: "10:00:00",
    label: "Morning",
    icon: Sun,
    period: "Morning",
  },
  {
    start: "10:00:00",
    end: "12:00:00",
    label: "Late Morning",
    icon: Sun,
    period: "Morning",
  },
  {
    start: "12:00:00",
    end: "14:00:00",
    label: "Afternoon",
    icon: Sun,
    period: "Afternoon",
  },
  {
    start: "14:00:00",
    end: "16:00:00",
    label: "Afternoon",
    icon: Sun,
    period: "Afternoon",
  },
  {
    start: "16:00:00",
    end: "18:00:00",
    label: "Evening",
    icon: Sun,
    period: "Evening",
  },
  {
    start: "18:00:00",
    end: "20:00:00",
    label: "Evening",
    icon: Moon,
    period: "Evening",
  },
  {
    start: "20:00:00",
    end: "22:00:00",
    label: "Night",
    icon: Moon,
    period: "Night",
  },
  {
    start: "22:00:00",
    end: "06:00:00",
    label: "Midnight",
    icon: Moon,
    period: "Midnight",
    fullWidth: true,
  },
] as const;

const RegistrationForm = ({ isOpen, onClose }: RegistrationFormProps) => {
  console.log("free registration form");
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState<string>("1");

  interface RegistrationInfo {
    id: string;
    fullName: string;
    phoneNumber: string;
    age?: number | null;
    gender: string;
    preferredDate: string[];
    preferredTimeSlot: Record<string, string | string[]>;
    numberOfPeople: number;
    createdAt?: string;
  }

  const [registrationInfo, setRegistrationInfo] =
    useState<RegistrationInfo | null>(null);

  // Helper function to format YYYY-MM-DD to DD-MM-YYYY
  const formatDateString = (dateStr: string): string => {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  // Helper function to format Date object to DD/MM/YYYY
  const formatDateDisplay = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Get today's date at start of day for date restriction
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  // Maha Shivratri event dates: February 15-16, 2026
  const allowedDates = useMemo(() => {
    const date1 = new Date(2026, 1, 15); // Month is 0-indexed, so 1 = February
    date1.setHours(0, 0, 0, 0);
    const date2 = new Date(2026, 1, 16);
    date2.setHours(0, 0, 0, 0);
    return [date1, date2];
  }, []);

  // Default month to show when calendar opens (February 2026)
  const defaultMonth = useMemo(() => {
    return new Date(2026, 1, 1); // February 2026
  }, []);

  // Function to check if a date should be disabled (true = disabled)
  const isDateDisabled = (date: Date) => {
    const dateStr = date.getTime();
    return !allowedDates.some(
      (allowedDate) => allowedDate.getTime() === dateStr
    );
  };
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    setValue,
    reset,
    watch,
    getValues,
    trigger,
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    mode: "onChange",
    defaultValues: {
      members: [],
      preferredTimeSlot: {},
      preferredDate: [],
      gender: "",
      addressText: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      district: "",
      state: "",
      pinCode: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync members array with numberOfPeople selection
  useEffect(() => {
    const targetCount = parseInt(numberOfPeople, 10) - 1; // Subtract 1 because primary user is separate
    const currentCount = fields.length;

    if (targetCount > currentCount) {
      // Add missing members
      const membersToAdd = targetCount - currentCount;
      for (let i = 0; i < membersToAdd; i++) {
        append({
          idName: "",
          idAge: undefined,
          idGender: "",
        });
      }
    } else if (targetCount < currentCount) {
      // Remove excess members
      const membersToRemove = currentCount - targetCount;
      for (let i = 0; i < membersToRemove; i++) {
        remove(currentCount - 1 - i);
      }
    }
  }, [numberOfPeople, fields.length, append, remove]);

  const onSubmit = async (data: RegistrationFormValues) => {
    // Combine address fields into addressText
    const addressParts = [
      data.addressLine1,
      data.addressLine2,
      data.city,
      data.district,
      data.state,
      data.pinCode,
    ].filter((part) => part && part.trim() !== "");

    const combinedAddress =
      addressParts.length > 0 ? addressParts.join(", ") : "";

    // Format the payload according to API requirements
    interface FormattedPayload {
      fullName: string;
      phoneNumber: string;
      age?: number;
      gender: string;
      preferredDate: string[];
      preferredTimeSlot: Record<string, string | string[]>;
      numberOfPeople: number;
      addressText?: string;
      members?: Array<{
        idName: string;
        idAge?: number;
        idGender: string;
      }>;
    }

    interface ApiRegistrationResponse {
      data?: {
        data?: {
          registration?: RegistrationInfo;
        };
      };
      status?: number;
    }

    const formattedData: FormattedPayload = {
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      gender: data.gender,
      preferredDate: data.preferredDate,
      preferredTimeSlot: data.preferredTimeSlot,
      numberOfPeople: parseInt(numberOfPeople, 10),
    };

    // Only include age if it has a value (optional field)
    if (data.age !== undefined && data.age !== null && !isNaN(data.age)) {
      formattedData.age = data.age;
    }

    // Only include addressText if it has a value (optional field)
    if (combinedAddress && combinedAddress.trim() !== "") {
      formattedData.addressText = combinedAddress;
    }

    // Format members array
    if (data.members && data.members.length > 0) {
      formattedData.members = data.members.map((member) => {
        const memberData: { idName: string; idAge?: number; idGender: string } =
          {
            idName: member.idName,
            idGender: member.idGender,
          };
        // Only include idAge if it has a value (optional field)
        if (
          member.idAge !== undefined &&
          member.idAge !== null &&
          !isNaN(member.idAge)
        ) {
          memberData.idAge = member.idAge;
        }
        return memberData;
      });
    }
    setIsLoading(true);
    try {
      const response = (await generalPostFunction(
        "/launch-event/free-registration",
        formattedData
      )) as ApiRegistrationResponse;
      console.log("response: ", response);
      if (response.status === 200 || response.status === 201) {
        // Extract registration info from API response at response.data.data.registration
        const registration = response.data?.data?.registration;
        setRegistrationInfo((registration as RegistrationInfo) ?? null);

        setIsSubmitted(true);
        setIsLoading(false);
        toast({
          title: "🙏 Registration Successful!",
          description: "You are now registered for Maha Shivaratri 2026",
        });
      } else {
        setIsLoading(false);
        toast({
          title: "Registration Failed",
          description: "Please try again",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      setIsLoading(false);
      // Handle axios error response
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status?: number; data?: { message?: string } };
        };
        const errorMessage =
          axiosError.response?.data?.message ||
          axiosError.response?.status === 400
            ? axiosError.response?.data?.message ||
              "Invalid form data. Please check your inputs."
            : "Registration failed. Please try again.";

        toast({
          title: "Registration Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Failed",
          description: "An error occurred. Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  const handleNumberOfPeopleChange = (value: string) => {
    setNumberOfPeople(value);
  };

  // Handle phone number change with validation (same as RudrakshaLoginStep)
  const handlePhoneNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    registerOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => {
    const value = e.target.value;
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, "");
    // Only allow if it starts with 6-9 or is empty
    if (digitsOnly === "" || /^[6-9]/.test(digitsOnly)) {
      // Limit to 10 digits
      const limitedValue = digitsOnly.slice(0, 10);
      // Create a new event with the limited value
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: limitedValue },
      } as React.ChangeEvent<HTMLInputElement>;
      registerOnChange(syntheticEvent);
      // Also update via setValue for immediate validation
      setValue("phoneNumber", limitedValue, {
        shouldValidate: true,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-8xl h-[95vh] bg-white rounded-2xl border border-gray-200 shadow-divine animate-in fade-in zoom-in duration-300 flex flex-col overflow-hidden">
        {!isSubmitted && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 rounded-full p-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 transition-all shadow-sm hover:shadow-md"
            aria-label="Close registration form"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {isSubmitted ? (
          <div className="text-center py-8 px-6">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center animate-glow border border-green-300">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="font-display text-2xl font-bold text-black mb-2">
              Om Namah Shivaya!
            </h3>
            <p className="text-gray-700 mb-4">
              Your registration is confirmed. We will contact you with event
              details.
            </p>

            {registrationInfo && (
              <div className="max-w-md mx-auto mb-6 text-sm text-left bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
                <div className="flex justify-between gap-2">
                  <span className="text-gray-600">Registration ID</span>
                  <span className="font-mono text-black text-xs">
                    {registrationInfo.id}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium text-black">
                    {registrationInfo.fullName}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-gray-600">Phone</span>
                  <span className="font-medium text-black">
                    +91 {registrationInfo.phoneNumber}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-gray-600">Gender</span>
                  <span className="capitalize text-black">
                    {registrationInfo.gender}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-gray-600">No. of People</span>
                  <span className="text-black">
                    {registrationInfo.numberOfPeople}
                  </span>
                </div>
                {registrationInfo.preferredDate &&
                  registrationInfo.preferredDate.length > 0 && (
                    <>
                      <div className="flex justify-between gap-2">
                        <span className="text-gray-600">
                          Visit Date
                        </span>
                        <span className="text-black">
                          {formatDateString(registrationInfo.preferredDate[0])}
                        </span>
                      </div>
                      {(() => {
                        const primaryDate =
                          registrationInfo.preferredDate[0] ?? "";
                        const slotValueRaw =
                          registrationInfo.preferredTimeSlot?.[primaryDate];
                        const slotValue = Array.isArray(slotValueRaw)
                          ? slotValueRaw[0]
                          : slotValueRaw;
                        if (!slotValue) return null;
                        const [start, end] = slotValue.split("-");
                        const formattedSlot = `${start.slice(
                          0,
                          5
                        )} - ${end.slice(0, 5)}`;
                        return (
                          <div className="flex justify-between gap-2">
                            <span className="text-gray-600">
                              Time Slot
                            </span>
                            <span className="text-black">
                              {formattedSlot}
                            </span>
                          </div>
                        );
                      })()}
                    </>
                  )}
              </div>
            )}

            <Button
              variant="divine"
              onClick={() => {
                setIsSubmitted(false);
                setRegistrationInfo(null);
                reset();
                setViewDate(undefined);
                setNumberOfPeople("1");
                onClose();
              }}
            >
              Close
            </Button>
          </div>
        ) : (
          <div className="flex flex-1 flex-col md:flex-row overflow-hidden w-full">
            {/* Video side */}
            <div className="relative w-full md:w-1/2 h-48 md:h-full overflow-hidden">
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

              {/* Content overlay */}
              <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8 text-left">
                <div className="relative">
                  {/* Subtle background gradient behind text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/50 md:via-black/30 md:to-transparent rounded-lg -m-4 md:-m-6" />

                  <div className="relative p-4 md:p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-gold font-bold mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      Maha Shivaratri 2026
                    </p>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-gold mb-3 leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                      Immerse in the divine grace of
                      <span className="block text-3xl md:text-4xl text-white mt-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                        Lord Shiva
                      </span>
                    </h3>
                    <p className="text-sm md:text-base text-white font-medium max-w-sm leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                      Experience a sacred night of meditation, devotion and
                      inner stillness under the benevolent gaze of Mahadev.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form side */}
            <div className="flex w-full md:w-1/2 flex-col h-full bg-white md:border-l md:border-gray-200">
              <div className="text-center py-6 px-6 border-b border-gray-200 flex-shrink-0">
                <h3 className=" text-2xl font-bold text-[#E32C26] mb-2  font-['Montserrat']">
                  Free Registration
                </h3>
                <p className="text-gray-700 text-sm">
                  Join us for the divine Maha Shivaratri experience
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col flex-1 min-h-0 overflow-hidden"
              >
                <div className="flex-1 min-h-0 px-6">
                  <ScrollArea className="h-full">
                    <TooltipProvider>
                      <div className="space-y-4 py-4 pr-4">
                      {/* Row 1: Full Name | Phone Number */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="fullName"
                            className="text-black flex items-center gap-2"
                          >
                            <User className="w-4 h-4 text-[#E32C26]" />
                            <span className="flex items-center gap-1">
                              Full Name
                              <Asterisk className="w-3 h-3 text-red-500" />
                            </span>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-3 h-3 text-gray-500" />
                              </TooltipTrigger>
                              <TooltipContent className="text-xs">
                                <p>
                                  Full name is required for identification
                                  purposes
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            id="fullName"
                            placeholder="Enter your full name"
                            {...register("fullName")}
                            className={cn(
                              "bg-white focus:border-gray-400 focus-visible:border-gray-400 focus-visible:ring-0 text-black placeholder:text-gray-400 border-gray-300",
                              errors.fullName
                                ? "border-red-500"
                                : "border-gray-300"
                            )}
                          />
                          <div className="min-h-[20px]">
                            {errors.fullName && (
                              <ValidationErrorMessage
                                message={errors.fullName.message || "Invalid input"}
                              />
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="phoneNumber"
                            className="text-black flex items-center gap-2"
                          >
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4 text-[#E32C26]" /> Phone
                              Number
                              <Asterisk className="w-3 h-3 text-red-500" />
                            </span>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-3 h-3 text-gray-500" />
                              </TooltipTrigger>
                              <TooltipContent className="text-xs">
                                <p>
                                  Phone number is required for communication
                                  purposes
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <div
                            className={cn(
                              "flex items-center rounded-md border bg-white px-3 h-11 border-gray-300",
                              errors.phoneNumber
                                ? "border-red-500"
                                : "border-gray-300"
                            )}
                          >
                            <span className="text-base text-gray-600 pr-3 border-r border-gray-300">
                              +91
                            </span>
                            <Input
                              id="phoneNumber"
                              type="tel"
                              placeholder="Enter 10-digit number"
                              maxLength={10}
                              inputMode="numeric"
                              pattern="[6-9][0-9]{9}"
                              {...((): React.InputHTMLAttributes<HTMLInputElement> => {
                                const { onChange, ...rest } =
                                  register("phoneNumber");
                                return {
                                  ...rest,
                                  onChange: (e) => {
                                    handlePhoneNumberChange(e, onChange);
                                  },
                                  className: cn(
                                    "border-0 bg-transparent focus-visible:ring-0 focus-visible:border-0 focus:border-0 text-black text-base h-auto flex-1 shadow-none placeholder:text-gray-400",
                                    errors.phoneNumber ? "text-red-500" : ""
                                  ),
                                };
                              })()}
                            />
                          </div>
                          <div className="min-h-[20px]">
                            {errors.phoneNumber && (
                              <ValidationErrorMessage
                                message={errors.phoneNumber.message || "Invalid input"}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Row 2: Age | Gender */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="age"
                            className="text-black flex items-center gap-2"
                          >
                            <User className="w-4 h-4 text-[#E32C26]" />
                            <span className="flex items-center gap-1">
                              Age
                              <span className="text-xs text-gray-500">
                                (optional)
                              </span>
                            </span>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-3 h-3 text-[#E32C26]" />
                              </TooltipTrigger>
                              <TooltipContent className="text-xs">
                                <p>Enter your age in years (optional)</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input
                            id="age"
                            type="number"
                            placeholder="Enter your age"
                            {...((): React.InputHTMLAttributes<HTMLInputElement> => {
                              const { onChange, onBlur, ...rest } = register(
                                "age",
                                {
                                  valueAsNumber: true,
                                }
                              );
                              return {
                                ...rest,
                                onKeyDown: (e) => {
                                  const input = e.target as HTMLInputElement;
                                  const currentValue = input.value || "";
                                  // Prevent typing if already 3 digits (unless deleting)
                                  if (
                                    currentValue.length >= 3 &&
                                    ![
                                      "Backspace",
                                      "Delete",
                                      "ArrowLeft",
                                      "ArrowRight",
                                      "Tab",
                                    ].includes(e.key) &&
                                    !e.ctrlKey &&
                                    !e.metaKey
                                  ) {
                                    e.preventDefault();
                                  }
                                },
                                onChange: (e) => {
                                  const value = e.target.value;
                                  // Remove non-digits and limit to 3 digits
                                  const digitsOnly = value.replace(/\D/g, "");
                                  const limitedValue = digitsOnly.slice(0, 3);

                                  // Create a new event with the limited value if it changed
                                  if (limitedValue !== digitsOnly) {
                                    const syntheticEvent = {
                                      ...e,
                                      target: {
                                        ...e.target,
                                        value: limitedValue,
                                      },
                                    } as React.ChangeEvent<HTMLInputElement>;
                                    onChange(syntheticEvent);
                                  } else {
                                    onChange(e);
                                  }

                                  // Trigger validation after value change
                                  setTimeout(() => trigger("age"), 10);
                                },
                                onBlur: (e) => {
                                  onBlur(e);
                                  trigger("age");
                                },
                              };
                            })()}
                            className={cn(
                              "bg-white border-gray-300 focus:border-gray-400 focus-visible:border-gray-400 focus-visible:ring-0 text-black placeholder:text-gray-400",
                              errors.age ? "border-red-500" : "border-white/30"
                            )}
                            min={1}
                            max={150}
                          />
                          <div className="min-h-[20px]">
                            {errors.age && (
                              <ValidationErrorMessage
                                message={errors.age.message || "Invalid input"}
                              />
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-black flex items-center gap-2">
                            <User className="w-4 h-4 text-[#E32C26]" />
                            <span className="flex items-center gap-1">
                              Gender
                              <Asterisk className="w-3 h-3 text-red-500" />
                            </span>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-3 h-3 text-gray-500" />
                              </TooltipTrigger>
                              <TooltipContent className="text-xs">
                                <p>Select your gender</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <div className="pt-2">
                            <RadioGroup
                              value={watch("gender")}
                              onValueChange={(value) =>
                                setValue("gender", value)
                              }
                              className="flex gap-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="male" id="gender-male" />
                                <Label
                                  htmlFor="gender-male"
                                  className="cursor-pointer text-black"
                                >
                                  Male
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="female"
                                  id="gender-female"
                                />
                                <Label
                                  htmlFor="gender-female"
                                  className="cursor-pointer text-black"
                                >
                                  Female
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="others"
                                  id="gender-others"
                                />
                                <Label
                                  htmlFor="gender-others"
                                  className="cursor-pointer text-black"
                                >
                                  Others
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                          <div className="min-h-[20px]">
                            {errors.gender && (
                              <ValidationErrorMessage
                                message={errors.gender.message || "Invalid input"}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Row 3: Address Fields (3 columns per row) */}
                      <div className="space-y-4">
                        <Label className="text-black flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#E32C26]" />
                          <span className="flex items-center gap-1">
                            Address
                            <span className="text-xs text-gray-500">
                              (optional)
                            </span>
                          </span>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-3 h-3 text-gray-500" />
                            </TooltipTrigger>
                            <TooltipContent className="text-xs">
                              <p>Address is optional for registration</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>

                        {/* Row 1: Address Line 1, Address Line 2, City */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="addressLine1"
                              className="text-sm text-black"
                            >
                              Address Line 1
                            </Label>
                            <Input
                              id="addressLine1"
                              placeholder="Street address, P.O. box"
                              {...register("addressLine1")}
                              className={cn(
                                "bg-white border-gray-300 focus:border-gray-400 focus-visible:border-gray-400 focus-visible:ring-0 text-black placeholder:text-gray-400",
                                errors.addressLine1
                                  ? "border-red-500"
                                  : "border-gray-300"
                              )}
                            />
                            <div className="min-h-[20px]">
                              {errors.addressLine1 && (
                                <ValidationErrorMessage
                                  message={errors.addressLine1.message || "Invalid input"}
                                />
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="addressLine2"
                              className="text-sm text-black"
                            >
                              Address Line 2
                            </Label>
                            <Input
                              id="addressLine2"
                              placeholder="Apartment, suite, unit, building"
                              {...register("addressLine2")}
                              className={cn(
                                "bg-white border-gray-300 focus:border-gray-400 focus-visible:border-gray-400 focus-visible:ring-0 text-black placeholder:text-gray-400",
                                errors.addressLine2
                                  ? "border-red-500"
                                  : "border-gray-300"
                              )}
                            />
                            <div className="min-h-[20px]">
                              {errors.addressLine2 && (
                                <ValidationErrorMessage
                                  message={errors.addressLine2.message || "Invalid input"}
                                />
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="city"
                              className="text-sm text-black"
                            >
                              City
                            </Label>
                            <Input
                              id="city"
                              placeholder="City"
                              {...register("city")}
                              className={cn(
                                "bg-white border-gray-300 focus:border-gray-400 focus-visible:border-gray-400 focus-visible:ring-0 text-black placeholder:text-gray-400",
                                errors.city
                                  ? "border-red-500"
                                  : "border-gray-300"
                              )}
                            />
                            <div className="min-h-[20px]">
                              {errors.city && (
                                <ValidationErrorMessage
                                  message={errors.city.message || "Invalid input"}
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Row 2: District, State, Pin Code */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="district"
                              className="text-sm text-black"
                            >
                              District
                            </Label>
                            <Input
                              id="district"
                              placeholder="District"
                              {...register("district")}
                              className={cn(
                                "bg-white border-gray-300 focus:border-gray-400 focus-visible:border-gray-400 focus-visible:ring-0 text-black placeholder:text-gray-400",
                                errors.district
                                  ? "border-red-500"
                                  : "border-gray-300"
                              )}
                            />
                            <div className="min-h-[20px]">
                              {errors.district && (
                                <ValidationErrorMessage
                                  message={errors.district.message || "Invalid input"}
                                />
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="state"
                              className="text-sm text-black"
                            >
                              State
                            </Label>
                            <Input
                              id="state"
                              placeholder="State"
                              {...register("state")}
                              className={cn(
                                "bg-white border-gray-300 focus:border-gray-400 focus-visible:border-gray-400 focus-visible:ring-0 text-black placeholder:text-gray-400",
                                errors.state
                                  ? "border-red-500"
                                  : "border-gray-300"
                              )}
                            />
                            <div className="min-h-[20px]">
                              {errors.state && (
                                <ValidationErrorMessage
                                  message={errors.state.message || "Invalid input"}
                                />
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="pinCode"
                              className="text-sm text-black"
                            >
                              Pin Code
                            </Label>
                            <Input
                              id="pinCode"
                              type="text"
                              placeholder="PIN Code"
                              {...register("pinCode")}
                              className={cn(
                                "bg-white border-gray-300 focus:border-gray-400 focus-visible:border-gray-400 focus-visible:ring-0 text-black placeholder:text-gray-400",
                                errors.pinCode
                                  ? "border-red-500"
                                  : "border-gray-300"
                              )}
                              maxLength={6}
                            />
                            <div className="min-h-[20px]">
                              {errors.pinCode && (
                                <ValidationErrorMessage
                                  message={errors.pinCode.message || "Invalid input"}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="date-picker"
                            className="text-black flex items-center gap-2"
                          >
                            <Clock className="w-4 h-4 text-[#E32C26]" />
                            <span className="flex items-center gap-1">
                              Choose a date for your visit
                              <Asterisk className="w-3 h-3 text-red-500" />
                              {/* <span className="text-xs text-muted-foreground">(optional)</span> */}
                            </span>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-3 h-3 text-gray-500" />
                              </TooltipTrigger>
                              <TooltipContent className="text-xs">
                                <p>
                                  Date is required for check availability of
                                  slots
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <div className="flex flex-col gap-3">
                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  id="date-picker"
                                  className="w-full h-11 justify-between font-normal text-base"
                                >
                                  {watch("preferredDate") &&
                                  watch("preferredDate").length > 0
                                    ? `${
                                        watch("preferredDate").length
                                      } date(s) selected`
                                    : "Select dates"}
                                  <ChevronDownIcon />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="start"
                              >
                                <div className="flex flex-col">
                                  <Calendar
                                    mode="multiple"
                                    selected={watch("preferredDate").map(
                                      (d: string) => new Date(d)
                                    )}
                                    captionLayout="dropdown"
                                    defaultMonth={defaultMonth}
                                    disabled={isDateDisabled}
                                    onSelect={(dates, selectedDay) => {
                                      let formattedDates: string[] = [];
                                      if (dates) {
                                        formattedDates = dates.map((d) => {
                                          const year = d.getFullYear();
                                          const month = String(
                                            d.getMonth() + 1
                                          ).padStart(2, "0");
                                          const day = String(
                                            d.getDate()
                                          ).padStart(2, "0");
                                          return `${year}-${month}-${day}`;
                                        });
                                      }

                                      setValue(
                                        "preferredDate",
                                        formattedDates,
                                        {
                                          shouldValidate: true,
                                        }
                                      );

                                      // Clean up slots for deselected dates
                                      const currentSlots =
                                        getValues("preferredTimeSlot") || {};
                                      const newSlots = { ...currentSlots };
                                      Object.keys(newSlots).forEach((key) => {
                                        if (!formattedDates.includes(key)) {
                                          delete newSlots[key];
                                        }
                                      });
                                      setValue("preferredTimeSlot", newSlots, {
                                        shouldValidate: true,
                                      });

                                      // Update viewDate logic
                                      const isSelected = dates?.some(
                                        (d) =>
                                          d.getTime() === selectedDay.getTime()
                                      );

                                      if (isSelected) {
                                        setViewDate(selectedDay);
                                      } else if (
                                        viewDate &&
                                        viewDate.getTime() ===
                                          selectedDay.getTime()
                                      ) {
                                        setViewDate(undefined);
                                      }
                                    }}
                                  />
                                  <div className="border-t border-border p-3 flex justify-end">
                                    <Button
                                      type="button"
                                      onClick={() => setOpen(false)}
                                      className="bg-gold text-black hover:bg-gold/80"
                                    >
                                      Ok
                                    </Button>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                            <input
                              type="hidden"
                              {...register("preferredDate")}
                            />
                            <div className="min-h-[20px]">
                              {errors.preferredDate && (
                                <ValidationErrorMessage
                                  message={errors.preferredDate.message || "Invalid input"}
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="time-picker"
                            className="text-black flex items-center gap-2"
                          >
                            <Clock className="w-4 h-4 text-gold" />
                            <span className="flex items-center gap-1">
                              Choose a time for your visit
                              <Asterisk className="w-3 h-3 text-red-500" />
                              {/* <span className="text-xs text-muted-foreground">(optional)</span> */}
                            </span>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-3 h-3 text-gray-500" />
                              </TooltipTrigger>
                              <TooltipContent className="text-xs">
                                <p>
                                  Time is required for check availability of
                                  slots
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <div
                            className={cn(
                              "rounded-xl border p-4 shadow-inner bg-gray-50 transition-colors",
                              watch("preferredDate").length === 0
                                ? "opacity-70 pointer-events-none"
                                : "border-gray-300 bg-white"
                            )}
                          >
                            {watch("preferredDate").length === 0 ? (
                              <div className="flex items-center justify-center h-24 text-gray-600 text-sm">
                                Please select a date to view available time
                                slots
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="flex flex-col gap-2">
                                  <span className="text-xs text-gray-600">
                                    Selected Dates (click to configure slots):
                                  </span>
                                  <div className="flex flex-wrap gap-2">
                                    {watch("preferredDate").map((dateStr: string) => {
                                      const isSelected =
                                        viewDate &&
                                        (() => {
                                          const year = viewDate.getFullYear();
                                          const month = String(
                                            viewDate.getMonth() + 1
                                          ).padStart(2, "0");
                                          const day = String(
                                            viewDate.getDate()
                                          ).padStart(2, "0");
                                          return `${year}-${month}-${day}`;
                                        })() === dateStr;

                                      // Count slots for this date
                                      const slots =
                                        watch("preferredTimeSlot")?.[dateStr];
                                      const slotCount = Array.isArray(slots)
                                        ? slots.length
                                        : slots
                                        ? 1
                                        : 0;

                                      const handleRemoveDate = (
                                        e: React.MouseEvent
                                      ) => {
                                        e.stopPropagation();
                                        const currentDates =
                                          watch("preferredDate") || [];
                                        const updatedDates =
                                          currentDates.filter(
                                            (d: string) => d !== dateStr
                                          );
                                        setValue(
                                          "preferredDate",
                                          updatedDates,
                                          {
                                            shouldValidate: true,
                                          }
                                        );

                                        // Remove time slots for this date
                                        const currentSlots =
                                          watch("preferredTimeSlot") || {};
                                        const newSlots = { ...currentSlots };
                                        delete newSlots[dateStr];
                                        setValue(
                                          "preferredTimeSlot",
                                          newSlots,
                                          {
                                            shouldValidate: true,
                                          }
                                        );

                                        // Clear viewDate if it was the removed date
                                        if (isSelected) {
                                          setViewDate(undefined);
                                        }
                                      };

                                      return (
                                        <Badge
                                          key={dateStr}
                                          variant={
                                            isSelected ? "default" : "outline"
                                          }
                                          className={cn(
                                            "cursor-pointer hover:bg-gold/20 flex items-center gap-1.5 pr-1",
                                            isSelected
                                              ? "bg-gold text-black hover:bg-gold/80"
                                              : "border-gray-300 text-black"
                                          )}
                                          onClick={() =>
                                            setViewDate(new Date(dateStr))
                                          }
                                        >
                                          <span>
                                            {formatDateString(dateStr)}
                                          </span>
                                          {slotCount > 0 && (
                                            <span className="rounded-full bg-gray-200 px-1 text-[10px] text-black">
                                              {slotCount}
                                            </span>
                                          )}
                                          <button
                                            type="button"
                                            onClick={handleRemoveDate}
                                            className={cn(
                                              "ml-0.5 rounded-full p-0.5 hover:bg-gray-200 transition-colors",
                                              isSelected
                                                ? "hover:bg-black/20"
                                                : "hover:bg-gold/20"
                                            )}
                                            aria-label={`Remove ${formatDateString(
                                              dateStr
                                            )}`}
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </Badge>
                                      );
                                    })}
                                  </div>
                                </div>

                                {viewDate ? (
                                  <div className="animate-in fade-in duration-300">
                                    <div className="flex items-center justify-between mb-3 text-[11px] sm:text-xs text-gray-600">
                                      <span>
                                        Time slots for:{" "}
                                        <span className="font-medium text-black">
                                          {formatDateDisplay(viewDate)}
                                        </span>
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                      {TIME_SLOTS.map((slot) => {
                                        const Icon = slot.icon;
                                        const dateKey = (() => {
                                          const year = viewDate.getFullYear();
                                          const month = String(
                                            viewDate.getMonth() + 1
                                          ).padStart(2, "0");
                                          const day = String(
                                            viewDate.getDate()
                                          ).padStart(2, "0");
                                          return `${year}-${month}-${day}`;
                                        })();

                                        const currentSlots =
                                          watch("preferredTimeSlot")?.[
                                            dateKey
                                          ] || [];
                                        const slotStr = `${slot.start}-${slot.end}`;
                                        const currentSlotsArray = Array.isArray(
                                          currentSlots
                                        )
                                          ? currentSlots
                                          : [currentSlots];
                                        const isChecked =
                                          currentSlotsArray.includes(slotStr);
                                        const isFullWidth =
                                          ("fullWidth" in slot &&
                                            slot.fullWidth) ||
                                          false;

                                        return (
                                          <label
                                            key={`${slot.start}-${slot.end}`}
                                            htmlFor={`time-${slot.start}-${slot.end}`}
                                            className={cn(
                                              "flex items-center gap-2 sm:gap-3 rounded-lg border bg-white p-2 sm:p-3 cursor-pointer transition-all",
                                              "hover:border-gray-400 hover:bg-gray-50",
                                              isChecked &&
                                                "border-gray-400 bg-gray-100 shadow-sm",
                                              isFullWidth && "col-span-2"
                                            )}
                                          >
                                            <Checkbox
                                              checked={isChecked}
                                              onCheckedChange={(checked) => {
                                                let newSlots = [
                                                  ...currentSlotsArray,
                                                ];
                                                if (checked) {
                                                  newSlots.push(slotStr);
                                                } else {
                                                  newSlots = newSlots.filter(
                                                    (s) => s !== slotStr
                                                  );
                                                }
                                                // Update form
                                                const currentMap =
                                                  watch("preferredTimeSlot");
                                                setValue(
                                                  "preferredTimeSlot",
                                                  {
                                                    ...currentMap,
                                                    [dateKey]: newSlots,
                                                  },
                                                  {
                                                    shouldValidate: true,
                                                  }
                                                );
                                              }}
                                              id={`time-${slot.start}-${slot.end}`}
                                              className="border-gray-300 data-[state=checked]:bg-gray-400 data-[state=checked]:text-white"
                                            />
                                            <Icon
                                              className={cn(
                                                "w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0",
                                                slot.icon === Sun
                                                  ? "text-yellow-400"
                                                  : "text-blue-400"
                                              )}
                                            />
                                            <div className="flex flex-col flex-1 min-w-0">
                                              <span className="text-xs sm:text-sm font-semibold text-black leading-tight">
                                                {slot.start.slice(0, 5)} -{" "}
                                                {slot.end.slice(0, 5)}
                                              </span>
                                              <span className="text-[10px] sm:text-xs text-gray-600 leading-tight mt-0.5">
                                                {slot.label}
                                              </span>
                                            </div>
                                          </label>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center py-8 text-gray-600 text-sm border border-dashed border-gray-300 rounded-lg">
                                    Select a date from the list above to
                                    configure its time slots
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="min-h-[20px]">
                            {errors.preferredTimeSlot && (
                              <ValidationErrorMessage
                                message={
                                  (
                                    errors.preferredTimeSlot as {
                                      message?: string;
                                    }
                                  )?.message ||
                                  "Please check your time slot selection"
                                }
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="numberOfPeople"
                          className="text-black flex items-center gap-2"
                        >
                          <Users className="w-4 h-4 text-[#E32C26]" />
                          <span className="flex items-center gap-1">
                            Number of People
                            <Asterisk className="w-3 h-3 text-red-500" />
                          </span>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-3 h-3 text-gray-500" />
                            </TooltipTrigger>
                            <TooltipContent className="text-xs">
                              <p>
                                Select the total number of people (including
                                yourself) attending the event
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <Select
                          value={numberOfPeople}
                          onValueChange={handleNumberOfPeopleChange}
                        >
                          <SelectTrigger
                            id="numberOfPeople"
                            className={cn(
                              "bg-white border-gray-300 focus:border-gray-400 focus-visible:border-gray-400 focus-visible:ring-0 text-black",
                              errors.members
                                ? "border-red-500"
                                : "border-gray-300"
                            )}
                          >
                            <SelectValue placeholder="Select number of people" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px] md:max-h-[240px]">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? "Person" : "People"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="min-h-[20px]">
                          {errors.members && (
                            <ValidationErrorMessage
                              message={errors.members.message || "Invalid input"}
                            />
                          )}
                        </div>
                      </div>

                      {parseInt(numberOfPeople, 10) > 1 && (
                        <div className="space-y-4">
                          <Label className="text-black flex items-center gap-2">
                            <User className="w-4 h-4 text-[#E32C26]" /> Additional
                            Members
                          </Label>
                          {fields.map((field: { id: string }, index: number) => (
                            <div
                              key={field.id}
                              className="p-4 border border-gray-300 rounded-lg bg-gray-50 space-y-3"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <Label className="text-sm text-black">
                                  Member {index + 1}
                                </Label>
                              </div>

                              <div className="flex flex-wrap gap-3 items-end">
                                <div className="space-y-1 flex-1 min-w-[150px]">
                                  <Label
                                    htmlFor={`members.${index}.idName`}
                                    className="text-xs flex items-center gap-1"
                                  >
                                    Full Name
                                    <Asterisk className="w-2.5 h-2.5 text-red-500" />
                                  </Label>
                                  <Input
                                    id={`members.${index}.idName`}
                                    placeholder="Full name"
                                    {...register(`members.${index}.idName`)}
                                    className={cn(
                                      "bg-white border-gray-300 focus:border-gray-400 focus-visible:border-gray-400 focus-visible:ring-0 text-black placeholder:text-gray-400 text-sm",
                                      errors.members?.[index]?.idName
                                        ? "border-red-500"
                                        : ""
                                    )}
                                  />
                                  <div className="min-h-[20px]">
                                    {errors.members?.[index]?.idName && (
                                      <ValidationErrorMessage
                                        message={
                                          errors.members?.[index]?.idName
                                            ?.message || "Invalid input"
                                        }
                                      />
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-1 flex-1 min-w-[150px]">
                                  <Label
                                    htmlFor={`members.${index}.idAge`}
                                    className="text-xs flex items-center gap-1"
                                  >
                                    Age
                                    <span className="text-[10px] text-gray-500">
                                      (optional)
                                    </span>
                                  </Label>
                                  <Input
                                    id={`members.${index}.idAge`}
                                    type="number"
                                    placeholder="Age"
                                    {...register(`members.${index}.idAge`, {
                                      valueAsNumber: true,
                                    })}
                                    className={cn(
                                      "bg-white border-gray-300 focus:border-gray-400 focus-visible:border-gray-400 focus-visible:ring-0 text-black placeholder:text-gray-400 text-sm",
                                      errors.members?.[index]?.idAge
                                        ? "border-red-500"
                                        : ""
                                    )}
                                    min={1}
                                    max={150}
                                  />
                                  <div className="min-h-[20px]">
                                    {errors.members?.[index]?.idAge && (
                                      <ValidationErrorMessage
                                        message={
                                          errors.members?.[index]?.idAge
                                            ?.message || "Invalid input"
                                        }
                                      />
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-1 flex-1 min-w-[150px]">
                                  <Label
                                    htmlFor={`members.${index}.idGender`}
                                    className="text-xs flex items-center gap-1"
                                  >
                                    Gender
                                    <Asterisk className="w-2.5 h-2.5 text-red-500" />
                                  </Label>
                                  <RadioGroup
                                    value={watch(`members.${index}.idGender`)}
                                    onValueChange={(value) =>
                                      setValue(
                                        `members.${index}.idGender`,
                                        value
                                      )
                                    }
                                    className="flex gap-2"
                                  >
                                    <div className="flex items-center space-x-1">
                                      <RadioGroupItem
                                        value="male"
                                        id={`member-${index}-male`}
                                        className="w-4 h-4"
                                      />
                                      <Label
                                        htmlFor={`member-${index}-male`}
                                        className="text-xs cursor-pointer"
                                      >
                                        Male
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <RadioGroupItem
                                        value="female"
                                        id={`member-${index}-female`}
                                        className="w-4 h-4"
                                      />
                                      <Label
                                        htmlFor={`member-${index}-female`}
                                        className="text-xs cursor-pointer"
                                      >
                                        Female
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <RadioGroupItem
                                        value="others"
                                        id={`member-${index}-others`}
                                        className="w-4 h-4"
                                      />
                                      <Label
                                        htmlFor={`member-${index}-others`}
                                        className="text-xs cursor-pointer"
                                      >
                                        Others
                                      </Label>
                                    </div>
                                  </RadioGroup>
                                  <div className="min-h-[20px]">
                                    {errors.members?.[index]?.idGender && (
                                      <ValidationErrorMessage
                                        message={
                                          (errors.members?.[index]?.idGender
                                            ?.message as string) || "Invalid input"
                                        }
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* notification for carry the aadhar card */}
                      <div className="p-4 bg-red-500 dark:bg-red-400 border border-red-500 dark:border-red-400 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <Info className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">
                              Important: Please carry your ID card with you for
                              verification.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    </TooltipProvider>
                  </ScrollArea>
                </div>

                <div className="border-t border-gray-200 px-6 py-4 flex-shrink-0 bg-white">
                                  <p className="text-xs text-gray-600 text-center mb-4">
                    No entry fees • Registration is required • Limited slots
                    available
                  </p>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 bg-[#131A72] text-white border-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                      onClick={() => {
                        reset();
                        setViewDate(undefined);
                        setNumberOfPeople("1");
                        onClose();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-red-600 text-white hover:bg-red-700 transition-colors"
                      disabled={isLoading || !isValid}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Register Now"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;
