import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponse } from '../interfaces/api-response.interface';

/**
 * Global HTTP exception filter to standardize error responses
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  /**
   * Catch and process HTTP exceptions
   * @param exception - The caught exception
   * @param host - The arguments host
   */
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Get status code and response from the exception
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Extract error details
    let errorMessage: string;
    let errorDetails: Record<string, any> | undefined;

    if (typeof exceptionResponse === 'string') {
      errorMessage = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      const exceptionObj = exceptionResponse as Record<string, any>;
      errorMessage = exceptionObj.message || 'An error occurred';

      // Extract validation errors or other details if available
      if (exceptionObj.errors || exceptionObj.error) {
        errorDetails = {
          error: exceptionObj.error,
          errors: exceptionObj.errors,
        };
      }
    } else {
      errorMessage = 'Internal server error';
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${errorMessage}`,
      exception.stack,
    );

    // Create standardized error response
    const errorResponse: ApiErrorResponse = {
      success: false,
      code: status,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      error: {
        name: exception.name,
        details: errorDetails,
      },
    };

    // Send the error response
    response.status(status).json(errorResponse);
  }
}
