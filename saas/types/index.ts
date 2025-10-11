interface Companion{
    id: string;
    name:string;
    subject:string,
    topic:string,
    duration: number;
    bookmark: boolean
}

interface CreateCompanion {
     name: string;
    subject: string;
    topic: string;
    voice: string;
    style: string;
    duration: number;
   
}
 