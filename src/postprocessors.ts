import { BuiltinPostprocessorName, PostprocessorFunction } from 'nearley';

export default {
  joiner: (d) => d.join(''),
  arrconcat: ([a, b]) => [a, ...b],
  arrpush: ([a, b]) => [...a, b],
  nuller: () => null,
  id: (x) => x,
} as { [key in BuiltinPostprocessorName]: PostprocessorFunction };
