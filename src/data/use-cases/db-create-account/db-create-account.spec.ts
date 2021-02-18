import { DBCreateAccount } from './db-create-account'
import { Encrypter } from './protocols/encrypter'

describe('DBCreateAccount Usecase', () => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_value'))
    }
  }

  const encrypterStub = new EncrypterStub()
  const makeSut = (): DBCreateAccount => {
    return new DBCreateAccount(encrypterStub)
  }

  test('should call encrypter with corret password', async () => {
    const sut = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }
    await sut.execute(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })
})
