import { User } from '../users/user.entity'; // Import your User entity or interface

declare module 'express' {
  export interface Request {
    user?: User; // or specify the correct type of your user object
  }
}
