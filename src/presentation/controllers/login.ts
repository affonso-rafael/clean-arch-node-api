import { AuthenticationUseCase } from '../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverErrorResponse, successResponse } from '../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authenticationUseCase: AuthenticationUseCase
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = request.body
      if (!email) {
        return badRequest(new MissingParamError('email'))
      }
      if (!password) {
        return badRequest(new MissingParamError('password'))
      }
      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const auth = await this.authenticationUseCase.authenticate(email, password)

      return Promise.resolve(successResponse(auth))
    } catch (error) {
      return serverErrorResponse(error)
    }
  }
}
