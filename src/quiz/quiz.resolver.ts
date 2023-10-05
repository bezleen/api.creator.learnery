import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { QuizService } from './quiz.service';
import { CreateQuizInput } from './dto/create-quiz.input';
import { UpdateQuizInput } from './dto/update-quiz.input';

@Resolver('Quiz')
export class QuizResolver {
  constructor(private readonly quizService: QuizService) {}

  @Mutation('createQuiz')
  create(@Args('createQuizInput') createQuizInput: CreateQuizInput) {
    return this.quizService.create(createQuizInput);
  }

  @Query('quiz')
  findAll() {
    return this.quizService.findAll();
  }

  @Query('quiz')
  findOne(@Args('id') id: number) {
    return this.quizService.findOne(id);
  }

  @Mutation('updateQuiz')
  update(@Args('updateQuizInput') updateQuizInput: UpdateQuizInput) {
    return this.quizService.update(updateQuizInput.id, updateQuizInput);
  }

  @Mutation('removeQuiz')
  remove(@Args('id') id: number) {
    return this.quizService.remove(id);
  }
}
