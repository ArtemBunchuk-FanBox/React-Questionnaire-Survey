# React Survey Component

A comprehensive survey builder that renders multi-section forms with support for multiple choice and written questions. Each section can be styled independently and groups related questions together. The component handles validation, default answers, and ensures data is collected even if submission fails, by downlaoding locally (debug feature).

## Core Functionality

The survey loads its configuration either from a custom JSON file or falls back to provided sample data. Place your configuration in /public/surveys/my-survey.json for external loading, or directly in the components folder. Without a custom configuration, the survey uses the structure defined in sample-data.ts.

QuestionList.tsx serves as the main renderer, handling everything from displaying questions to collecting answers. It supports material design styling, custom fonts, and flexible layouts. Previously named QuestionList.tsx, it maintains the same functionality while improving code organization.

Survey.tsx wraps the question list and manages submission. When users complete the survey, it first attempts to submit to your API endpoint. If submission fails, it automatically downloads the responses as a JSON file, ensuring no data is lost.

The data loader prioritizes custom configurations while providing a seamless fallback to sample data, making it easy to create surveys without starting from scratch.

## File Organization

Keep your survey files organized in /components/Survey/. The essential components - QuestionList.tsx, Survey.tsx, and supporting files like types.ts and data-loader.ts - handle the core functionality. Your custom survey configuration belongs in /public/surveys/my-survey.json for easy updates without rebuilding.



## Implementation

```
/components/Survey/
  QuestionList.tsx    # Main renderer - displays questions, collects answers
  Survey.tsx         # Handles submission and layout
  types.ts          # Type definitions
  data-loader.ts    # Configuration loader
  sample-data.ts    # Default survey structure

/public/surveys/
  my-survey.json    # Your custom configuration
```

## Usage

```typescript
import Survey from '@/components/Survey/Survey';
import { loadSurveyData } from '@/components/Survey/data-loader';

const sections = await loadSurveyData();  // Loads JSON or defaults to sample

<Survey 
  sections={sections}
  onSubmit={handleSubmit}
/>
```


# Survey Component Configuration Guide

## Basic Structure
```typescript
{
  sections: [
    {
      sectionHeader: string,
      sectionText?: string,
      showDivider?: boolean,      // Default: false
      showQuestionSeparators?: boolean,  // Default: false
      style?: SectionStyle,
      questions: Question[]
    }
  ]
}
```

## Section Styling (SectionStyle)
All style properties are optional with these defaults:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| backgroundColor | string | '#ffffff' | Background color of the section |
| highlightColor | string | '#1976d2' | Color for interactive elements (radio buttons, focus states) |
| textColor | string | '#000000' | Default text color for the section |
| fontFamily | string | 'inherit' | Font family for section content |
| headerAlignment | 'left' \| 'center' \| 'right' | 'left' | Text alignment for section header and text |
| borderRadius | number | 8 | Border radius of the section card (px) |
| elevation | number | 3 | Material UI elevation shadow level |
| cardGlow | string | undefined | Optional box-shadow glow effect (e.g., '0 0 10px rgba(0,0,0,0.1)') |
| separatorColor | string | '#e0e0e0' | Color for dividers and separators |
| separatorStyle | 'solid' \| 'dashed' \| 'dotted' | 'solid' | Style of dividers |
| separatorWidth | number | 1 | Width of dividers (px) |
| questionSpacing | number | 2 | Spacing between questions (multiplied by theme spacing) |
| contentPadding | number | 3 | Internal padding of the section (multiplied by theme spacing) |

## Questions
### Common Question Properties
| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| id | string | Yes | - | Unique identifier for the question |
| text | string | Yes | - | Question text |
| type | 'multichoice' \| 'written' | Yes | - | Question type |
| required | boolean | No | false | If false and question has a default answer/placeholder, that value will be submitted |
| layout | 'vertical' \| 'horizontal' | No | 'vertical' | Layout for multiple choice answers |
| textStyle | TextStyle | No | {} | Custom styling for question text |

### Answer Properties
| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| text | string | Yes | - | The answer text to display |
| correct | boolean | No | false | Marks this as the correct answer (for scoring) |
| default | boolean | No | false | Pre-selects this answer. Only one answer should have default=true |
| wrap | boolean | No | true | Controls text wrapping. If true, wraps text to next line (up to 10 lines). If false, text scrolls horizontally. |

### TextStyle Properties
```typescript
{
  color?: string,      // Text color (inherits from section if not set)
  fontSize?: string,   // Font size (e.g., '1rem', '16px')
  fontFamily?: string, // Font family (inherits from section if not set)
  fontWeight?: string  // Font weight (e.g., '400', 'bold')
}
```

### Multiple Choice Questions
```typescript
{
  type: 'multichoice',
  answers: [
    {
      text: string,     // Answer text to display
      correct?: boolean, // Marks correct answer (for scoring)
      default?: boolean // Pre-selected option. If required=false, this will be submitted
    }
  ]
}
```

### Written Questions
```typescript
{
  type: 'written',
  default?: string // Placeholder text. If required=false, this will be submitted
}
```

## Usage Example
```typescript
const survey = {
  sections: [{
    sectionHeader: "Feedback",
    sectionText: "Please share your thoughts",
    showDivider: true,
    style: {
      backgroundColor: '#f8f9fa',
      highlightColor: '#6366f1',
      headerAlignment: 'center'
    },
    questions: [{
      id: "q1",
      type: "multichoice",
      text: "Rate our service:",
      layout: "horizontal",
      required: true, // User must select an answer, default won't be submitted
      textStyle: {
        fontSize: '1.125rem',
        fontWeight: '500'
      },
      answers: [
        { text: "Excellent", correct: true }, // Marked as correct answer
        { text: "Good", default: true },      // Pre-selected option
        { text: "Fair" },
        { text: "Poor" }
      ]
    }]
  }]
}
```
