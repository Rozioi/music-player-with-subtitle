export interface LoginRequest {
  phoneNumber: string;
}

export interface CreateUserRequest {
  phoneNumber: string;
  telegramId: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

export interface User {
  id: number;
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  photoUrl?: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN";
  createdAt: Date;
}

export interface DoctorInput {
  specialization: string;
  qualification: string;
  experience: number;
  description: string;
  education: string;
  certificates: string[];
  consultationFee: number;
  country: string;
  cardNumber?: string;
}

export interface DoctorProfile {
  id: number;
  userId: number;
  specialization: string;
  qualification: string;
  experience: number;
  description: string;
  education: string;
  certificates: string[];
  rating?: number;
  country: string;
  consultationFee: number;
  isAvailable: boolean;
  user?: User;
  category?: string;
  specialization?: string;
}

export interface TelegramInitData {
  query_id?: string;
  user?: {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  };
  auth_date?: number;
  hash?: string;
}

export interface DoctorCardData {
  id: string;
  name: string;
  country: string;
  countryFlag: string;
  rating: number;
  image: string;

  category?: string;
  specialization?: string;
}

export interface Chat {
  id: number;
  patientId: number;
  doctorId: number;
  patient?: User;
  doctor?: User & {
    doctorProfile?: {
      id: number;
    };
  };
  telegramChatId?: string;
  serviceType: "consultation" | "analysis";
  amount: number;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateChatRequest {
  doctorId: number;
  serviceType: "consultation" | "analysis";
  amount: number;
  telegramId: string;
}

export interface Balance {
  amount: number;
  userId: number;
}

export type PaymentMethod = "BALANCE" | "CARD" | "BANK_TRANSFER";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED" | "REFUNDED";

export interface Payment {
  id: number;
  userId: number;
  chatId?: number;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentRequest {
  amount: number;
  paymentMethod: PaymentMethod;
  chatId?: number;
  description?: string;
  telegramId?: string;
}

export type PDFDocumentType =
  | "ANALYSIS_RESULT"
  | "CONSULTATION_REPORT"
  | "PRESCRIPTION"
  | "MEDICAL_CERTIFICATE"
  | "OTHER";

export interface PDFDocument {
  id: number;
  filename: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  documentType: PDFDocumentType;
  userId?: number;
  chatId?: number;
  metadata?: Record<string, unknown>;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: number;
  patientId: number;
  doctorId: number;
  doctorProfileId: number;
  chatId?: number;
  rating: number;
  comment?: string;
  patient?: User;
  doctor?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewRequest {
  doctorProfileId: number;
  chatId?: number;
  rating: number;
  comment?: string;
  telegramId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
