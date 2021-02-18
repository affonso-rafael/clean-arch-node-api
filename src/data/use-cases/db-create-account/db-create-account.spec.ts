import { DBCreateAccount } from './db-create-account'
import { Encrypter } from './protocols/encrypter'

describe('DBCreateAccount Usecase', () => {
  interface SutTypes {
    sut: DBCreateAccount
    encrypterStub: Encrypter
  }

  const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
      async encrypt(value: string): Promise<string> {
        return await new Promise(resolve => resolve('hashed_value'))
      }
    }
    return new EncrypterStub()
  }

  const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    return {
      sut: new DBCreateAccount(encrypterStub),
      encrypterStub
    }
  }

  test('should call encrypter with corret password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }
    await sut.execute(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('should throw when encrypter throw error', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }
    const promisse = sut.execute(accountData)
    await expect(promisse).rejects.toThrow()
  })
})
