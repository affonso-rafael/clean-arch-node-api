import { SignUpController } from '../../presentation/controllers/signup-controller'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DBCreateAccount } from '../../data/use-cases/db-create-account/db-create-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogControllerDecorator } from '../decorators/log-controller'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { Controller } from '../../presentation/protocols'

export const makeSignupController = (): Controller => {
  const emailValidator = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(12)
  const createAccountRepository = new AccountMongoRepository()
  const dbCreateAccount = new DBCreateAccount(bcryptAdapter, createAccountRepository)
  const signUpController = new SignUpController(emailValidator, dbCreateAccount)
  return new LogControllerDecorator(signUpController, new LogMongoRepository())
}
