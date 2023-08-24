import { PromptTemplate } from 'langchain'

const getDetailedOutlineSample = {
  detailedOutline: [
    {
      section: 'Introduction to AI',
      topic: 'AI Basics',
      onScreenContent: 'CS',
      topicDescription: 'Introduction to AI and its principles',
      detailedCoverage:
        "The topic covers the basic principles of AI, its types, and how it works. It provides a foundation for understanding AI's impact on learning and daily life.",
      resources: 'PDF - cheat sheet',
      timingMins: '30',
      connection: ['Understand the Fundamentals of AI'],
    },
    {
      section: '',
      topic: 'Impact of AI',
      onScreenContent: 'CS',
      topicDescription:
        'Understanding how AI impacts our daily lives and learning processes',
      detailedCoverage:
        'The topic explores the various ways AI impacts our daily lives, particularly how it enhances learning processes. It provides real-world examples to illustrate these impacts.',
      resources: 'External links',
      timingMins: '30',
      connection: ['Understand the Fundamentals of AI'],
    },
    {
      section: 'Critical Thinking in the AI Era',
      topic: 'Importance of Critical Thinking',
      onScreenContent: 'CS',
      topicDescription:
        'Discussing the importance of critical thinking skills in the AI era',
      detailedCoverage:
        'The topic emphasizes the importance of critical thinking skills in an AI-driven world. It discusses how these skills can help in making informed decisions and solving complex problems.',
      resources: 'PDF - example',
      timingMins: '30',
      connection: ['Develop Critical Thinking Skills'],
    },
    {
      section: '',
      topic: 'Critical Assessment Techniques',
      onScreenContent: 'CS',
      topicDescription:
        'Learning techniques for assessing information and problems critically',
      detailedCoverage:
        'The topic introduces various techniques for critical assessment of information and problems. It includes practical exercises to apply these techniques in AI-related scenarios.',
      resources: 'PDF - worksheet',
      timingMins: '30',
      connection: ['Develop Critical Thinking Skills'],
    },
    {
      section: 'Interacting with AI Systems',
      topic: 'Basics of AI Interaction',
      onScreenContent: 'CS',
      topicDescription: 'Understanding the basics of interacting with AI systems',
      detailedCoverage:
        'The topic covers the basics of how to interact with AI systems. It includes practical tips and guidelines for effective communication with AI.',
      resources: 'PDF - cheat sheet',
      timingMins: '30',
      connection: ['Master Interaction with AI Systems'],
    },
    {
      section: '',
      topic: 'Effective AI Interaction Strategies',
      onScreenContent: 'CS',
      topicDescription: 'Learning strategies for effective communication with AI systems',
      detailedCoverage:
        'The topic introduces various strategies for effective interaction with AI systems. It includes hands-on exercises to practice these strategies.',
      resources: 'PDF - worksheet',
      timingMins: '30',
      connection: ['Master Interaction with AI Systems'],
    },
    {
      section: 'Questioning Skills for AI',
      topic: 'Art of Asking Questions',
      onScreenContent: 'CS',
      topicDescription:
        'Understanding the art of asking effective questions to AI systems',
      detailedCoverage:
        'The topic discusses the importance of asking effective questions in AI interactions. It introduces techniques for formulating questions that extract valuable information from AI systems.',
      resources: 'PDF - cheat sheet',
      timingMins: '30',
      connection: ['Formulate Effective Questions'],
    },
    {
      section: '',
      topic: 'Questioning Techniques',
      onScreenContent: 'CS',
      topicDescription:
        'Learning techniques for extracting valuable information from AI systems',
      detailedCoverage:
        'The topic introduces various techniques for asking questions to AI systems. It includes practical exercises to apply these techniques in real-world scenarios.',
      resources: 'PDF - worksheet',
      timingMins: '30',
      connection: ['Formulate Effective Questions'],
    },
    {
      section: 'Practical Application of AI',
      topic: 'Real-world AI Applications',
      onScreenContent: 'CS',
      topicDescription: 'Exploring real-world scenarios where AI can be applied',
      detailedCoverage:
        'The topic explores various real-world scenarios where AI can be applied. It includes examples from different fields to illustrate the practical applications of AI.',
      resources: 'External links',
      timingMins: '30',
      connection: ['Apply AI in Practical Scenarios'],
    },
    {
      section: '',
      topic: 'Hands-on AI Exercises',
      onScreenContent: 'AS',
      topicDescription: 'Practicing using AI tools through hands-on exercises',
      detailedCoverage:
        'The topic provides hands-on exercises that allow students to practice using AI tools. It includes a variety of scenarios to cover different aspects of AI application.',
      resources: 'Software/Downloads',
      timingMins: '30',
      connection: ['Apply AI in Practical Scenarios'],
    },
  ],
  summary: {
    totalSections: 5,
    totalTopics: 10,
    courseHours: 5,
  },
  objectiveTopicConnections: [
    {
      objective: 'Understand the Fundamentals of AI',
      topics: ['AI Basics', 'Impact of AI'],
    },
    {
      objective: 'Develop Critical Thinking Skills',
      topics: ['Importance of Critical Thinking', 'Critical Assessment Techniques'],
    },
    {
      objective: 'Master Interaction with AI Systems',
      topics: ['Basics of AI Interaction', 'Effective AI Interaction Strategies'],
    },
    {
      objective: 'Formulate Effective Questions',
      topics: ['Art of Asking Questions', 'Questioning Techniques'],
    },
    {
      objective: 'Apply AI in Practical Scenarios',
      topics: ['Real-world AI Applications', 'Hands-on AI Exercises'],
    },
  ],
  rationale:
    `The curriculum is designed to be comprehensive and engaging, with a focus on practical application. Each section corresponds to a specific learning objective, ensuring that all objectives are covered. The topics within each section are sequenced logically, starting with foundational knowledge and progressing to more advanced skills. The use of different on-screen content types caters to different learning styles, while the inclusion of hands-on exercises and practical examples enhances understanding and retention. The course duration and timing of each topic are designed to be manageable for the target age group, while still providing in-depth coverage of each topic. The resources provided further support learning and allow for self-study outside of the course.`.trim(),
}

const genDetailedOutlineSchema = {
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

const getCourseDetailedOutlinePromptTemplate: string = ` 
Your a senior course designer. 

The audience for the course is {audience}
Here is the course designed so far: {course}

Your task as a senior course designer is to create a detailed course outline based on user requests. The audience for the course will be specified by the user. 

Strictly adhere to the output format: ${getDetailedOutlineSample}
`.trim()

export const InstructionGenDetailedOutline = `
Create a detailed course outline for the course described above, incorporating the UbD and UDL frameworks. The course should be designed to be flexible, allowing for online or hybrid formats with in-person and online sessions. The class size is expected to be around 16 to 30 students.

Please follow the guidelines below to structure the course outline:

1. The course outline should be structured as a series of sections, each section containing a series of topics.
2. Each section should be labeled with a name 
3. Each topic should be labeled with a name, a description, and an on-screen content type.
4. Each topic should include a detailed coverage, a resource, and a timing.
5. Each topic should include a connection to a course objective.


section template:
  section: title of the section #Ensure section titles are clear and descriptive, making it easy for learners to understand what will be covered in each section.  
  topic: title of the topic # Ensure topic title is clear and descriptive, making it easy for learners to understand what will be covered in each topic. Consistently label your activities.    Each topic should Cover a single concept  
  onScreenContent:#the topic should have only one type of on-screen content, which can be one of the following: Content Slides (CS), Quiz (QZ), or Assignment (AS).
  topicDescription: #Provide a brief description of the key points being covered in each topic. Explain how learners will engage in learning and if there are any activities they will participate in during the lecture.
  detailedCoverage: #Summarize the main idea of each topic in full sentences using an affirmative format. Write the summary as a short executive summary or abstract, highlighting the key points and connections between them
  resources: #Include any downloadable tools, templates, worksheets, or links that will be shared with learners for each topic. Limit the number of resources to one per topic and tag them appropriately. Tag resources with the following code:  'PDF - cheat sheet,PDF - example,PDF - worksheet,DT - downloadable template,External links,Software/Downloads,Physical tools/materials (ie. yoga mat),Add your own (list what type of resource you will share)'
  timingMins: #length of lecture in minutes: Timing in Estimated Minutes, Estimate the duration of each topic in minutes.
  connection: #List the objective that the topic connects with. Ensure that all objectives are covered by the course.


Remember, a well-structured course should have an Introduction Section as the first section, followed by Instructional Sections that cover the course content. Each topic should cover a single concept and use an appropriate on-screen content type based on the learning modality.
 Once you have created the detailed course outline,  provide a summary
 summary template:
  totalSections: #total number of sections
  totalTopics: #total number of topics
  courseHours: #estimated course hours
  
 
objectiveTopicConnections: connect course objectives with the topics to demonstrate that all objectives are covered.
template:
  objective: #objective: Ensure that all objectives are covered by the course.
  topics: list the topic titles/names associated with the objective in an array


rationale: Please provide a detailed rationale for the curriculum, explaining the reasons for key choices, considering course content coverage, the audience background, age, and needs

Please use the provided genDetailedOutlineSample for your reference. 
detailedOutlineSample: ${getDetailedOutlineSample}


`.trim()

// detailedOutlineSchema: ${genDetailedOutlineSchema}

export const GenDetailedOutlinePrompt = PromptTemplate.fromTemplate(
  getCourseDetailedOutlinePromptTemplate,
)
