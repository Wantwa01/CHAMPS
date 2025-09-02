export enum Role {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
  AMBULANCE = 'ambulance',
}

export enum PatientView {
  DASHBOARD = 'dashboard',
  BOOKING = 'booking',
  MAP = 'map',
  CHAT = 'chat',
  RECORDS = 'records',
  AMBULANCE_BOOKING = 'ambulance_booking',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Appointment {
  id: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface DoctorAppointment {
  id: string;
  patientName: string;
  time: string;
  reason: string;
  status: 'upcoming' | 'completed' | 'Confirmed' | 'Reschedule' | 'Consulted';
}

export interface AdminStats {
  totalPatients: number;
  appointmentsToday: number;
  doctorsOnDuty: number;
  availableBeds: number;
}

export interface AmbulanceRequest {
  id: string;
  location: string;
  contact: string;
  priority: 'High' | 'Medium' | 'Low';
  details: string;
  status: 'en-route' | 'on-site' | 'transporting' | 'new' | 'dispatched' | 'completed' | 'arrived';
  // Optional fields for patient-facing live tracking
  patientId?: string;
  eta?: number; // Estimated Time of Arrival in minutes
  initialEta?: number; // The starting ETA to calculate progress
}

export interface Task {
  id: string;
  patientName: string;
  idCode: string;
  age: number;
  createdDate: string;
  dueDate: string;
  status: 'Not started' | 'In progress' | 'Completed';
}

export interface BarChartData {
  label: string;
  value: number;
}
