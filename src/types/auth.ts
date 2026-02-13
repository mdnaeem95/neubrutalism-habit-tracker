export interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: Date;
  subscription?: {
    plan: 'free' | 'premium' | 'trial';
    expiresAt?: Date;
  };
  preferences?: {
    theme?: string; // Theme ID (premium feature)
    notificationTime?: string;
    usedThemes?: string[];
  };
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthError {
  code: string;
  message: string;
}
