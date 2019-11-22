import { Lexer } from 'nearley';
import nearleyGrammar from 'nearley/lib/nearley-language-bootstrapped';

const nearleyLexer = nearleyGrammar.Lexer as Lexer & {
  setState: (state: any) => void;
};

export default function tokenize(
  inputInterpolations: TemplateStringsArray | Array<string>,
  ...literals: Array<string | Function>
) {
  const result = [];
  let savedMooState = undefined;
  const interpolations =
    'raw' in inputInterpolations
      ? inputInterpolations.raw
      : inputInterpolations;

  for (let i = 0; i < Math.max(interpolations.length, literals.length); i++) {
    if (i < interpolations.length) {
      processElement(interpolations[i]);
      if (i < literals.length) {
        processElement(literals[i]);
      }
    }
  }

  return result;

  function processElement(elem) {
    if (typeof elem !== 'string') {
      result.push({
        line: savedMooState.line || 0,
        col: savedMooState.col || 0,
        type: 'js',
        value: elem,
        toString: () => elem.toString(),
      });
      return;
    }
    nearleyLexer.reset(elem, savedMooState);
    nearleyLexer.setState('main');
    let foundToken;
    while ((foundToken = nearleyLexer.next())) {
      if (false && foundToken.type === foundToken.text) {
        result.push(foundToken.text);
      } else {
        result.push(foundToken);
      }
    }
    savedMooState = nearleyLexer.save();
  }
}
