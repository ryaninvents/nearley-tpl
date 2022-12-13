import { Grammar, Parser, CompiledRules } from 'nearley';
import { Token } from 'moo';
import nearleyGrammar from 'nearley/lib/nearley-language-bootstrapped';

import NullLexer from './NullLexer';

const expandedGrammarRules: CompiledRules = {
  ...nearleyGrammar,
  ParserRules: nearleyGrammar.ParserRules.map((rule) => {
    if (rule.name !== 'js') {
      return rule;
    }
    return {
      ...rule,
      symbols: [{ type: 'js', test: (node: Token) => node.type === 'js' }],
      postprocess: ([{ value }]) => value,
    };
  }),
};

export default function createTemplateParser(): Parser<
  any,
  Array<string | Function>
> {
  return new Parser(
    Grammar.fromCompiled({
      ...expandedGrammarRules,
      // We never expose this raw parser to consumers -- the only way that
      // this package is intended to be used is via the `index.ts` file, which
      // pre-tokenizes the input before handing it off to the parser.
      // Use `NullLexer` so we can correctly consume this pre-tokenized input.
      Lexer: new NullLexer(),
    })
  );
}
