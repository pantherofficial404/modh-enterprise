// Project files
import { ILoginBody, ISignupBody } from 'types';
import { LoggerService } from 'services';

class AuthService {
  public isAuthenticated() {
    return true;
  }

  public async login(payload: ILoginBody) {
    // debug.log(JSON.stringify(payload));
  }

  public async signup(payload: ISignupBody) {
    // debug.log(JSON.stringify(payload));
  }

  public getToken() {
    return '';
  }

  public async logout() {
    return true;
  }
}
export default new AuthService();
