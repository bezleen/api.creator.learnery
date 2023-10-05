import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { QuizService } from './quiz.service';
import { CreateQuizInputDTO } from './dto/create-quiz.input';
import { UpdateQuizInputDTO } from './dto/update-quiz.input';

@Resolver('Quiz')
export class QuizResolver {
  constructor(private readonly quizService: QuizService) {}

  @Mutation('createQuiz')
  create(@Args('data') createQuizInput: CreateQuizInputDTO) {
    return this.quizService.create(createQuizInput);
  }

  @Query('quizzes')
  findAll() {
    return this.quizService.findAll();
  }

  @Query('quiz')
  findOne(@Args('id') id: string) {
    return this.quizService.findOne({id});
  }

  @Mutation('updateQuiz')
  update(@Args('id') id: string, @Args('data') updateQuizInput: UpdateQuizInputDTO) {
    return this.quizService.update({id}, updateQuizInput);
  }

  @Mutation('removeQuiz')
  remove(@Args('id') id: string) {
    return this.quizService.remove({id});
  }
}
