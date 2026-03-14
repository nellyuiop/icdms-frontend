// src/lib/mockData.ts
export interface Patient {
  id: string;
  name: string;
  dob: string;
  phone: string;
  email: string;
  address: string;
  lastVisit: string;
  provider: string;
  bloodType?: string;
  allergies?: string[];
}

export interface Visit {
  id: string;
  patientId: string;
  date: string;
  reason: string;
  provider: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  followUp?: string;
}

export const mockPatients: Patient[] = [
  {
    id: "P-1001",
    name: "John Smith",
    dob: "1985-06-15",
    phone: "(555) 123-4567",
    email: "john.smith@email.com",
    address: "123 Main St, Anytown, USA",
    lastVisit: "2026-02-10",
    provider: "Dr. Williams",
    bloodType: "O+",
    allergies: ["Penicillin", "Peanuts"],
  },
  {
    id: "P-1002",
    name: "Maria Garcia",
    dob: "1978-11-23",
    phone: "(555) 234-5678",
    email: "maria.garcia@email.com",
    address: "456 Oak Ave, Somewhere, USA",
    lastVisit: "2026-02-12",
    provider: "Dr. Chen",
    bloodType: "A-",
    allergies: ["Sulfa"],
  },
  {
    id: "P-1003",
    name: "Robert Johnson",
    dob: "1955-03-08",
    phone: "(555) 345-6789",
    email: "robert.j@email.com",
    address: "789 Pine Rd, Nowhere, USA",
    lastVisit: "2026-02-05",
    provider: "Dr. Williams",
    bloodType: "B+",
    allergies: [],
  },
  {
    id: "P-1004",
    name: "Sarah Lee",
    dob: "1992-09-20",
    phone: "(555) 456-7890",
    email: "sarah.lee@email.com",
    address: "321 Elm St, Anywhere, USA",
    lastVisit: "2026-02-01",
    provider: "Dr. Patel",
    bloodType: "AB+",
    allergies: ["Latex"],
  },
  {
    id: "P-1005",
    name: "James Wilson",
    dob: "1968-12-12",
    phone: "(555) 567-8901",
    email: "j.wilson@email.com",
    address: "654 Maple Dr, Someplace, USA",
    lastVisit: "2026-01-28",
    provider: "Dr. Chen",
    bloodType: "O-",
    allergies: ["Codeine"],
  },
];

export const mockVisits: Visit[] = [
  {
    id: "V-001",
    patientId: "P-1001",
    date: "2026-02-10T09:30:00",
    reason: "Annual checkup",
    provider: "Dr. Williams",
    diagnosis: "Healthy, no issues",
    prescription: "None",
    notes: "Patient in good health",
    followUp: "2027-02-10",
  },
  {
    id: "V-002",
    patientId: "P-1001",
    date: "2025-11-15T14:00:00",
    reason: "Flu symptoms",
    provider: "Dr. Williams",
    diagnosis: "Seasonal flu",
    prescription: "Tamiflu",
    notes: "Rest and fluids recommended",
    followUp: "2025-11-22",
  },
  {
    id: "V-003",
    patientId: "P-1002",
    date: "2026-02-12T11:15:00",
    reason: "Follow-up",
    provider: "Dr. Chen",
    diagnosis: "Hypertension under control",
    prescription: "Lisinopril refill",
    notes: "BP 120/80, continue current meds",
  },
  {
    id: "V-004",
    patientId: "P-1003",
    date: "2026-02-05T10:00:00",
    reason: "Joint pain",
    provider: "Dr. Williams",
    diagnosis: "Arthritis",
    prescription: "Ibuprofen 600mg",
    notes: "X-ray scheduled",
  },
];
