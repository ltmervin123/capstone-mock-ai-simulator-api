import TextToSpeechClient from '../configs/text-to-speech-config';
import { protos } from '@google-cloud/text-to-speech';
import { type TextToSpeechPayload as TextToSpeechPayloadType } from '../zod-schemas/interview-zod-schema';
import { BadRequestError } from '../utils/errors';

export const textToSpeech = async (args: TextToSpeechPayloadType): Promise<string> => {
  const voiceConfig = getVoiceType(args);
  const [response] = await TextToSpeechClient.synthesizeSpeech(voiceConfig);

  if (!response.audioContent) {
    return '';
  }

  const buffer = Buffer.from(response.audioContent);

  return buffer.toString('base64');
};

const getVoiceType = (
  args: TextToSpeechPayloadType
): protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest => {
  const { text, selectedVoice } = args;

  switch (selectedVoice.toLowerCase()) {
    case 'alice':
      return {
        audioConfig: {
          audioEncoding: 'LINEAR16',
          effectsProfileId: ['small-bluetooth-speaker-class-device'],
          pitch: 0,
          speakingRate: 0,
        },
        input: {
          text,
        },
        voice: {
          languageCode: 'en-US',
          name: 'en-US-Chirp3-HD-Achernar',
        },
      };

    case 'steve':
      return {
        input: { text },
        voice: { languageCode: 'en-US', ssmlGender: 'MALE' },
        audioConfig: { audioEncoding: 'MP3', pitch: 0, speakingRate: 0 },
      };

    default:
      throw new BadRequestError('Selected voice must be either Steve or Alice');
  }
};
