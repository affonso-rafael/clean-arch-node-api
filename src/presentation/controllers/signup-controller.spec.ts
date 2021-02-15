import { CreateAccount, CreateAccountModel } from '../../domain/usecases/create-account'
import { AccountModel } from '../../domain/usecases/models/account'
import { InvalidParamError, MissingParamError, ServerError } from '../errors'
import { EmailValidator } from '../protocols/email-validator'
import { SignUpController } from './signup-controller'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeCreateAccount = (): CreateAccount => {
  class CreateAccountStub implements CreateAccount {
    async execute(data: CreateAccountModel): Promise<AccountModel> {
      const account = {
        id: 'anyId',
        name: 'anyName',
        email: 'anyEmail',
        password: 'anyPassword'
      }
      return new Promise(resolve => resolve(account))
    }
  }
  return new CreateAccountStub()
}
interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  createAccountStub: CreateAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const createAccountStub = makeCreateAccount()
  const sut = new SignUpController(emailValidatorStub, createAccountStub)

  return {
    sut,
    emailValidatorStub,
    createAccountStub
  }
}

describe('SignUp Controller', () => {
  test('should return 400 if has missing param', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'anyemail@email.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('should return 200 if request is ok', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'anyemail@email.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
  })

  test('should return 400 with invalid email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'anyemail@email.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('should return 500 if emailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'anyemail@email.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 200 with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'anyemail@email.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('should call service with correct data', async () => {
    const { sut, createAccountStub } = makeSut()
    const serviceSpy = jest.spyOn(createAccountStub, 'execute')
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'anyemail@email.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }

    await sut.handle(httpRequest)
    expect(serviceSpy).toHaveBeenCalledWith({
      name: 'any name',
      email: 'anyemail@email.com',
      password: 'password'
    })
  })
})
