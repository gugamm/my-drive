import { Context } from 'koa'
import Router from 'koa-router'
import JWT from 'jsonwebtoken'
import Joi from 'joi'
import { validateSchema } from './utils/validateSchema'
import * as storage from './services/storage'

const router = new Router()

router.post('/signin', async (ctx: Context) => {
  const { username, password } = ctx.request.body

  const schema = Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string().required()
  })

  const validation = validateSchema(schema, { username, password })

  if (!validation.isValid) {
    ctx.fail('INVALID_SCHEMA', validation.errors)
    return
  }

  try {
    const account = await storage.getAccountByUsername(username)

    if (!account || account.password !== password) {
      ctx.fail('INVALID_USERNAME_OR_PASSWORD', null, 'Invalid username or password')
      return
    }
  
    const token = JWT.sign({ email: username }, 'banana')
  
    ctx.success('SUCCESS', token)
  } catch (err) {
    ctx.error('INTERNAL_ERROR', null, 'Internal server error')
  }
})

router.post('/signup', async (ctx: Context) => {
  const { username, password, secretCode } = ctx.request.body

  const schema = Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string().required(),
    secretCode: Joi.string().required()
  })

  const validation = validateSchema(schema, { username, password, secretCode })

  if (!validation.isValid) {
    ctx.fail('INVALID_SCHEMA', validation.errors)
    return
  }

  if (secretCode !== process.env.CREATE_ACCOUNT_SECRET) {
    ctx.fail('INVALID_SECRET_CODE', null, 'Invalid secret code')
    return
  }

  try {
    const account = await storage.getAccountByUsername(username)

    if (account) {
      ctx.fail('USERNAME_EXISTS', null, 'Username already in use')
      return
    }
  
    await storage.createAccount(username, password)
  
    ctx.success('SUCCESS', null)
  } catch (err) {
    ctx.error('INTERNAL_ERROR', null, 'Internal server error')
  }
})

router.post('/listDirectory', async (ctx: Context) => {
  const { username, path } = ctx.request.body

  const schema = Joi.object({
    username: Joi.string().email().required(),
    path: Joi.string().allow('').required()
  })

  const validation = validateSchema(schema, { username, path })

  if (!validation.isValid) {
    ctx.fail('INVALID_SCHEMA', validation.errors)
    return
  }

  try {
    const objects = await storage.listDirectory(username, path)
    ctx.success('SUCCESS', objects)
  } catch (err) {
    ctx.error('INTERNAL_ERROR', null, 'Internal server error')
  }
})

router.post('/createDirectory', async (ctx: Context) => {
  const { username, path } = ctx.request.body

  const schema = Joi.object().keys({
    username: Joi.string().email().required(),
    path: Joi.string().regex(/.+\/$/).required()
  })

  const validation = validateSchema(schema, { username, path })

  if (!validation.isValid) {
    ctx.fail('INVALID_SCHEMA', validation.errors)
    return
  }

  try {
    const previousObject = await storage.getObject(username, path)

    if (previousObject) {
      ctx.fail('OBJECT_ALREADY_EXISTS', null, 'Object already exists')
      return
    }
  
    await storage.createDirectory(username, path)
    ctx.success('SUCCESS', null, 'Directory created')
  } catch (err) {
    ctx.error('INTERNAL_ERROR', null, 'Internal server error')
  }
})

router.post('/deleteFile', async (ctx: Context) => {
  const { username, key } = ctx.request.body

  const schema = Joi.object().keys({
    username: Joi.string().email().required(),
    key: Joi.string().required()
  })

  const validation = validateSchema(schema, { username, key })

  if (!validation.isValid) {
    ctx.fail('INVALID_SCHEMA', validation.errors)
    return
  }

  if ((key as string).endsWith('/')) {
    ctx.fail('INVALID_SCHEMA', {
      key: 'Cannot end with \'/\''
    })
    return
  }

  try {
    const object = await storage.getObject(username, key)

    if (!object) {
      ctx.success('DELETE_FILE_SUCCESS', null, 'Object does not exist')
      return
    }
  
    await storage.deleteFile(username, key)
    ctx.success('DELETE_FILE_SUCCESS', null, 'Object deleted')
  } catch (err) {
    ctx.error('INTERNAL_ERROR', null, 'Internal server error')
  }
})

router.post('/deleteDirectory', async (ctx: Context) => {
  const { username, path } = ctx.request.body

  const schema = Joi.object().keys({
    username: Joi.string().email().required(),
    path: Joi.string().regex(/.+\/$/).required()
  })

  const validation = validateSchema(schema, { username, path })

  if (!validation.isValid) {
    ctx.fail('INVALID_SCHEMA', validation.errors)
    return
  }

  try {
    const object = await storage.getObject(username, path)

    if (!object) {
      ctx.success('DELETE_DIRECTORY_SUCCESS', null, 'Object does not exist')
      return
    }
  
    await storage.deleteDirectory(username, path)
    ctx.success('DELETE_DIRECTORY_SUCCESS', null, 'Directory deleted')
  } catch (err) {
    ctx.error('INTERNAL_ERROR', null, 'Internal server error')
  }
})

router.post('/generateUploadUrl', async (ctx: Context) => {
  const { username, contentType, key } = ctx.request.body

  const schema = Joi.object().keys({
    username: Joi.string().email().required(),
    contentType: Joi.string().valid('application/json', 'image/jpeg', 'image/png', 'image/svg+xml', 'application/zip', 'application/pdf', 'application/octet-stream', 'text/plain', 'text/csv', 'text/html', 'video/mp4').required(),
    key: Joi.string().required()
  })

  const validation = validateSchema(schema, { username, contentType, key })

  if (!validation.isValid) {
    ctx.fail('INVALID_SCHEMA', validation.errors)
    return
  }

  if ((key as string).endsWith('/')) {
    ctx.fail('INVALID_SCHEMA', { key: 'Cannot end with \'/\'' })
    return
  }

  try {
    const signedUrl = await storage.generateUploadUrl(username, {
      contentType,
      key
    })
  
    ctx.success('GENERATE_UPLOAD_URL_SUCCESS', signedUrl)
  } catch (err) {
    ctx.error('INTERNAL_ERROR', null, 'Internal server error')
  }
})

router.post('/generateDownloadUrl', async (ctx: Context) => {
  const { username, key, secondsToExpire } = ctx.request.body

  const schema = Joi.object().keys({
    username: Joi.string().email().required(),
    key: Joi.string().required(),
    secondsToExpire: Joi.number().positive().integer().required()
  })

  const validation = validateSchema(schema, { username, secondsToExpire, key })

  if (!validation.isValid) {
    ctx.fail('INVALID_SCHEMA', validation.errors)
    return
  }

  if ((key as string).endsWith('/')) {
    ctx.fail('INVALID_SCHEMA', { key: 'Cannot end with \'/\'' })
    return
  }

  try {
    const object = await storage.getObject(username, key)

    if (!object) {
      ctx.fail('OBJECT_NOT_FOUND', null, `Could not find object ${key}`)
      return
    }
  
    const signedUrl = await storage.generateDownloadUrl(username, {
      key,
      secondsToExpire
    })
  
    ctx.success('GENERATE_DOWNLOAD_URL_SUCCESS', signedUrl)
  } catch (err) {
    ctx.error('INTERNAL_ERROR', null, 'Internal server error')
  }
})

export { router }
