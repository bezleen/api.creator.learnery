import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/prompts'

const getOutlineSample = {
  courseDuration: '8 weeks',
  inScope: [
    {
      topic: 'Introduction to AI',
      subtopics: [
        'Understanding AI and its principles',
        'The impact of AI on our daily lives and learning processes',
      ],
    },
    {
      topic: 'Critical Thinking in the AI Era',
      subtopics: [
        'The importance of critical thinking skills',
        'Techniques for assessing information and problems critically',
      ],
    },
    {
      topic: 'Interacting with AI Systems',
      subtopics: [
        'Basics of AI interaction',
        'Strategies for effective communication with AI systems',
      ],
    },
    {
      topic: 'Questioning Skills for AI',
      subtopics: [
        'The art of asking effective questions',
        'Techniques for extracting valuable information from AI systems',
      ],
    },
    {
      topic: 'Practical Application of AI',
      subtopics: [
        'Real-world scenarios where AI can be applied',
        'Hands-on exercises to practice using AI tools',
      ],
    },
  ],
  outOfScope: [
    'Detailed technical aspects of AI programming',
    'History and evolution of AI',
    'Ethical and societal implications of AI',
  ],
  explanation:
    'The course is designed to be comprehensive yet focused, covering all the key areas necessary for students to leverage AI for enhanced learning. The topics are sequenced logically, starting with a basic understanding of AI and progressing to more advanced skills like critical thinking, interaction, and practical application. The course duration of 8 weeks allows enough time for each topic to be explored in depth, with ample opportunities for hands-on practice. The out-of-scope topics, while important, are not directly related to the learning objectives and would require a more advanced or specialized course.',
}

const genOutlineSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    courseDuration: {
      type: 'string',
    },
    inScope: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          topic: {
            type: 'string',
          },
          subtopics: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        required: ['topic', 'subtopics'],
      },
    },
    outOfScope: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    explanation: {
      type: 'string',
    },
  },
  required: ['courseDuration', 'inScope', 'outOfScope', 'explanation'],
}

const getCourseOutlinePromptTemplate: string = `
Your a senior course outline engineer. 

You are tasked with providing a course outline when the user provides you with course details.

Clarify what topics & subtopics are "inScope", and "outOfScope".
a topic is of format "topic":string, "subtopics":array
inScope consists of an array of topic
Suggest an appropriate course duration. 
Provide the "explanation" for your choices.

You should strictly use this format: 
"""
${genOutlineSchema}
"""
Here is a sample course outline:
${getOutlineSample}

`.trim()

const InstructionGenOutline = `

The course planned so far: 
title: {title}
objectives: {objective}
audience: {audience}
courseDuration: {duration}h 


`.trim()

export const chatOutlinePrompt = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(  getCourseOutlinePromptTemplate,
  ),
  HumanMessagePromptTemplate.fromTemplate(InstructionGenOutline),
])
