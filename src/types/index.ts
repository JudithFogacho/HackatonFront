// Tipos para Usuario
export interface User {
  id: string;
  nickname?: string;
  worldIdNullifierHash?: string;
  walletAddress?: string;
  profilePicture?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  professionalInfo?: {
    hourlyRate: number;
    skills?: string[];
    categories?: string[];
    availability?: AvailabilityPeriod[];
    experience?: string;
    education?: string;
  };
  preferences?: {
    privacySettings?: Record<string, boolean>;
    notificationSettings?: Record<string, boolean>;
    jobCategories?: string[];
    jobTypes?: string[];
    locations?: string[];
    remoteOnly?: boolean;
  };
  statistics?: {
    linksGenerated: number;
    paymentsProcessed: number;
    rating: number;
    reviewCount: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Tipos para Trabajo
export interface Job {
  _id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  location: string;
  remote: boolean;
  type: JobType;
  category: string;
  postedAt: string;
  updatedAt?: string;
  active: boolean;
  applicationUrl?: string;
  contactEmail?: string;
}

// Tipos para UserJob (relación Usuario-Trabajo)
export interface UserJob {
  _id: string;
  userId: string;
  jobId: string | Job;
  status: UserJobStatus;
  generatedLink?: string;
  transactionId?: string | Transaction;
  createdAt: string;
  updatedAt: string;
}

// Tipos para Chat
export interface Chat {
  _id: string;
  userId: string;
  jobId?: string | Job;
  messages: ChatMessage[];
  transactionId: string | Transaction;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  _id?: string;
  role: 'USER' | 'AI';
  content: string;
  timestamp: string;
}

// Tipos para Transacción
export interface Transaction {
  _id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  reference: string;
  worldIdTransactionId?: string;
  metadata?: {
    jobId?: string;
    chatId?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Enums y tipos auxiliares
export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  FREELANCE = 'FREELANCE',
  INTERNSHIP = 'INTERNSHIP'
}

export enum UserJobStatus {
  INTERESTED = 'INTERESTED',
  DISCARDED = 'DISCARDED',
  APPLIED = 'APPLIED'
}

export enum TransactionType {
  CHAT = 'CHAT',
  JOB_LINK = 'JOB_LINK',
  DEPOSIT = 'DEPOSIT'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface AvailabilityPeriod {
  dayOfWeek: number; // 0-6, donde 0 es domingo
  startHour: number; // 0-23
  endHour: number; // 0-23
}

// Tipos para respuestas de la API
export interface ApiResponse<T> {
  status: 'success' | 'error' | 'pending';
  data?: T;
  message?: string;
  error?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Tipos para solicitudes de autenticación
export interface AuthResponse {
  token: string;
  user: User;
}

export interface WorldIDAuthResponse {
  status: string;
  token: string;
  user: {
    id: string;
    worldIdVerified: boolean;
  };
}

// Tipos para solicitudes de pago
export interface PaymentInitiationResponse {
  status: 'pending';
  message: string;
  reference: string;
  transactionId: string;
}

export interface PaymentVerificationResponse {
  status: 'success';
  message: string;
}

// Tipos para solicitudes de chat
export interface ChatCreationResponse {
  status: 'success';
  message: string;
  chatId: string;
  messages: ChatMessage[];
}

export interface ChatMessageResponse {
  status: 'success';
  messages: ChatMessage[];
}

// Tipos para solicitudes de trabajos
export interface JobsResponse {
  jobs: Job[];
  pagination: PaginationInfo;
}

export interface JobLinkResponse {
  status: 'success';
  message: string;
  link: string;
}

// Tipo para categorías
export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  count?: number;
}