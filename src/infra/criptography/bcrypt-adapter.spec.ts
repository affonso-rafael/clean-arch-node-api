import { Encrypter } from '../../data/use-cases/db-create-account/protocols/encrypter'
import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

describe('Bcrypt Adapter', () => {
  interface SutTypes {
    sut: Encrypter
    salt: number
  }

  const makeSut = (): SutTypes => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    return {
      sut, salt
    }
  }

  test('should call bcrypt with correc values', async () => {
    const { sut, salt } = makeSut()
    const spyBcrypt = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(spyBcrypt).toHaveBeenCalledWith('any_value', salt)
  })
})
