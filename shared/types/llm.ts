export type LLMRequestPayload = {
  model: string;
  prompt: string;
  stream: boolean;
}

export type LLMResponsePayload = {
  response: string;
}