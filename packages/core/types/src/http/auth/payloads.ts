export interface AdminSignUpWithEmailPassword {
  email: string
  password: string
}

export interface AdminSignInWithEmailPassword extends AdminSignUpWithEmailPassword {}

export interface AdminUpdateProvider {
  [key: string]: unknown // Allow for any additional fields, this will vary depending on the provider
}
