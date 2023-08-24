import requestIp from 'request-ip'
import { Request } from 'express'

export function getIp(req: Request): string {
  const ip = req.clientIp || req.ip
  if (ip) return ip
  return requestIp.getClientIp(req)
}
