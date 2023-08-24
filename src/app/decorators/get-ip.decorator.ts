import { createParamDecorator } from '@nestjs/common'
import { getIp } from '@utils/getIp'

export const GetIp = createParamDecorator((data, req) => {
  return req.ip || getIp(req)
})
