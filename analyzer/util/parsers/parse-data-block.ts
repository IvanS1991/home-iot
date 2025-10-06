export function parseDataBlock<T>(input: string): T | null {
  // we are parsing new line delimited key: value pairs between !data_begin and !data_end
  const dataBegin = input.indexOf('!data_begin');
  const dataEnd = input.indexOf('!data_end');
  if (dataBegin === -1 || dataEnd === -1) {
    return null;
  }

  const dataBlock = input.slice(dataBegin + 12, dataEnd).trim();
  const lines = dataBlock.split('\n');
  const result: Record<string, unknown> = {};

  let currentKey: string | null = null;
  let currentValue: string[] = [];

  for (const line of lines) {
    const keyValueMatch = line.match(/^\s*([a-zA-Z0-9_]+):\s*(.*)$/);
    if (keyValueMatch) {
      // Save previous key-value if present
      if (currentKey) {
        result[currentKey] = currentValue.join('\n').trim();
      }
      currentKey = keyValueMatch[1];
      currentValue = [keyValueMatch[2]];
    } else if (currentKey) {
      // Continuation of previous value (multi-line)
      currentValue.push(line);
    }
  }
  // Save the last key-value pair
  if (currentKey) {
    result[currentKey] = currentValue.join('\n').trim();
  }

  return result as T;
}
