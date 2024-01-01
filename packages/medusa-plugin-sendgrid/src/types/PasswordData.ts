type Any<T> = any; // Placeholder for "Any" type

export interface CustomerPasswordResetData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  token: string;
}

export interface UserPasswordResetData {
  email: string;
  token: string;
}
