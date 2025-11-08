import BehavioralModel from '../models/behavioral-question-model';

export const getBehavioralCategories = async () => {
  return await BehavioralModel.getBehavioralCategories();
};

export const getBehavioralQuestionById = async (categoryId: string) => {
  return await BehavioralModel.getBehavioralQuestionById(categoryId);
};
