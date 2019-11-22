# @ryaninvents/nearley-tpl

> Create grammars using template strings

This library allows you to inline [Nearley] grammar syntax in your JavaScript files, and reference JavaScript values using tagged template strings.

```js
import createParser from '@ryaninvents/nearley-tpl';

// Pretend that these functions are more complex.
// You can reference them from inside the template string.
function add(a, b) {
  return a + b;
}
function subtract(a, b) {
  return a - b;
}

// Create the parser.
const calc = createParser()`

main -> _ term _ ${(d) => d[1]}

term -> term _ "+" _ int ${(d) => add(d[0], d[4])}
    | term _ "-" _ int ${(d) => subtract(d[0], d[4])}
    | int ${([d]) => d}

int -> [0-9]:+ ${(d) => parseInt(d[0].join(''))}

_ -> [\s]:* ${() => null}
`;

// Pass a string to the parser and check the output.
calc.feed('5 + 8 - 2 + 6');
expect(calc.results).toEqual([17]);
```

## But why?

Using this library may impact your application's performance, since the grammar is compiled at runtime. However, there are a few situations where it may be useful:
- **You're prototyping an idea.** If you want to play around with a grammar idea, you can import this package instead of setting up the Nearley compiler. Then, once the basic idea is solid you can set up your tooling.
- **The grammar needs to be compiled at runtime.** There may be some situations, such as a browser-based grammar playground, where you'll need to recompile the grammar at runtime.
- **You _really_ want to typecheck your postprocessors.** This package is "just" a template tag, and it lets you author your grammar in regular TypeScript or Flow. You may decide that the benefits of type-checking outweigh the potential performance cost.
