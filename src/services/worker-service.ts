import InterviewModel from '../models/interview-model';
import * as ClaudeService from '../services/claude-service';
import { GenerateInterviewFeedbackWorkerPayload } from '../types/worker-type';

export const createInterviewFeedback = async (data: GenerateInterviewFeedbackWorkerPayload) => {
  const { studentId, payload } = data;
  const { interviewType, duration, numberOfQuestions, conversation } = payload;

  const { scores, areasOfImprovements, feedbacks } = await ClaudeService.generateInterviewFeedback(
    data.payload
  );
  const interviewFeedback = {
    interviewType,
    duration,
    numberOfQuestions,
    scores,
    studentId,
    feedbacks: conversation.map((pair, index) => ({
      question: pair.AI,
      answer: pair.CANDIDATE,
      areaOfImprovement: areasOfImprovements[index] || 'N/A',
      answerFeedback: feedbacks[index] || 'N/A',
    })),
  };

  await InterviewModel.createInterview(interviewFeedback);
};
