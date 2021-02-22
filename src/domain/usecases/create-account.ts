import { AccountModel } from '../models/account'

export interface CreateAccountModel {
  name: string
  email: string
  password: string
}

export interface CreateAccount {
  execute(account: CreateAccountModel): Promise<AccountModel>
}
