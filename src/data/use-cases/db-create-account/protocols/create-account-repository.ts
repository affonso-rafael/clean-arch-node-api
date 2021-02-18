import { CreateAccountModel } from '../../../../domain/usecases/create-account';
import { AccountModel } from '../../../../domain/usecases/models/account'

export interface CreateAccountRepository {
  execute(accountData: CreateAccountModel): Promise<AccountModel>
}