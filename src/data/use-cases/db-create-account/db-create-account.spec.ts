import { CreateAccountModel } from '../../../domain/usecases/create-account'
import { AccountModel } from '../../../domain/usecases/models/account'
import { DBCreateAccount } from './db-create-account'
import { CreateAccountRepository } from './protocols/create-account-repository'
import { Encrypter } from './protocols/encrypter'

describe('DBCreateAccount Usecase', () => {
  const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
      async encrypt(value: string): Promise<string> {
        return await new Promise(resolve => resolve('hashed_value'))
      }
    }
    return new EncrypterStub()
  }

  const makeCreateAccountRepositorySub = (): CreateAccountRepository => {
    class CreateAccountRepositoryStub implements CreateAccountRepository {
      async execute(data: CreateAccountModel): Promise<AccountModel> {
        const fakeAccount = {
          id: 'valid_id',
          name: 'valid_name',
          email: 'valid_email@email.com',
          password: 'hashed_value'
        }
        return await new Promise(resolve => resolve(fakeAccount))
      }
    }
    return new CreateAccountRepositoryStub()
  }

  interface SutTypes {
    sut: DBCreateAccount
    encrypterStub: Encrypter
    createAccountRepositoryStub: CreateAccountRepository
  }

  const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
    const createAccountRepositoryStub = makeCreateAccountRepositorySub()
    return {
      sut: new DBCreateAccount(encrypterStub, createAccountRepositoryStub),
      encrypterStub,
      createAccountRepositoryStub
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

  test('should call CreateAccountRepository with correct values', async () => {
    const { sut, createAccountRepositoryStub } = makeSut()
    const spy = jest.spyOn(createAccountRepositoryStub, 'execute')
    const accountData = {
      name: 'valid name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }
    await sut.execute(accountData)
    expect(spy).toHaveBeenLastCalledWith({ ...accountData, password: 'hashed_value' })
  })

  test('should throw when createAccountRepositoryStub throw error', async () => {
    const { sut, createAccountRepositoryStub } = makeSut()
    jest.spyOn(createAccountRepositoryStub, 'execute').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }
    const promisse = sut.execute(accountData)
    await expect(promisse).rejects.toThrow()
  })

  test('should return account on success', async () => {
    const { sut } = makeSut()

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }

    const account = await sut.execute(accountData)
    expect(account).toEqual({
      ...accountData, id: 'valid_id', password: 'hashed_value'
    })
  })
})
