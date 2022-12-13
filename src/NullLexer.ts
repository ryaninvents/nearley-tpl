import { Lexer } from 'nearley';
import nearleyGrammar from 'nearley/lib/nearley-language-bootstrapped';

/**
 * A lexer about nothing.
 * 
 * This was created because we tokenize as a separate step before passing to Nearley.
 * Because it's pre-tokenized, we don't want to tokenize again, and so we need a lexer
 * that simply passes its input through to the parser.
 */
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
