// Types for Payment API responses

export interface CreateOrderPayload {
  amount: number;
  userId: string;
  currency: string;
  receipt: string;
  autoCapture: boolean;
  customerEmail: string;
  customerPhone: string;
  notes: Record<string, string>;
  metadata: Record<string, unknown>;
}

export interface CreateOrderResponse {
  message: string;
  order: unknown;
  record: {
    id: number;
    userId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string | null;
    status: string;
    amount: number;
    currency: string;
    receipt: string;
    notes: Record<string, unknown>;
    metadata: Record<string, unknown>;
    customerEmail: string;
    customerPhone: string;
    capturedAt: string | null;
    expiresAt: string | null;
    failureReason: string | null;
    createdAt: string;
    updatedAt: string;
  };
  razorpayKey?: string; // Optional: Razorpay key might be returned by backend
}

export interface RudrakshaBookingData {
  userId: string;
  fullName: string;
  phoneNumber: string;
  addressText: string;
  addressPlaceId?: string;
  addressLat?: number;
  addressLng?: number;
  age?: number;
  gender: string;
  participatingInEvent: boolean;
  preferredDate?: string;
  preferredTimeSlot?: Record<string, string | string[]>;
  numberOfPeople?: number;
  members?: Array<{
    idName: string;
    idAge?: number;
    idGender: string;
  }>;
  rudrakshaQuantity: number;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  userId: string;
  templeId: string;
  addressId: string;
  orderType: string;
  status: string;
  scheduledDate: string;
  scheduledTimestamp: string;
  fulfillmentType: string;
  subtotal: number;
  discountAmount: number;
  convenienceFee: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  rudrakshaBookingData?: RudrakshaBookingData;
}

export interface VerifyPaymentResponse {
  message: string;
  order: {
    id: number;
    userId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    status: string;
    amount: number;
    currency: string;
    receipt: string;
    notes: Record<string, unknown>;
    metadata: Record<string, unknown>;
    customerEmail: string;
    customerPhone: string;
    capturedAt: string | null;
    expiresAt: string | null;
    failureReason: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CreateFinalOrderPayload {
  userId: string;
  templeId: string;
  addressId: string;
  orderType: string;
  status: string;
  scheduledDate: string;
  scheduledTimestamp: string;
  fulfillmentType: string;
  subtotal: number;
  discountAmount: number;
  convenienceFee: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentId: string;
  paidAt: string;
  // trackingNumber: string;
  // carrier: string;
  // shippedAt: string | null;
  // deliveredAt: string | null;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  // cancelledAt: string | null;
  // cancellationReason: string | null;
  // refundAmount: number;
}

