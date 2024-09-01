export interface AdminSignUpWithEmailPassword {
  email: string
  password: string
}

export interface AdminSignInWithEmailPassword
  extends AdminSignUpWithEmailPassword {}
