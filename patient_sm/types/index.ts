interface CreateUserParams {
    name: String
    email: String
    phone: string
}


/* interface SearchParamsProps {
      params: {
    userId: string,
    
  }
  searchParams: string
  appointmentId: string
  admin?: string
} */
interface SearchParamsProps {
  searchParams: {
    admin?: string
    appointmentId?: string
    [key: string]: string | undefined  
  }
}


interface RegistionProps {
  params: {
    userId: string
  }
  id? : string
}


interface Gender {
   name: string;
  value: string;
}

interface Doctor {
  id:  string
  name: string
  image: string
}

interface  IdentificationType{
  id: string
  name: string
  value: string
}

interface Appointment {
  id: string
  date: string          // ISO string date
  time: string          // e.g., "12:30"
  reason: string
  status: "scheduled" | "pending" | "cancelled"
  notes?: string
  patientId: string
  doctorId: string
      // relation to patient
  doctor: Doctor        // relation to doctor
  createdAt: string
  updatedAt: string
}