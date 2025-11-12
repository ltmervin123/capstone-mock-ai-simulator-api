import { InterviewConversation } from '../types/interview-type';
import {
  type GenerateFollowUpQuestionPayload,
  type GenerateGreetingResponsePayload as GreetingData,
} from '../zod-schemas/interview-zod-schema';
import type { ExpertInterviewArgs } from '../types/prompt-type';

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

export const fallowUpQuestion = (data: GenerateFollowUpQuestionPayload) => {
  return `
  You are an AI assistant conducting a ${data.interviewType} interview. You are conversing with a candidate.


  Here is the conversation so far:
  ${data.conversation.map((turn) => `AI: "${turn.AI}"\nCANDIDATE: "${turn.CANDIDATE}"`).join('\n')}

  Interview type descriptions:
  Basic: introductory questions tailored to your self-introduction and responses,
  Behavioral: questions focused on your past experiences and problem-solving approaches,
  Expert: advanced job-specific questions personalized to your resume and career goals,

  Generate a natural follow-up interview question that:
  1. Acknowledges what the candidate just said
  2. Maintains a warm, professional tone
  3. Is open-ended and encourages the candidate to elaborate
  4. Is relevant to the ${data.interviewType} interview type
  5. Is NOT a yes/no question
  6. Is NOT a multiple-choice question
  7. Is NOT a leading question
  8. Makes sense in the context of the conversation so far
  9. Is concise and to the point (no more than 30 words)
  10. Does NOT include any preamble like "Here is your next question" or "Next question"

  Return ONLY a JSON object with the key "followUpQuestion" containing your question:

  {
    "followUpQuestion": "Your follow-up question here"
  }

  Your JSON response should not include any additional text, explanations, or formatting.
  `;
};

export const feedback = (data: InterviewConversation) => {
  return `
    <context>
    You are analyzing interview responses to provide structured, objective feedback. The candidate has completed an interview, and you need to evaluate their performance.
    </context>

    <task>
    Analyze the following interview conversation and provide detailed assessment:

    ${data.map((turn, index) => `Q${index + 1}: "${turn.AI}"\nA${index + 1}: "${turn.CANDIDATE}"`).join('\n\n')}
    </task>

    <scoring_guidelines>
    For each category, assign a whole number score (no decimals) from 0-100 using these criteria:

    - Grammar (0-100): Correctness of language, sentence structure, and word usage
      * 90-100: Flawless or near-perfect grammar
      * 70-89: Minor errors that don't impact understanding
      * 50-69: Several noticeable errors
      * 0-49: Significant grammatical issues affecting clarity

    - Experience (0-100): How effectively the candidate's relevant experience is conveyed
      * 90-100: Comprehensive examples with clear relevance
      * 70-89: Good examples but could be more detailed/relevant
      * 50-69: Basic examples without sufficient detail
      * 0-49: Minimal or irrelevant experience mentioned

    - Skills (0-100): Demonstration of required skills and competencies
      * 90-100: Exceptional skill demonstration with specific examples
      * 70-89: Good skill representation but could be stronger
      * 50-69: Basic skills mentioned without strong evidence
      * 0-49: Few relevant skills demonstrated

    - Relevance (0-100): How directly the answer addresses the question
      * 90-100: Perfectly addresses all aspects of the question
      * 70-89: Addresses main points but misses minor elements
      * 50-69: Partially addresses the question
      * 0-49: Significantly off-topic or misses the question's intent

    - Filler Words: Count of filler words and verbal hesitations (e.g., "um", "uh", "like")
      * Report the exact number of filler words used across all responses
      * Common filler words to count include: "um", "uh", "like", "you know", "sort of", "kind of", "basically", "actually", "literally"
      * This should be a raw count, not a score from 0-100

    - Total Score: Calculate as weighted average of the whole number scores (Grammar: 20%, Experience: 25%, Skills: 25%, Relevance: 20%, Filler Words: 10%)
      * For Filler Words calculation: If 0 fillers, score 100; 1-2 fillers, score 80; 3-5 fillers, score 60; 6+ fillers, score 40
      * Round the final total score to the nearest whole number
    </scoring_guidelines>

    <response_requirements>
    1. For each answer (A1, A2, etc.), identify one specific area for improvement
    2. For each answer (A1, A2, etc.), provide one piece of constructive, actionable feedback
    3. Format output as a valid JSON object exactly matching this structure:
    </response_requirements>

    <output_format>
    {
      "scores": {
        "grammar": number (whole number),
        "experience": number (whole number),
        "skills": number (whole number),
        "relevance": number (whole number),
        "fillerCount": number (raw count),
        "totalScore": number (whole number)
      },
      "areasOfImprovements": [
        "string for answer 1",
        "string for answer 2"
      ],
      "feedbacks": [
        "string for answer 1",
        "string for answer 2"
      ]
    }
    </output_format>

    IMPORTANT: Your response MUST be a valid JSON object that strictly follows the output format above. Do not include any text before or after the JSON. Do not include markdown formatting, code blocks, or explanations. Ensure all JSON syntax is correct with proper use of quotes, commas, and brackets. The response should parse correctly as JSON without any modifications.
  `;
};

export const expertInterviewQuestions = (data: ExpertInterviewArgs) => {
  const questionsList = Array.from(
    { length: data.numberOfQuestionToGenerate },
    (_, i) => `"question ${i + 1}"`
  ).join(', ');

  return `
  You will be given extracted data from a resume file and a list of previously generated questions. Your task is to determine if the extracted data represents a valid resume, and if valid, generate 5 unique interview questions based on the job title and resume content.

  <resume_data>
  ${data.resumeData}
  </resume_data>

  <job_title>
  ${data.jobTitle}
  </job_title>

  <previous_questions>
  ${JSON.stringify(data.previousQuestions)}
  </previous_questions>


  First, evaluate whether the resume data is valid. A resume is considered valid if it contains at least 3 of the following elements:
  - Personal information (name, contact details)
  - Work experience or employment history
  - Education background
  - Skills section
  - Professional summary or objective
  - Certifications or achievements

  The data should be coherent and resume-like in structure. Random text, gibberish, non-resume documents, or data that appears to be from other document types should be considered invalid.

  If the resume is invalid, output only this JSON structure:
  {
    "isResumeValid": false
  }

  If the resume is valid, generate ${data.numberOfQuestionToGenerate} unique interview questions based on the specific content, experience, and skills mentioned in the resume. The questions should be:
  - Relevant to the candidate's background
  - Different from any questions in the previous_questions list
  - Professional and appropriate for an interview setting
  - Specific enough to relate to the resume content
  - Varied in type (behavioral, technical, experience-based, etc.)

  For valid resumes, output only this JSON structure:
  {
    "isResumeValid": true,
    "questions": [${questionsList}]
  }

  Important requirements:
  - Your response must be ONLY a valid JSON object
  - Do not include any explanatory text, comments, or additional content
  - Do not use markdown formatting or code blocks
  - Ensure all questions are unique and not duplicates of the previous_questions
  - Make questions specific to the resume content rather than generic interview questions
  - You MUST generate exactly ${data.numberOfQuestionToGenerate} questions, no more, no less
  `;
};
