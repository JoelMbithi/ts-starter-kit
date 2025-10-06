interface CreateUserParams {
    name: String
    email: String
    phone: string
}


interface SearchParamsProps {
      params: {
    userId: string,
    
  }
  searchParams: string
  appointmentId: string
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

}