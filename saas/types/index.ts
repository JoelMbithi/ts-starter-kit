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

interface GetAllCompanions {
    limit?: number,
    page?: number,
    subject?:string | string[],
    topic?:string | string[],
}
 
interface SearchParams {
  subject?: string | string[];
  topic?: string | string[];
}

interface CompanionAIProps {
    companionId: string
    subject: string
    topic: string
    name:string
    userName:string
    userImage:string
    style:string
    voice:string
}

interface SavedMessage {
  role: string;
  content: string;
  type: 'transcript' | 'final';
}
