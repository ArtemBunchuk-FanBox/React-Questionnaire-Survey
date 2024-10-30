// app/survey-demo/page.tsx
"use client"

import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Typography, Box } from '@mui/material';
import Survey from './Survey';
import { Section } from './types';
import { loadSurveyData } from './data-loader';

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        *, *::before, *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body { height: 100%; overflow: hidden; }
      `,
    },
  },
});

export default function SurveyDemo() {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    loadSurveyData('/surveys/my-survey.json').then(setSections);
   }, []);

   const handleSubmit = async (data: Record<string, string>) => {
    try {
      const response = await fetch('/api/survey/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
   
      if (!response.ok) {
        // If API fails, download as JSON file
        const blob = new Blob([JSON.stringify(data, null, 2)], { 
          type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `survey-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return;
      }
   
      console.log('Survey submitted successfully!');
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Failed to submit survey. Downloading response as JSON file...');
    }
   };
  if (!sections.length) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h4" component="h1" align="center">
            Survey Demo
          </Typography>
        </Box>
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <Survey 
            sections={sections}
            onSubmit={handleSubmit}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

