import {
  AIMessagePromptTemplate,
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/prompts'

const detailedOutlineSample = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    detailedOutline: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          topics: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                onScreenContent: { type: 'string' },
                description: { type: 'string' },
                detailedCoverage: { type: 'string' },
                resources: { type: 'string' },
                timingMins: { type: 'number' },
                connection: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      objective: { type: 'string' },
                      topic: {
                        type: 'array',
                        items: { type: 'string' },
                      },
                    },
                    required: ['objective', 'topic'],
                  },
                },
              },
              required: [
                'title',
                'onScreenContent',
                'description',
                'detailedCoverage',
                'resources',
                'timingMins',
                'connection',
              ],
            },
          },
        },
        required: ['section', 'topics'],
      },
    },
    summary: {
      type: 'object',
      properties: {
        totalSections: { type: 'number' },
        totalTopics: { type: 'number' },
        courseHours: { type: 'number' },
      },
      required: ['totalSections', 'totalTopics', 'courseHours'],
    },
    objectiveTopicConnections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          objective: { type: 'string' },
          topics: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: ['objective', 'topics'],
      },
    },
    rationale: { type: 'string' },
  },
  required: ['detailedOutline', 'summary', 'objectiveTopicConnections', 'rationale'],
}


const detailedOutlineSchema = {
  type: 'object',
  properties: {
    detailedOutline: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          section: { type: 'string' },
          topic: { type: 'string' },
          onScreenContent: { type: 'string' },
          topicDescription: { type: 'string' },
          detailedCoverage: { type: 'string' },
          resources: { type: 'string' },
          timingMins: { type: 'string' },
          connection: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: [
          'topic',
          'onScreenContent',
          'topicDescription',
          'detailedCoverage',
          'resources',
          'timingMins',
          'connection',
        ],
      },
    },
    summary: {
      type: 'object',
      properties: {
        totalSections: { type: 'number' },
        totalTopics: { type: 'number' },
        courseHours: { type: 'number' },
      },
      required: ['totalSections', 'totalTopics', 'courseHours'],
    },
    objectiveTopicConnections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          objective: { type: 'string' },
          topics: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: ['objective', 'topics'],
      },
    },
    rationale: { type: 'string' },
  },
  required: ['detailedOutline', 'summary', 'objectiveTopicConnections', 'rationale'],
}

const prompt1: string = ` 
Your a senior course designer. 
You are expected to create a detailed course outline based on user request, incorporating the UbD and UDL frameworks.
`.trim()

 let InstructionGenDetailedOutline = `
 
The audience for the course is {audience}
Here is the course designed so far: {course}. The course has already been designed with the rough outline. Now expand it and detail it
 
Please follow the guidelines below to structure the course outline:

1. The course outline should be structured as a series of sections, each section containing a series of topics.
2. Each section should be labeled with a name 
3. Each topic should be labeled with a name, a description, and an on-screen content type.
4. Each topic should include a detailed coverage, a resource, and a timing.
5. Each topic should include a connection to a course objective.

section template:
  section: title of the section #Ensure section titles are clear and descriptive, making it easy for learners to understand what will be covered in each section.  
  topic: mention the title of the topic here # Ensure the title is clear and descriptive, making it easy for learners to understand what will be covered in each topic. Consistently label your activities.    Each topic should Cover a single concept  
  onScreenContent:#the topic should have only one type of on-screen content, which can be one of the following: Content Slides (CS), Quiz (QZ), or Assignment (AS).
  description: #Provide a brief description of the key points being covered in each topic. Explain how learners will engage in learning and if there are any activities they will participate in during the lecture.
  detailedCoverage: #Summarize the main idea of each topic in full sentences using an affirmative format. Write the summary as a short executive summary or abstract, highlighting the key points and connections between them
  resources: #Include any downloadable tools, templates, worksheets, or links that will be shared with learners for each topic. Limit the number of resources to one per topic and tag them appropriately. Tag resources with the following code:  'PDF - cheat sheet,PDF - example,PDF - worksheet,DT - downloadable template,External links,Software/Downloads,Physical tools/materials (ie. yoga mat),Add your own (list what type of resource you will share)'
  timingMins: #length of lecture in minutes: Timing in Estimated Minutes, Estimate the duration of each topic in minutes.
  connection: #List the objective that the topic connects with. Ensure that all objectives are covered by the course.


objectiveTopicConnections: connect course objectives with the topics to demonstrate that all objectives are covered and provide as array of following template


Remember, a well-structured course should have an Introduction Section as the first section, followed by Instructional Sections that cover the course content. Each topic should cover a single concept and use an appropriate on-screen content type based on the learning modality.
 Once you have created the detailed course outline,  provide a summary


rationale: Please provide a detailed rationale for the curriculum, explaining the reasons for key choices, considering course content coverage, the audience background, age, and needs



`.trim()


const instructionTempl = HumanMessagePromptTemplate.fromTemplate(InstructionGenDetailedOutline)

// detailedOutlineSchema: ${genDetailedOutlineSchema}


export  const chatDetailedOutlinePrompt = async ()=> {
  let prompt2 =
      await instructionTempl.format({ audience: 'Any one age 10+', course: {
        title: 'AI Beginner Course' } })

  console.debug({prompt2})

  return ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(prompt1),
    HumanMessagePromptTemplate.fromTemplate(prompt2.content),
    AIMessagePromptTemplate.fromTemplate(`${detailedOutlineSample}`),
    HumanMessagePromptTemplate.fromTemplate(InstructionGenDetailedOutline),
    SystemMessagePromptTemplate.fromTemplate(`transform the output strictly to this schema. rename the keys if not matching: ${detailedOutlineSchema}`)
  ])
}
