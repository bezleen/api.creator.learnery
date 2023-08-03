import { Request, Response } from 'express'

export interface User {
  walletId: number
}

interface RequestWithUser extends Request {
  user: User
}
export interface GraphqlContext {
  req: RequestWithUser
  res: Response
}
