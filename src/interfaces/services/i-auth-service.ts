import { LoginRequestDTO } from "../dtos/login-requset-dto"
import { AuthResponseDTO } from "../dtos/auth-response-dto"

export interface IAuthService {

  register(email: string, password: string): Promise<AuthResponseDTO>

  login(data: LoginRequestDTO): Promise<AuthResponseDTO>

}