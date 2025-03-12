import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  ApiResponseSchema,
  ApiErrorResponseSchema,
  PaginatedApiResponseSchema,
} from '../schemas/api-response.schema';

/**
 * Interface for standard response decorator options
 */
export interface ApiStandardResponseOptions
  extends Omit<ApiResponseOptions, 'type'> {
  type?: Type<any>;
  isArray?: boolean;
  isPaginated?: boolean;
}

/**
 * Creates a Swagger decorator for standard success responses
 * @param options - Response options including the type
 * @returns Decorator that documents the standard response format
 */
export function ApiStandardResponse(options: ApiStandardResponseOptions = {}) {
  const { type, isArray = false, isPaginated = false, ...rest } = options;

  // If no type is provided, use generic Object type
  const responseType = type || Object;

  // Choose the base schema based on whether this is a paginated response
  const baseSchemaClass = isPaginated
    ? PaginatedApiResponseSchema
    : ApiResponseSchema;

  // Define the schema based on our ApiResponse interface
  const schema = {
    allOf: [
      { $ref: getSchemaPath(baseSchemaClass) },
      {
        properties: {
          data: isArray
            ? {
                type: 'array',
                items: { $ref: getSchemaPath(responseType) },
              }
            : { $ref: getSchemaPath(responseType) },
        },
      },
    ],
  };

  // Choose the appropriate response decorator based on status code
  const responseDecorator =
    options.status === 201 ? ApiCreatedResponse : ApiOkResponse;

  return applyDecorators(
    ApiExtraModels(baseSchemaClass, responseType),
    responseDecorator({
      ...rest,
      schema,
    }),
  );
}

/**
 * Creates a Swagger decorator for a specific error response
 * @param options - Response options
 * @returns Decorator that documents the standard error response format
 */
export function ApiStandardErrorResponse(options: ApiResponseOptions = {}) {
  return applyDecorators(
    ApiExtraModels(ApiErrorResponseSchema),
    ApiOkResponse({
      ...options,
      schema: {
        $ref: getSchemaPath(ApiErrorResponseSchema),
      },
    }),
  );
}

/**
 * Creates a Swagger decorator for paginated responses
 * @param options - Response options including the item type
 * @returns Decorator that documents the standard paginated response format
 */
export function ApiPaginatedResponse(options: ApiStandardResponseOptions = {}) {
  const { type, ...rest } = options;

  // Use provided type or default to Object
  const responseType = type || Object;

  return applyDecorators(
    ApiExtraModels(PaginatedApiResponseSchema, responseType),
    ApiOkResponse({
      ...rest,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedApiResponseSchema) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(responseType) },
              },
            },
          },
        ],
      },
    }),
  );
}
