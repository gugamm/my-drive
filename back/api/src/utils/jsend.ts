import { Middleware, Context, Next } from 'koa'

declare module 'koa' {
  interface BaseContext {
    success: (code: string, data?: any, message?: string) => void
    fail: (code: string, data?: any, message?: string) => void
    error: (code: string, data?: any, message?: string) => void
  }
}

export const jsend = (): Middleware => async (ctx: Context, next: Next) => {
  ctx.success = (code: string, data?: any, message?: string): void => {
    ctx.body = {
      code,
      data,
      message,
      status: 'success',
      statusCode: 200
    }
    ctx.status = 200
  }

  ctx.fail = (code: string, data?: any, message?: string): void => {
    ctx.body = {
      code,
      data,
      message,
      status: 'fail',
      statusCode: 400
    }
    ctx.status = 400
  }

  ctx.error = (code: string, data?: any, message?: string): void => {
    ctx.body = {
      code,
      data,
      message,
      status: 'error',
      statusCode: 500
    }
    ctx.status = 500
  }

  await next()
}
