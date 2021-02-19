import { Encrypter } from '../../data/use-cases/db-create-account/protocols/encrypter'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Encrypter {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async encrypt (value: string): Promise<string> {
    return bcrypt.hash(value, this.salt)
  }
}
