import { LogErrorRepository } from '../../data/use-cases/db-create-account/protocols/log-error-repository'
import { serverErrorResponse } from '../../presentation/helpers/http-helper'
import { HttpRequest, HttpResponse, Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from './log-controller'

const makeFakeHttpResponse = (): HttpResponse => ({
  body: {},
  statusCode: 200
})

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {}
})

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(makeFakeHttpResponse())
    }
  }
  return new ControllerStub()
}

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements Controller {
    handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
    async log (stack: string): Promise<void> {
      return Promise.resolve()
    }
  }
  return new LogErrorRepositoryStub()
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const logErrorRepositoryStub = makeLogErrorRepositoryStub()
  const controllerStub = makeControllerStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut, controllerStub, logErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  test('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('should call LogErrorRepository with correc error when controller returns', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const httpRequest = makeFakeHttpRequest()

    const fakeError = new Error()
    fakeError.stack = 'anyStack'
    const errorResponse = serverErrorResponse(fakeError)

    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(errorResponse))
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith(fakeError.stack)
  })
})
