import { Lexer } from 'nearley';
import nearleyGrammar from 'nearley/lib/nearley-language-bootstrapped';

export default class NullLexer implements Lexer {
  chunk: any = null;
  index = 0;
  reset(chunk) {
    this.chunk = chunk;
    this.index = 0;
  }
  next() {
    const result = this.chunk[this.index];
    this.index++;
    return result;
  }
  save() {
    return {};
  }
  has() {
    return true;
  }
  formatError(token, message) {
    console.error(token);
    return nearleyGrammar.Lexer.formatError(token, message);
  }
}
