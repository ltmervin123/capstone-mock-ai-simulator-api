import * as Claude from '../third-parties/anthropic';
import * as Prompts from '../utils/prompt';
import { ExternalServiceError } from '../utils/errors';
import {
  GenerateInterviewFeedbackPayload,
  type GenerateFollowUpQuestionPayload,
  type GenerateGreetingResponsePayload as GreetingData,
} from '../zod-schemas/interview-zod-schema';
import { GenerateInterviewFeedbackResult } from '../types/interview-type';
export const generateGreetingResponse = async (data: GreetingData) => {
  try {
    const prompt = Prompts.greeting(data);
    const model = Claude.MODEL_LIST.greetingResponse;
    const response = await Claude.chat(prompt, model);
    const { greetingResponse }: { greetingResponse: string } = JSON.parse(response);
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
    const model = Claude.MODEL_LIST.questionGeneration;
    const response = await Claude.chat(prompt, model);
    const { followUpQuestion }: { followUpQuestion: string } = JSON.parse(response);
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
    const model = Claude.MODEL_LIST.feedbackGeneration;
    const response = await Claude.chat(prompt, model);
    return JSON.parse(response) as GenerateInterviewFeedbackResult;
  } catch (error) {
    throw new ExternalServiceError(
      `Error generating interview feedback from Claude AI [${(error as Error).message}]`
    );
  }
};
