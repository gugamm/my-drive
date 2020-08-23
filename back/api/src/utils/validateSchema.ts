import { Schema } from 'joi'

export interface SchemaErrors {
  [K: string]: string
}

export interface ValidateSchemaResult {
  isValid: boolean,
  errors: SchemaErrors
}
export const validateSchema = (schema: Schema, data: any): ValidateSchemaResult => {
  const result = schema.validate(data, { abortEarly: false, convert: false })

  if (!result.error) {
    return {
      errors: {},
      isValid: true
    }
  }

  return {
    isValid: false,
    errors: result.error.details.reduce((acc: SchemaErrors, error) => {
      acc[error.path.join('_')] = error.message
      return acc
    }, {})
  }
}
