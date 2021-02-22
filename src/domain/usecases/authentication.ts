export interface AccessToken {
  token: string
}

export interface AuthenticationUseCase {
  authenticate(email: string, password: string): Promise<AccessToken>
}
