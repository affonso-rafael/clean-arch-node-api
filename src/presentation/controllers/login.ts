import { AuthenticationUseCase } from '../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverErrorResponse, successResponse, unauthorized } from '../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authenticationUseCase: AuthenticationUseCase
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!request.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { email, password } = request.body
      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const auth = await this.authenticationUseCase.authenticate(email, password)

      if (!auth) {
        return unauthorized()
      }

      return successResponse(auth)
    } catch (error) {
      return serverErrorResponse(error)
    }
  }
}
