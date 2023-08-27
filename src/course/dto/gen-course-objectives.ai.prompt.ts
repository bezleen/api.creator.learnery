import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/prompts'

const getCourseObjectivePromptTemplate: string = `
"Let's go with "{title}"
`.trim()

const getObjectiveSample = [
  {
    objective: 'Understand the Fundamentals of AI',
    outcome:
      'Gain a solid understanding of AI, its principles, and how it impacts our daily lives and learning processes.',
  },
  {
    objective: 'Develop Critical Thinking Skills',
    outcome:
      'Learn to critically assess information and problems, enhancing decision-making skills in an AI-driven world.',
  },
  {
    objective: 'Master Interaction with AI Systems',
    outcome:
      'Acquire the ability to effectively interact with AI systems, using them as tools for learning and problem-solving.',
  },
  {
    objective: 'Formulate Effective Questions',
    outcome:
      'Improve questioning skills to extract valuable information from AI systems, fostering a deeper understanding of topics.',
  },
  {
    objective: 'Apply AI in Practical Scenarios',
    outcome:
      'Demonstrate the ability to apply AI tools in real-world scenarios, enhancing learning and problem-solving capabilities.',
  },
]

const genObjectiveSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      objective: {
        type: 'string',
      },
      outcome: {
        type: 'string',
      },
    },
    required: ['objective', 'outcome'],
  },
}

 const InstructionGenObjective = `
  Please write at least 4 concise learning objectives and outcomes that learners can expect to achieve after completing your course. 
  
  The expected format is an array of objectives:
  objective:
    objective: #Each learning objective should not exceed 160 characters or 20 to 40 words. Make sure every objective is demonstrable and measurable.
    outcome: #expected outcome
  
    Add more objectives if necessary. 

   Here is a sample expected answer for your ref: 
   ${getObjectiveSample}
   
  I am expecting you to give a json object of the following schema:
  ${genObjectiveSchema}

`.trim()



export const chatObjectivePrompt = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(getCourseObjectivePromptTemplate),
  HumanMessagePromptTemplate.fromTemplate(InstructionGenObjective),
])
