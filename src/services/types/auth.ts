export interface TokenResponse {
  access_token: string;
  token_type?: string; // "bearer"
  expires_in?: number;
}

export interface Login{
  username: string;
  password: string;
}