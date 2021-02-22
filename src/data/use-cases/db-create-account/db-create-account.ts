import { CreateAccount, CreateAccountModel } from '../../../domain/usecases/create-account'
import { AccountModel } from '../../../domain/models/account'
import { CreateAccountRepository } from './protocols/create-account-repository'
import { Encrypter } from './protocols/encrypter'

export class DBCreateAccount implements CreateAccount {
  private readonly encrypter: Encrypter
  private readonly createAccountRepository: CreateAccountRepository

  constructor (encrypter: Encrypter, createAccountRepository: CreateAccountRepository) {
    this.encrypter = encrypter
    this.createAccountRepository = createAccountRepository
  }

  async execute (data: CreateAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(data.password)
    const account = await this.createAccountRepository.execute({
      ...data,
      password: hashedPassword
    })
    return account
  }
}
