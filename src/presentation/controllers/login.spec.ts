import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, successResponse, serverErrorResponse } from '../helpers/http-helper'
import { EmailValidator, HttpRequest } from '../protocols'
import { LoginController } from './login'

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@email.com',
    password: 'any_password'
  }
})

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub)
  return {
    sut, emailValidatorStub
  }
}

describe('Login Controller', () => {
  test('should return 200 with correct data', async () => {
    const { sut } = makeSut()
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(successResponse(null))
  })

  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('should return 400 if missing param', async () => {
    const { sut } = makeSut()
    const request = makeFakeHttpRequest()
    request.body.password = null
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new MissingParamError('password')))
  })

  test('should call email validator with correct value', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const request = makeFakeHttpRequest()
    const spyValidator = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(request)
    expect(spyValidator).toHaveBeenCalledWith(request.body.email)
  })

  test('should return 500 if email validator throws error', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const request = makeFakeHttpRequest()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const response = await sut.handle(request)
    expect(response).toEqual(serverErrorResponse(new Error()))
  })
})
