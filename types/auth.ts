export interface SignInI {
  email: string;
  password: string;
}
export interface SignUpI {
username:string;
  email: string;
  password: string;
}
export interface SignInResI {
  token: string;
  user: any;
}

export interface ForgotPasswordI {
  email: string;
}

export interface ResetPasswordI {
  password: string;
  confirm_password: string;
}
