/* eslint-disable */
export default async () => {
  const t = {}
  return {
    '@nestjs/swagger': {
      models: [
        [
          import('./auth/dto/auth.dto'),
          {
            AuthDto: {
              id: { required: true, type: () => String },
              email: { required: true, type: () => String },
            },
            JwtDto: {
              sub: { required: true, type: () => String },
              email: { required: true, type: () => String },
            },
          },
        ],
        [import('./category/dto/create-category.dto'), { CreateCategoryDto: {} }],
        [import('./category/dto/update-category.dto'), { UpdateCategoryDto: {} }],
        [
          import('./user/dto/edit-user.dto'),
          {
            EditUserDto: {
              email: { required: false, type: () => String },
              firstName: { required: false, type: () => String },
              lastName: { required: false, type: () => String },
            },
          },
        ],
        [import('./category/entities/category.entity'), { Category: {} }],
        [import('./course/entities/course.entity'), { Course: {} }],
        [import('./material/entities/material.entity'), { Material: {} }],
        [import('./auth/entities/auth.entity'), { Auth: {} }],
      ],
      controllers: [
        [
          import('./app/app.controller'),
          { AppController: { getHello: {}, getHealth: {} } },
        ],
        [
          import('./auth/auth.controller'),
          { AuthController: { googleAuth: {}, googleAuthCallback: {} } },
        ],
        [
          import('./category/category.controller'),
          {
            CategoryController: { create: { type: String }, findAll: { type: [String] } },
          },
        ],
        [
          import('./material/material.controller'),
          {
            MaterialController: {
              getPerformanceTaskPDF: {},
              getWorksheetPDF: {},
              getQuizPDF: {},
            },
          },
        ],
      ],
    },
  }
}
