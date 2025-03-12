import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponse } from '../interfaces/api-response.interface';

/**
 * Global exception filter to catch all exceptions, including non-HTTP ones
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  /**
   * Catch and process all exceptions
   * @param exception - The caught exception
   * @param host - The arguments host
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine if it's an HTTP exception or something else
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let errorName = 'InternalServerError';
    let errorDetails: Record<string, any> | undefined;

    // Handle HTTP exceptions
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      errorName = exception.name;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const exceptionObj = exceptionResponse as Record<string, any>;
        message = exceptionObj.message || message;

        if (exceptionObj.errors || exceptionObj.error) {
          errorDetails = {
            error: exceptionObj.error,
            errors: exceptionObj.errors,
          };
        }
      }
    } else if (exception instanceof Error) {
      // Handle standard JavaScript errors
      message = exception.message;
      errorName = exception.name;
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    // Create standardized error response
    const errorResponse: ApiErrorResponse = {
      success: false,
      code: status,
      message,
      timestamp: new Date().toISOString(),
      error: {
        name: errorName,
        details: errorDetails,
      },
    };

    // Send the error response
    response.status(status).json(errorResponse);
  }
}
