import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverErrorResponse, successResponse } from '../helpers/http-helper'
import { HttpRequest, HttpResponse, EmailValidator, Controller } from '../protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (!this.emailValidator.isValid(httpRequest.body.email)) {
        return badRequest(new InvalidParamError('email'))
      }

      return successResponse()
    } catch (error) {
      return serverErrorResponse()
    }
  }
}
