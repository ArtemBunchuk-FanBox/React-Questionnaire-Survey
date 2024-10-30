import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { 
  Paper,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
  TextField,
  Alert,
  Divider,
} from '@mui/material';

interface SectionStyle {
  backgroundColor?: string;
  highlightColor?: string;
  textColor?: string;
  fontFamily?: string;
  headerAlignment?: 'left' | 'center' | 'right';
  borderRadius?: number;
  elevation?: number;
  cardGlow?: string;
  separatorColor?: string;
  separatorStyle?: 'solid' | 'dashed' | 'dotted';
  separatorWidth?: number;
  questionSpacing?: number;
  contentPadding?: number;
}

interface Answer {
  text: string;
  correct?: boolean;
  default?: boolean;
}

interface BaseQuestion {
  id: string;
  text: string;
  type: 'multichoice' | 'written';
  required?: boolean;
  layout?: 'vertical' | 'horizontal';
  textStyle?: {
    color?: string;
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
  };
}

interface MultiChoiceQuestion extends BaseQuestion {
  type: 'multichoice';
  answers: Answer[];
}

interface WrittenQuestion extends BaseQuestion {
  type: 'written';
  default?: string;
  wrap?: boolean;  
  
}

type Question = MultiChoiceQuestion | WrittenQuestion;

interface Section {
  sectionHeader: string;
  sectionText?: string;
  questions: Question[];
  showDivider?: boolean;
  showQuestionSeparators?: boolean;
  style?: SectionStyle;
}

interface SurveyProps {
  sections: Section[];
  onAnswerSelect?: (questionId: string, answer: string) => void;
  defaultStyle?: SectionStyle;
}

export interface SurveyRef {
  handleSubmit: () => boolean;
  getAnswers: () => Record<string, string>;
}

const MultiChoice_List = forwardRef<SurveyRef, SurveyProps>(({ 
  sections,
  onAnswerSelect,
  defaultStyle = {
    backgroundColor: '#ffffff',
    highlightColor: '#1976d2',
    textColor: '#000000',
    fontFamily: 'inherit',
    headerAlignment: 'left',
    borderRadius: 8,
    elevation: 3,
    separatorColor: '#e0e0e0',
    separatorStyle: 'solid',
    separatorWidth: 1,
    questionSpacing: 2,
    contentPadding: 3,
  }
}, ref) => {
  const [defaultAnswers, setDefaultAnswers] = useState<Record<string, string>>({});
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [focusedTextFields, setFocusedTextFields] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [hasInteracted, setHasInteracted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initialDefaults: Record<string, string> = {};
    sections.forEach(section => {
      section.questions.forEach(question => {
        if (question.type === 'multichoice') {
          const defaultAnswer = question.answers.find(answer => answer.default);
          if (defaultAnswer) {
            initialDefaults[question.id] = defaultAnswer.text;
          }
        } else if (question.type === 'written' && question.default) {
          initialDefaults[question.id] = question.default;
        }
      });
    });
    setDefaultAnswers(initialDefaults);
  }, [sections]);

  useImperativeHandle(ref, () => ({
    handleSubmit: () => validateAllAnswers(),
    getAnswers: () => ({
      ...defaultAnswers,
      ...userAnswers
    })
  }));

  const mergeStyles = (sectionStyle?: SectionStyle): SectionStyle => ({
    ...defaultStyle,
    ...sectionStyle
  });

  const handleAnswerSelection = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    setHasInteracted(prev => ({
      ...prev,
      [questionId]: true
    }));
    setErrors(prev => ({ ...prev, [questionId]: false }));
    
    if (onAnswerSelect) {
      onAnswerSelect(questionId, answer);
    }
  };

  const handleTextFieldFocus = (questionId: string) => {
    setFocusedTextFields(prev => ({
      ...prev,
      [questionId]: true
    }));
  };

  const handleTextFieldBlur = (questionId: string, value: string) => {
    if (!value.trim()) {
      setFocusedTextFields(prev => ({
        ...prev,
        [questionId]: false
      }));
      setUserAnswers(prev => {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      });
    }
  };

  const validateAnswer = (question: Question) => {
    if (!question.required) return true;
    
    const userAnswer = userAnswers[question.id];
    const defaultAnswer = defaultAnswers[question.id];
    const hasInteractedWith = hasInteracted[question.id];

    if (!userAnswer && !defaultAnswer) return false;
    if (question.required && !hasInteractedWith && defaultAnswer) return false;
    if (hasInteractedWith && !userAnswer) return false;

    return true;
  };

  const validateAllAnswers = () => {
    const newErrors: Record<string, boolean> = {};
    let hasErrors = false;

    sections.forEach(section => {
      section.questions.forEach(question => {
        const isValid = validateAnswer(question);
        newErrors[question.id] = !isValid;
        if (!isValid) hasErrors = true;
      });
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const getDisplayValue = (question: Question) => {
    const userAnswer = userAnswers[question.id];
    const defaultAnswer = defaultAnswers[question.id];
    
    if (userAnswer !== undefined) return userAnswer;
    if (question.type === 'written' && !focusedTextFields[question.id]) return defaultAnswer || '';
    return '';
  };

  const renderQuestion = (question: Question, isLast: boolean, showSeparator: boolean, styles: SectionStyle) => {
    const isError = errors[question.id];
    const questionStyle = {
      color: question.textStyle?.color || styles.textColor,
      fontFamily: question.textStyle?.fontFamily || styles.fontFamily,
      fontSize: question.textStyle?.fontSize,
      fontWeight: question.textStyle?.fontWeight,
    };

    const content = question.type === 'multichoice' ? (
      <FormControl sx={{ width: '100%' }} error={isError}>
        <FormLabel 
          id={`question-${question.id}-label`} 
          required={question.required}
          sx={questionStyle}
        >
          {question.text}
        </FormLabel>
        <RadioGroup
          aria-labelledby={`question-${question.id}-label`}
          value={getDisplayValue(question)}
          onChange={(e) => handleAnswerSelection(question.id, e.target.value)}
          sx={{ 
            ml: 2, 
            mt: 1,
            ...(question.layout === 'horizontal' ? {
              flexDirection: 'row',
              gap: 2,
              flexWrap: 'wrap',
            } : {})
          }}
        >
          {question.answers.map((answer, answerIndex) => {
            const isDefault = answer.default && !userAnswers[question.id];
            return (
              <FormControlLabel
                key={`${question.id}-answer-${answerIndex}`}
                value={answer.text}
                control={
                  <Radio 
                    sx={{
                      '&.Mui-checked': {
                        color: isDefault ? 'grey.500' : styles.highlightColor,
                      },
                      '& .MuiSvgIcon-root': {
                        fill: isDefault ? 'grey.500' : undefined,
                      }
                    }}
                  />
                }
                label={answer.text}
                sx={{
                  width: question.layout === 'horizontal' ? 'auto' : '100%',
                  margin: 0,
                  backgroundColor: isDefault ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                  borderRadius: 1,
                  padding: '4px 8px',
                  marginY: '2px',
                  '& .MuiFormControlLabel-label': {
                    color: isDefault ? 'text.secondary' : questionStyle.color,
                    fontFamily: questionStyle.fontFamily,
                    fontSize: questionStyle.fontSize,
                    fontWeight: questionStyle.fontWeight,
                    flex: 1,
                  },
                  '&:hover': {
                    backgroundColor: isDefault ? 'rgba(0, 0, 0, 0.08)' : `${styles.highlightColor}14`,
                  },
                  transition: 'background-color 0.2s',
                }}
              />
            );
          })}
        </RadioGroup>
        {isError && <Alert severity="error" sx={{ mt: 1 }}>This question requires your own answer</Alert>}
      </FormControl>
    ) : (
      <FormControl sx={{ width: '100%' }} error={isError}>
      <FormLabel 
        required={question.required}
        sx={questionStyle}
      >
        {question.text}
      </FormLabel>
           <TextField
        multiline
        minRows={3}
        maxRows={15}
        value={getDisplayValue(question)}
        onChange={(e) => handleAnswerSelection(question.id, e.target.value)}
        onFocus={() => handleTextFieldFocus(question.id)}
        onBlur={(e) => handleTextFieldBlur(question.id, e.target.value)}
        inputProps={{
          style: {
            whiteSpace: question.wrap === false ? 'nowrap' : 'pre-wrap',
            overflowWrap: 'break-word'
          }
        }}
        sx={{
          mt: 1,
          width: '100%',
          '& .MuiInputBase-input': {
            color: !userAnswers[question.id] && !focusedTextFields[question.id] ? 'text.secondary' : questionStyle.color,
            fontFamily: questionStyle.fontFamily,
            fontSize: questionStyle.fontSize,
            fontWeight: questionStyle.fontWeight,
            fontStyle: !userAnswers[question.id] && !focusedTextFields[question.id] ? 'italic' : 'normal',
          },
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: styles.highlightColor,
            },
          },
        }}
        error={isError}
      />
      {isError && <Alert severity="error" sx={{ mt: 1 }}>This question requires your own answer</Alert>}
    </FormControl>
  );
    return (
      <Box key={question.id} sx={{ mt: 3 }}>
        {content}
        {showSeparator && !isLast && (
          <Divider 
            sx={{ 
              mt: 4,
              mb: 2,
              borderColor: styles.separatorColor,
              borderWidth: styles.separatorWidth,
              borderStyle: styles.separatorStyle,
            }} 
          />
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto', py: 3 }}>
      <Box sx={{ 
        maxWidth: 'md', 
        mx: 'auto', 
        px: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 4 
      }}>
        {sections.map((section, sectionIndex) => {
          const styles = mergeStyles(section.style);
          return (
            <React.Fragment key={`section-${sectionIndex}`}>
              {sectionIndex > 0 && section.showDivider && (
                <Divider 
                  sx={{ 
                    my: 2,
                    borderWidth: styles.separatorWidth,
                    borderStyle: styles.separatorStyle,
                    borderColor: styles.separatorColor,
                    width: '50%',
                    alignSelf: 'center',
                  }} 
                />
              )}
              <Paper 
                elevation={styles.elevation} 
                sx={{ 
                  p: styles.contentPadding, 
                  position: 'relative',
                  bgcolor: styles.backgroundColor,
                  borderRadius: styles.borderRadius,
                  boxShadow: styles.cardGlow ? `0 0 10px ${styles.cardGlow}` : undefined,
                }}
              >
                <Box sx={{ mb: 4, borderBottom: `1px solid ${styles.separatorColor}`, pb: 2 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: styles.textColor,
                      fontFamily: styles.fontFamily,
                      textAlign: styles.headerAlignment,
                    }}
                  >
                    {section.sectionHeader}
                  </Typography>
                  
                  {section.sectionText && (
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mt: 2,
                        color: styles.textColor,
                        fontFamily: styles.fontFamily,
                        fontStyle: 'italic',
                        opacity: 0.8,
                        textAlign: styles.headerAlignment,
                      }}
                    >
                      {section.sectionText}
                    </Typography>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: styles.questionSpacing }}>
                  {section.questions.map((question, questionIndex) => (
                    <Box key={question.id}>
                      {renderQuestion(
                        question, 
                        questionIndex === section.questions.length - 1,
                        section.showQuestionSeparators ?? false,
                        styles
                      )}
                    </Box>
                  ))}
                </Box>
              </Paper>
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
});

MultiChoice_List.displayName = 'MultiChoice_List';

export default MultiChoice_List;