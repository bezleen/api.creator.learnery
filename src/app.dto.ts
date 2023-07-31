import { Request, Response } from 'express'

export interface User {
  walletId: number
}

class RequestWithUser extends Request {
  user: User
}
export class GraphqlContext {
  req: RequestWithUser
  res: Response
}
