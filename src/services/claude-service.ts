import * as Claude from '../third-parties/anthropic';
import * as Prompts from '../utils/prompt';
import { ExternalServiceError } from '../utils/errors';
import {
  GenerateInterviewFeedbackPayload,
  type GenerateFollowUpQuestionPayload,
  type GenerateGreetingResponsePayload as GreetingData,
} from '../zod-schemas/interview-zod-schema';
import { GenerateInterviewFeedbackResult } from '../types/interview-type';
import { extractText } from '../utils/anthropic-response-formatter';
export const generateGreetingResponse = async (data: GreetingData) => {
  try {
    const prompt = Prompts.greeting(data);
    const model = Claude.MODEL_LIST.CLAUDE_SONNET_4_5;
    const response = await Claude.chat(prompt, model);
    const { greetingResponse } = extractText<{ greetingResponse: string }>(response);
    return greetingResponse;
  } catch (error) {
    throw new ExternalServiceError(
      `Error generating greeting response from Claude AI [${(error as Error).message}]`
    );
  }
};

export const generateFollowUpQuestion = async (data: GenerateFollowUpQuestionPayload) => {
  try {
    const prompt = Prompts.fallowUpQuestion(data);
    const model = Claude.MODEL_LIST.CLAUDE_SONNET_4_5;
    const response = await Claude.chat(prompt, model);
    const { followUpQuestion } = extractText<{ followUpQuestion: string }>(response);
    return followUpQuestion;
  } catch (error) {
    throw new ExternalServiceError(
      `Error generating follow-up question from Claude AI [${(error as Error).message}]`
    );
  }
};

export const generateInterviewFeedback = async (data: GenerateInterviewFeedbackPayload) => {
  try {
    const prompt = Prompts.feedback(data.conversation);
    const model = Claude.MODEL_LIST.CLAUDE_SONNET_4_5;
    const response = await Claude.chat(prompt, model);

    return extractText<GenerateInterviewFeedbackResult>(response);
  } catch (error) {
    throw new ExternalServiceError(
      `Error generating interview feedback from Claude AI [${(error as Error).message}]`
    );
  }
};
