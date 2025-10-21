import { CONFIG } from '../utils/constant-value';
import textToSpeech from '@google-cloud/text-to-speech';
const { GOOGLE } = CONFIG;
const credential: object = JSON.parse(GOOGLE.SERVICE_CREDENTIAL!);

const textToSpeechClient = new textToSpeech.TextToSpeechClient({
  credentials: credential,
});
  
export default textToSpeechClient;
