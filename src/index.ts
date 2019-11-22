import { Parser, Grammar } from 'nearley';
import compile from 'nearley/lib/compile';
import tokenize from './tokenize';
import createTemplateParser from './createTemplateParser';
import defaultPostprocessors from './postprocessors';

export default function createParser({
  postprocessors: inputPostprocessors = {},
} = {}) {
  const postprocessors = { ...defaultPostprocessors, ...inputPostprocessors };
  return function tag(
    interpolations: TemplateStringsArray,
    ...args: Array<string | Function>
  ) {
    const tokens = tokenize(interpolations, ...args);
    const parser = createTemplateParser();
    parser.feed(tokens);

    const targetGrammar = compile<Grammar>(parser.results[0], {});
    return new Parser(
      Grammar.fromCompiled({
        ParserRules: targetGrammar.rules.map((rule) => {
          if (!rule.postprocess || !('builtin' in rule.postprocess))
            return rule;
          return {
            ...rule,
            postprocess: postprocessors[rule.postprocess.builtin],
          };
        }),
        ParserStart: targetGrammar.start,
      })
    );
  };
}
