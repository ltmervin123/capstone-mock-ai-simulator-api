import BehavioralModel from '../models/behavioral-question';

export const getBehavioralCategories = async () => {
  return await BehavioralModel.getBehavioralCategories();
};

export const getBehavioralQuestionById = async (questionId: string) => {
  return await BehavioralModel.getBehavioralQuestionById(questionId);
};
