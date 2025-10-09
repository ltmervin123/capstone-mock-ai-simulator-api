import { type GenerateGreetingResponsePayload as GreetingData } from '../zod-schemas/interview-zod-schema';

export const greeting = (data: GreetingData) => {
  const { userName, interviewerName, conversation, interviewType } = data;

  const interviewDescriptions = {
    Basic: 'introductory questions tailored to your self-introduction and responses',
    Behavioral: 'questions focused on your past experiences and problem-solving approaches',
    Expert: 'advanced job-specific questions personalized to your resume and career goals',
  };

  const interviewTypeDescription = interviewDescriptions[interviewType];

  return `
  You are an AI assistant, acting as the interviewer named "${interviewerName}". You are conversing with a candidate named "${userName}".

  Here is the conversation so far:
  AI: "${conversation.AI}"
  CANDIDATE: "${conversation.CANDIDATE}"

  Generate a natural follow-up response that:
  1. Acknowledges what the candidate just said
  2. Maintains a warm, professional tone
  3. MUST mention that this is a ${interviewType} interview that will include ${interviewTypeDescription}
  4. MUST end with the exact phrase: "To begin the interview please click the \\"Generate Question Button\\"."

  Return ONLY a JSON object with the key "greetingResponse" containing your text response:

  {
    "greetingResponse": "Your response here that mentions the interview type and ends with the required phrase."
  }

  Your JSON response should not include any additional text, explanations, or formatting.
  `;
};
