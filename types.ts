// components/Survey/types.ts

export interface SectionStyle {
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
  
  export interface Answer {
    text: string;
    correct?: boolean;
    default?: boolean;
  }
  
  export interface BaseQuestion {
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
  
  export interface MultiChoiceQuestion extends BaseQuestion {
    type: 'multichoice';
    answers: Answer[];
  }
  
  export interface WrittenQuestion extends BaseQuestion {
    type: 'written';
    default?: string;
  }
  
  export type Question = MultiChoiceQuestion | WrittenQuestion;
  
  export interface Section {
    sectionHeader: string;
    sectionText?: string;
    questions: Question[];
    showDivider?: boolean;
    showQuestionSeparators?: boolean;
    style?: SectionStyle;
  }