// components/Survey/data-loader.ts

import { Section } from './types';
import { sampleQuestions } from './sample-data';

export async function loadSurveyData(jsonPath?: string): Promise<Section[]> {
  if (!jsonPath) {
    return sampleQuestions.sections;
  }

  try {
    const response = await fetch(jsonPath);
    if (!response.ok) throw new Error('Failed to load survey data');
    const data = await response.json();
    return data.sections;
  } catch (error) {
    console.error('Error loading survey data:', error);
    return sampleQuestions.sections; // Fallback to sample data
  }
}