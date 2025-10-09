import * as Claude from '../third-parties/anthropic';
import * as Prompts from '../utils/prompt';
import { ExternalServiceError } from '../utils/errors';
import { type GenerateGreetingResponsePayload as GreetingData } from '../zod-schemas/interview-zod-schema';
export const generateGreetingResponse = async (data: GreetingData) => {
  try {
    const prompt = Prompts.greeting(data);
    const model = Claude.MODEL_LIST.greetingResponse;
    const response = await Claude.chat(prompt, model);
    const { greetingResponse }: { greetingResponse: string } = JSON.parse(response);
    return greetingResponse;
  } catch (error) {
    throw new ExternalServiceError('Error generating greeting response from Claude AI');
  }
};
