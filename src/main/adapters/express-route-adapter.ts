import { Controller, HttpRequest } from '../../presentation/protocols'
import { Request, Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = { body: req.body }
    const httpResponse = await controller.handle(httpRequest)

    if (httpResponse.statusCode === 200) {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      const error = { message: httpResponse.body.message }
      if (process.env.NODE_ENV !== 'production') {
        error.stack = httpResponse.body.stack
      }
      res.status(httpResponse.statusCode).json(error)
    }
  }
}
