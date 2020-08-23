import AWS from 'aws-sdk'
import { AccountMeta } from '../types'

const S3 = new AWS.S3()

const getBucket = (): string => {
  if (!process.env.S3_BUCKET) {
    throw new Error(`Could not find bucket from env S3_BUCKET`)
  }

  return process.env.S3_BUCKET
}

export const getAccountByUsername = async (username: string): Promise<AccountMeta | null> => {
  try {
    const result = await S3.getObject({
      Bucket: getBucket(),
      Key: `usr/${username}/metadata.json`
    }).promise()

    if (!result.Body) {
      return null
    }
  
    const parsedResult = JSON.parse(result.Body.toString())
  
    return {
      password: parsedResult.password,
      createdAt: new Date(parsedResult.createdAt),
      username: parsedResult.username
    }
  } catch (err) {
    if (err.code && err.code === 'NoSuchKey') {
      return null
    }

    throw err
  }
}

export const createAccount = async (username: string, password: string): Promise<AccountMeta> => {
  const accountMetaToStore: AccountMeta = {
    createdAt: new Date(),
    password,
    username
  }
  
  await S3.putObject({
    Bucket: getBucket(),
    Key: `usr/${username}/metadata.json`,
    Body: JSON.stringify(accountMetaToStore, null, 2),
    ContentType: 'application/json'
  }).promise()

  return accountMetaToStore
}

export interface StorageObject {
  key: string,
  size: number,
  lastModified: Date
}
export const listDirectory = async (username: string, path: string): Promise<StorageObject[]> => {
  const basePath = `usr/${username}/drive/`

  const response = await S3.listObjectsV2({
    Bucket: getBucket(),
    Prefix: `${basePath}${path}`
  }).promise()

  const objects = !response.Contents ? [] : response.Contents.map(content => ({
    key: content.Key!,
    lastModified: content.LastModified!,
    size: content.Size!
  }))

  return objects.filter(object => object.key !== basePath)
}

export const getObject = async (username: string, key: string): Promise<StorageObject | null> => {
  try {
    const basePath = `usr/${username}/drive/`

    const response = await S3.getObject({
      Bucket: getBucket(),
      Key: `${basePath}${key}`
    }).promise()
  
    const object: StorageObject | null = !response.$response ? null : ({
      key: `${basePath}${key}`,
      lastModified: response.LastModified!,
      size: response.ContentLength!
    })
  
    return object
  } catch (err) {
    if (err.code && err.code === 'NoSuchKey') {
      return null
    }

    throw err
  }
}

export const createDirectory = async (username: string, path: string): Promise<StorageObject> => {
  const basePath = `usr/${username}/drive/`

  await S3.putObject({
    Bucket: getBucket(),
    Key: `${basePath}${path}`,

  }).promise()

  return {
    key: `${basePath}${path}`,
    lastModified: new Date(),
    size: 0
  }
}

export const deleteFile = async (username: string, key: string): Promise<void> => {
  const basePath = `usr/${username}/drive/`

  try {
    await S3.deleteObject({
      Bucket: getBucket(),
      Key: `${basePath}${key}`
    }).promise()
  } catch (err) {
    if (err.code && err.code === 'NoSuchKey') {
      return
    }

    throw err
  }
}

export const deleteDirectory = async (username: string, path: string): Promise<void> => {
  const basePath = `usr/${username}/drive/`

  const objects = await listDirectory(username, path)

  await S3.deleteObjects({
    Bucket: getBucket(),
    Delete: {
      Objects: objects.map(object => ({ Key: object.key })).concat([{ Key: `${basePath}${path}` }])
    }
  }).promise()
}

export interface GenerateUploadUrlParams {
  key: string,
  contentType: string
}
export const generateUploadUrl = async (username: string, params: GenerateUploadUrlParams): Promise<string> => {
  const basePath = `usr/${username}/drive/`
  const signedUploadUrl = await S3.getSignedUrlPromise('putObject', {
    Key: `${basePath}${params.key}`,
    ContentType: params.contentType,
    Bucket: getBucket()
  })
  return signedUploadUrl
}

export interface GenerateDownloadUrlParams {
  key: string,
  secondsToExpire: number
}
export const generateDownloadUrl = async (username: string, params: GenerateDownloadUrlParams): Promise<string> => {
  const basePath = `usr/${username}/drive/`
  const signedUploadUrl = await S3.getSignedUrlPromise('getObject', {
    Key: `${basePath}${params.key}`,
    Bucket: getBucket(),
    Expires: params.secondsToExpire
  })
  return signedUploadUrl
}
