import { textToSpeech } from '../third-parties/text-to-speech';
import { TextToSpeechPayload as TextToSpeechPayloadType } from '../zod-schemas/interview-zod-schema';

export const convertTextToSpeech = async (data: TextToSpeechPayloadType) => {
  return await textToSpeech(data);
};
