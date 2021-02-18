import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

describe('Email validator adapter', () => {
  jest.mock('validator', () => ({
    isEmail (): boolean {
      return true
    }
  }))

  const makeSut = (): EmailValidatorAdapter => {
    return new EmailValidatorAdapter()
  }

  test('should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('anyemail@email.com')
    expect(isValid).toBe(false)
  })

  test('should return true when validator returns true', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    const isValid = sut.isValid('anyemail@email.com')
    expect(isValid).toBe(true)
    expect(isEmailSpy).toHaveBeenCalledWith('anyemail@email.com')
  })
})
