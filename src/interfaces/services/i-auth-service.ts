import { LoginRequestDTO } from "../dtos/login-requset-dto"
import { AuthResponseDTO } from "../dtos/auth-response-dto"

export interface IAuthService {

  register(firstName: string, lastName: string,email: string, password: string): Promise<void>

  login(data: LoginRequestDTO): Promise<AuthResponseDTO>

}