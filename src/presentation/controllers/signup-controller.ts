import { CreateAccount } from '../../domain/usecases/create-account'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverErrorResponse, successResponse } from '../helpers/http-helper'
import { Validator } from '../helpers/validator'
import { HttpRequest, HttpResponse, EmailValidator, Controller } from '../protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly createAccount: CreateAccount,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const requiredFields = ['name', 'email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.createAccount.execute({ name, email, password })

      return successResponse(account)
    } catch (error) {
      return serverErrorResponse(error)
    }
  }
}
