import createParser from '../index';

describe('nearley-tpl', () => {
  it('should create a working grammar', () => {
    const nth = (n: number) => (d) => d[n];
    const calc = createParser()`

main -> _ AS _ ${nth(1)}

P -> "(" _ AS _ ")" ${nth(2)}
   | N ${nth(0)}

E -> P _ "^" _ E ${(d) => Math.pow(d[0], d[4])}
   | P ${nth(0)}
   
MD -> MD _ "*" _ E ${(d) => d[0] * d[4]}
    | MD _ "/" _ E ${(d) => d[0] / d[4]}
    | E ${nth(0)}

AS -> AS _ "+" _ MD ${(d) => d[0] + d[4]}
    | AS _ "-" _ MD ${(d) => d[0] - d[4]}
    | MD ${nth(0)}

N -> float ${nth(0)}
   | "sin" _ P ${(d) => Math.sin(d[2])}
   | "cos" _ P ${(d) => Math.cos(d[2])}
   | "pi" ${() => Math.PI}

float -> int "." int ${([whole, point, frac]) => parseFloat(`${whole}.${frac}`)}
       | int ${(d) => parseInt(d[0])}
       
int -> [0-9]:+ ${(d) => d[0].join('')}

_ -> [\s]:* ${() => null}
`;
    calc.feed('5 + 8 * 3 - sin(pi / 2)');
    expect(calc.results).toEqual([28]);
  });

  it('should run CSV example', () => {
    const id = ([d]) => d;
    const appendItem = (a, b) => (d) => d[a].concat([d[b]]);
    const appendItemChar = (a, b) => (d) => d[a].concat(d[b]);
    const empty = (d) => [];
    const emptyStr = (d) => '';
    const csvParser = createParser()`
rows -> row
  | rows newline row ${appendItem(0, 2)}

row -> field
  | row "," field ${appendItem(0, 2)}

field -> unquoted_field ${id}
  | "\"" quoted_field "\"" ${(d) => d[1]}

quoted_field -> null ${emptyStr}
  | quoted_field quoted_field_char ${appendItemChar(0, 1)}

quoted_field_char -> [^"] ${id}
  | "\"" "\"" ${() => '"'}

unquoted_field -> null ${emptyStr}
  | unquoted_field char ${appendItemChar(0, 1)}

char -> [^\n\r",] ${id}

newline -> "\r" "\n" ${empty}
  | "\r" | "\n" ${empty}
    `;
    csvParser.feed(`Year,Make,Model,Description
1997,Ford,E350,"Super, luxurious truck"`);
    expect(csvParser.results).toMatchInlineSnapshot(`
      Array [
        Array [
          Array [
            "Year",
            "Make",
            "Model",
            "Description",
          ],
          Array [
            "1997",
            "Ford",
            "E350",
            "Super, luxurious truck",
          ],
        ],
      ]
    `);
  });

  it('should run the simple example from the README', () => {
    // Pretend that these are more complex.
    function add(a, b) {
      return a + b;
    }
    function subtract(a, b) {
      return a - b;
    }
    const calc = createParser()`

main -> _ term _ ${(d) => d[1]}

term -> term _ "+" _ int ${(d) => add(d[0], d[4])}
    | term _ "-" _ int ${(d) => subtract(d[0], d[4])}
    | int ${([d]) => d}

int -> [0-9]:+ ${(d) => parseInt(d[0].join(''))}

_ -> [\s]:* ${() => null}
`;
    calc.feed('5 + 8 - 2 + 6');
    expect(calc.results).toEqual([17]);
  });
});
