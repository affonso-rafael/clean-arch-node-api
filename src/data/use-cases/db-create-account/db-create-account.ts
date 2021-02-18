import { CreateAccount, CreateAccountModel } from '../../../domain/usecases/create-account'
import { AccountModel } from '../../../domain/usecases/models/account'
import { Encrypter } from './protocols/encrypter'

export class DBCreateAccount implements CreateAccount {
  private readonly encrypter: Encrypter

  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async execute(account: CreateAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return await new Promise(resolve => resolve({ ...account, id: '' }))
  }
}
