import { PromptTemplate } from 'langchain'

const GenTitleSample = [
  {
    title: 'AI Savvy: Mastering Learning Skills for the Future',
    reason:
      "This title emphasizes the importance of being savvy with AI and how mastering certain learning skills can prepare students for the future. It's catchy, concise, and directly addresses the students' need to focus on future skills.",
  },
  {
    title: 'Question, Critique, Interact: Thriving in the AI Era',
    reason:
      "This title highlights the three key skills the course aims to develop: asking questions, critical thinking, and interacting with AI. It's engaging and suggests an active learning approach, appealing to Gen Z's preference for experiential learning.",
  },
  {
    title: 'AI and You: Navigating the Learning Landscape of Tomorrow',
    reason:
      'This title suggests a journey of exploration and discovery, appealing to the curiosity of young learners. It also emphasizes the personal relevance of the course content, making it more engaging.',
  },
  {
    title: 'TikTok to Tech Talk: Leveraging AI for Enhanced Learning',
    reason:
      'This title cleverly uses the popular social media platform TikTok to catch the attention of Gen Z learners. It suggests a transition from casual social media use to more purposeful engagement with technology, specifically AI.',
  },
  {
    title: 'Decoding AI: Unleashing Your Learning Superpowers',
    reason:
      "This title is catchy and empowering, suggesting that understanding AI can unlock significant learning potential. It appeals to the students' desire for in-depth knowledge and positions AI as a tool they can master.",
  },
]
const audienceAdditionalInfo = `
Other notes on audience's background for consideration if they make sense: They are gen Z and likes to spend a lot of time on tiktok and other social media. 
`

const getTitlePromptTemplate = `
  
  "Act as an instructional designer who has deep expertise in the field of {category} who wish to share your knowledge to the world.

You are creating A {content} on the following content:
{title}
{description}

Your students are around {ageStart}-{ageEnd} years old.
Your audience's needs and interests: {audienceDescription}
They are {level} learners who are quite familiar with the topic already and so will look for something more in depth.

${audienceAdditionalInfo}

Please write in {language}
Follow a {tone} tone and language style.

The course is recommended to be within {duration} hours. 
The lesson is recommended to be within {durationLesson} hours. 

The course can be flexibly carried out in {modality} format with in-person and online sessions.
The class size is around {classSize} students.

"

`.trim()
// i am going with f-strings over jinja-2

export const InstructionGenTitle = `
 Create a list of 5 course titles, each with a brief reasons (no more than 30 to 50 words) on why each title is a suitable one for this course. Make sure the titles are concise, engaging, and catchy. 
 Here is a sample expected answer for your ref:  I am expecting you to give a json object of the following format
 """
 ${GenTitleSample}
 """
`.trim()
// FIXME: can be included in systemmessage
export const GenTitlePrompt = PromptTemplate.fromTemplate(getTitlePromptTemplate)

// FIXME: optimize move sample to Template

// https://docs.google.com/spreadsheets/d/1HdL2rdwRdq72EDDbrELImJU58qQ7IXptIuxvx1VbtRI/edit#gid=182831153

/*https://js.langchain.com/docs/api/prompts/types/TemplateFormat*/

// https://js.langchain.com/docs/modules/model_io/prompts/prompt_templates/
