import { User } from './user.model'; // Import the User model

export interface Event {
  organizer: any;
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  status?: string;
  // This is the new property that fixes the error
  participants?: User[]; 
    isRegistered?: boolean; 
}