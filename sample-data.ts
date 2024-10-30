// components/Survey/sample-data.ts

export type QuestionType = 'multichoice' | 'written';

export interface Answer {
  text: string;
  correct?: boolean;
  default?: boolean;
}

export interface BaseQuestion {
  id: string;
  text: string;
  type: QuestionType;
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
  wrap?: boolean;  
}

export type Question = MultiChoiceQuestion | WrittenQuestion;

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

export interface Section {
  sectionHeader: string;
  sectionText?: string;
  showDivider?: boolean;
  showQuestionSeparators?: boolean;
  questions: Question[];
  style?: SectionStyle;
}


export const sampleQuestions: { sections: Section[] } = {
    sections: [
      {
        sectionHeader: "Light Theme Example",
        sectionText: "This section shows light theme styling with purple accents. Notice the soft shadows, rounded corners, and centered layout.",
        showDivider: true,
        showQuestionSeparators: true,
        style: {
          backgroundColor: '#f8f9fa',
          highlightColor: '#6366f1',
          textColor: '#1f2937',
          fontFamily: 'Inter, system-ui, sans-serif',
          headerAlignment: 'center',
          borderRadius: 12,
          elevation: 3,
          cardGlow: 'rgba(99, 102, 241, 0.1)',
          separatorColor: '#e5e7eb',
          separatorStyle: 'solid',
          separatorWidth: 1,
          questionSpacing: 4,
          contentPadding: 4
        },
        questions: [
          {
            id: "horizontal_layout",
            type: "multichoice",
            text: "This demonstrates a horizontal layout - notice how options appear in a row. Best suited for short text options and mobile responsiveness.",
            layout: "horizontal",
            textStyle: {
              color: '#4b5563',
              fontSize: '1.125rem',
              fontWeight: '500'
            },
            answers: [
              { text: "Short Option A", correct: true },
              { text: "Selected Default", default: true },
              { text: "Another Choice" },
              { text: "Last Option" }
            ]
          },
          {
            id: "vertical_layout",
            type: "multichoice",
            text: "Vertical layout with required field validation. This example includes a deliberately long question text to demonstrate wrapping: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue. Nullam id dolor id nibh ultricies vehicula ut id elit. Donec ullamcorper nulla non metus auctor fringilla. Maecenas sed diam eget risus varius blandit sit amet non magna.",
            layout: "vertical",
            required: true,
            answers: [
              { text: "First Choice - Vertical options allow longer text" },
              { text: "Second Choice - This is selected by default", default: true },
              { text: "Third Choice - Good for detailed options" },
              { text: "Fourth Choice - Notice the spacing" }
            ]
          }
        ]
      },
      {
        sectionHeader: "Clean Theme Example",
        sectionText: "A clean, minimal design with cyan highlights. Demonstrates left alignment and dashed separators.",
        showDivider: true,
        style: {
          backgroundColor: '#ffffff',
          highlightColor: '#06b6d4',
          textColor: '#0f172a',
          fontFamily: 'system-ui',
          headerAlignment: 'left',
          borderRadius: 8,
          elevation: 2,
          separatorColor: '#cbd5e1',
          separatorStyle: 'dashed',
          separatorWidth: 2,
          questionSpacing: 3,
          contentPadding: 3
        },
        questions: [
          {
            id: "text_input",
            type: "written",
            text: "This showcases a written input field with placeholder text. The text will clear when focused. Try clicking in and out of the field to see the placeholder behavior.",
            required: true,
            default: "This is placeholder text that appears by default and clears on focus...",
            textStyle: {
              color: '#374151',
              fontSize: '1rem'
            }
          }
        ]
      },
      {
        sectionHeader: "Dark Theme Example", 
        sectionText: "Dark mode styling with purple accents. Features elevated cards with a subtle glow effect.",
        style: {
          backgroundColor: '#1f2937',
          highlightColor: '#8b5cf6',
          textColor: '#f3f4f6',
          fontFamily: 'Inter, sans-serif',
          headerAlignment: 'center',
          borderRadius: 16,
          elevation: 4,
          cardGlow: 'rgba(139, 92, 246, 0.2)',
          separatorColor: '#374151',
          separatorStyle: 'solid',
          separatorWidth: 1,
          questionSpacing: 4,
          contentPadding: 4
        },
        questions: [
          {
            id: "dark_multiple",
            type: "multichoice",
            text: "A multiple choice question in dark theme. Notice how the contrast and spacing maintain readability.",
            layout: "vertical",
            required: true,
            textStyle: {
              color: '#e5e7eb',
              fontSize: '1.125rem',
              fontWeight: '500'
            },
            answers: [
              { text: "Dark Theme - Default Selection", default: true },
              { text: "Dark Theme - Another Option" },
              { text: "Dark Theme - Third Choice" },
              { text: "Dark Theme - Final Option" }
            ]
          },
          {
            id: "dark_written",
            type: "written",
            text: "Written input styled for dark theme. Observe the contrast between placeholder text and input area.",
            default: "Dark theme placeholder - notice the styling differences...Also, let's text long question: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla magna sapien, condimentum eget ipsum quis, maximus feugiat diam. Mauris velit lacus, scelerisque eget ipsum et, lacinia sollicitudin risus. Quisque in tellus convallis, tincidunt libero ullamcorper, suscipit ante. Nam commodo ligula vitae odio molestie interdum. Donec sollicitudin, ex at gravida luctus, enim arcu ornare orci, in tristique purus quam id ipsum. Cras lobortis justo eget sem fermentum molestie. Quisque nibh enim, tempus vel ex et, tristique bibendum sem. Quisque vulputate feugiat ipsum, sed efficitur odio fermentum et. Nulla in feugiat odio, finibus mollis diam. Vivamus id tortor non diam tempus aliquam. Curabitur suscipit sed dolor ut consectetur. Integer lacinia congue leo at vestibulum. Aliquam vitae volutpat lacus. ",
            wrap: true,
            textStyle: {
              color: '#e5e7eb',
              fontSize: '1rem'
            }
          }
        ]
      }
    ]
   };
   
   export const minimalExample: { sections: Section[] } = {
    sections: [
      {
        sectionHeader: "Simple Survey Example",
        showQuestionSeparators: false,
        style: {
          backgroundColor: '#ffffff',
          highlightColor: '#3b82f6',
          headerAlignment: 'center',
          borderRadius: 8,
          elevation: 2,
          contentPadding: 3
        },
        questions: [
          {
            id: "basic_question",
            type: "multichoice",
            text: "A minimal example showing basic configuration.",
            layout: "horizontal",
            textStyle: {
              fontSize: '1.125rem',
              fontWeight: '500'
            },
            answers: [
              { text: "Option 1" },
              { text: "Option 2", default: true },
              { text: "Option 3" }
            ]
          }
        ]
      }
    ]
   };