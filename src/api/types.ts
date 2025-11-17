export type Role = "PATIENT" | "DOCTOR" | "ADMIN";

export interface User {
  id?: number;
  telegramId: string;
  username?: string;
  firstName?: string;
  phoneNumber?: string;
  lastName?: string;
  photoUrl?: string;
  role: Role;
  createdAt: Date;
}

export interface DoctorInput {
  userId?: number;
  specialization: string;
  qualification: string;
  experience: number;
  description: string;
  education: string;
  certificates: string[];
  consultationFee: number;
  country: string;
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
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface TelegramInitData {
  query_id?: string;
  user?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    photo_url?: string;
  };
  auth_date: number;
  hash: string;
}

export interface CreateUserRequest {
  telegramData: TelegramInitData;
  role: Role;
  phoneNumber?: string;
}

export interface CreateDoctorRequest extends DoctorInput {
  telegramData: TelegramInitData;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface TelegramData {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
}

export interface LoginRequest {
  telegramData: TelegramData;
  phoneNumber: string;
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
  doctor?: User;
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
