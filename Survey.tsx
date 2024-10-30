// components/Survey/Survey.tsx
"use client"

import React, { useRef } from 'react';
import { Box, Button } from '@mui/material';
import MultiChoice_List, { SurveyRef } from './QuestionList';
import { Section } from './types';

interface SurveyProps {
  sections: Section[];
  onSubmit?: (data: Record<string, string>) => void;
  onAnswerSelect?: (questionId: string, answer: string) => void;
}

export default function Survey({ sections, onSubmit, onAnswerSelect }: SurveyProps) {
  const surveyRef = useRef<SurveyRef>(null);

  const handleSubmit = () => {
    if (surveyRef.current) {
      const isValid = surveyRef.current.handleSubmit();
      if (isValid) {
        const answers = surveyRef.current.getAnswers();
        onSubmit?.(answers);
      }
    }
  };

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <MultiChoice_List 
          ref={surveyRef}
          sections={sections}
          onAnswerSelect={onAnswerSelect}
        />
      </Box>
      <Box sx={{ 
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        justifyContent: 'flex-end',
      }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={handleSubmit}
        >
          Submit Survey
        </Button>
      </Box>
    </Box>
  );
}