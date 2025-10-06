import JSON5 from "json5";

export function parseJson<T>(input: string): T | null {


  const indexOfJsonStart = input.indexOf('{');
  if (indexOfJsonStart !== -1) {
    input = input.slice(indexOfJsonStart);
  }

  const indexOfJsonEnd = input.indexOf('}');
  if (indexOfJsonEnd !== -1) {
    input = input.slice(0, indexOfJsonEnd + 1);
  }

  try {
    const llmJson = JSON5.parse(input.trim());
    
    return llmJson as T;
  } catch (err) {
    throw new Error(`Failed to parse JSON: ${err}, input was: ${input}`);
  }
}