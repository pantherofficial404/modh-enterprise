// Libraries
import bcrypt from 'bcrypt';

class EncryptionService {
  private saltRounds: number;
  constructor(saltRounds?: number) {
    this.saltRounds = saltRounds ?? 10;
  }

  public encode(value: string) {
    return bcrypt.hashSync(value, this.saltRounds);
  }

  public compare(input: string, hash: string) {
    return bcrypt.compareSync(input, hash);
  }
}

export default new EncryptionService();