export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
  RESTAURANT = 'RESTAURANT',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (credentials: object) => Promise<void>;
  logout: () => void;
}
