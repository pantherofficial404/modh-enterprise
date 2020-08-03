// Libraries
import Debug from 'debug';

class Logger {
  private instance: Debug.Debugger;
  constructor(namespace: string) {
    this.instance = Debug(namespace);
  }

  log(args: string) {
    this.instance(args);
  }

  error(args: string) {
    this.instance(args);
  }
}

export default Logger;