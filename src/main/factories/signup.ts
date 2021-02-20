import { SignUpController } from '../../presentation/controllers/signup-controller'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DBCreateAccount } from '../../data/use-cases/db-create-account/db-create-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'

export const makeSignupController = (): SignUpController => {
  const emailValidator = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(12)
  const createAccountRepository = new AccountMongoRepository()
  const dbCreateAccount = new DBCreateAccount(bcryptAdapter, createAccountRepository)
  return new SignUpController(emailValidator, dbCreateAccount)
}
