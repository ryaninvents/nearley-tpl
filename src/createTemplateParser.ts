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
      Lexer: new NullLexer(),
    })
  );
}
