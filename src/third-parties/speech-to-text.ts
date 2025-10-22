import { SpeechClient } from '@google-cloud/speech';
import { Socket } from 'socket.io';
import { CONFIG } from '../utils/constant-value';
import logger from '../utils/logger';
const { GOOGLE } = CONFIG;
const googleCredential = JSON.parse(GOOGLE.SERVICE_CREDENTIAL as string);

interface TranscriptionData {
  isFinal: boolean;
  text: string;
  sessionId: string;
}

interface TranscriptionError {
  message: string;
  error?: string;
}

interface TranscriptionComplete {
  message: string;
  error?: string;
}

class TranscriptionSession {
  private socket: Socket;
  private recognizeStream: any = null;
  private sessionId: string;
  private startRecording: boolean = false;
  private hasFinalTranscription: boolean = false;

  constructor(socket: Socket) {
    this.socket = socket;
    this.sessionId = socket.id;
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.socket.on('audio-stream', (audioChunk: ArrayBuffer) => this.handleAudioStream(audioChunk));
    this.socket.on('stop-transcription', () => this.cleanup());
  }

  private async handleAudioStream(audioChunk: ArrayBuffer): Promise<void> {
    try {
      this.hasFinalTranscription = false;
      if (!this.startRecording) {
        this.startRecording = true;
      }
      if (
        !this.recognizeStream ||
        this.recognizeStream.writableEnded ||
        this.recognizeStream.destroyed
      ) {
        await this.createRecognizeStream();
      }
      this.recognizeStream.write(Buffer.from(audioChunk));
    } catch (error) {
      this.handleError('Error processing audio stream', error as Error);
    }
  }

  private async createRecognizeStream(): Promise<void> {
    try {
      const speechClient = new SpeechClient({ credentials: googleCredential });
      const request = {
        config: {
          encoding: 'WEBM_OPUS' as const,
          sampleRateHertz: 48000,
          languageCode: 'en-US',
          enableAutomaticPunctuation: true,
          useEnhanced: true,
          model: 'default',
          maxAlternatives: 1,
          profanityFilter: true,
        },
        interimResults: true,
      };

      this.recognizeStream = speechClient
        .streamingRecognize(request)
        .on('error', (error: Error) => this.handleError('Speech recognition error', error))
        .on('data', (data: any) => this.emitTranscription(data));
    } catch (error) {
      logger.error(
        `Failed to create recognition stream for session ${this.sessionId}:`,
        error as Error
      );
      throw error;
    }
  }

  private emitTranscription(data: any): void {
    this.hasFinalTranscription = true;
    const result = data.results[0];
    if (result?.alternatives[0]) {
      const transcriptionData: TranscriptionData = {
        isFinal: result.isFinal,
        text: result.alternatives[0].transcript,
        sessionId: this.sessionId,
      };
      this.socket.emit('real-time-transcription', transcriptionData);
    }
  }

  public async cleanup(): Promise<void> {
    if (!this.recognizeStream) return;

    try {
      this.startRecording = false;
      this.recognizeStream.end();
      await this.waitForStreamEnd();
      this.recognizeStream.removeAllListeners();
      this.recognizeStream = null;

      const completeMessage: TranscriptionComplete = {
        message: 'Transcription complete',
      };
      this.socket.emit('transcription-complete', completeMessage);
    } catch (error) {
      logger.error(`Cleanup error in session ${this.sessionId}: ${(error as Error).message}`);

      const errorMessage: TranscriptionComplete = {
        message: 'Error during transcription cleanup',
        error: (error as Error).message,
      };
      this.socket.emit('transcription-complete', errorMessage);
    }
  }

  private waitForStreamEnd(): Promise<void> {
    return new Promise((resolve, reject) => {
      let finalTranscriptionSent = false;

      this.recognizeStream
        .on('data', (data: any) => {
          const result = data.results[0];
          if (result?.alternatives[0] && !this.hasFinalTranscription) {
            const finalTranscription: TranscriptionData = {
              isFinal: result.isFinal,
              text: result.alternatives[0].transcript,
              sessionId: this.sessionId,
            };
            this.socket.emit('final-transcription', finalTranscription);
            if (result.isFinal) finalTranscriptionSent = true;
          }
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (error: Error) => reject(error));
    });
  }

  private handleError(message: string, error: Error): void {
    logger.error(`Session ${this.sessionId}: Error: ${error.message} - Message: ${message}`);

    const errorData: TranscriptionError = { message };
    this.socket.emit('transcription-error', errorData);
    this.cleanup();
  }
}

export function createTranscriptionSession(socket: Socket): TranscriptionSession {
  return new TranscriptionSession(socket);
}
