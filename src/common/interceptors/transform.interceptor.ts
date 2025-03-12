import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

/**
 * Interceptor that transforms all successful responses into a standardized format
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  /**
   * Intercept method required by NestInterceptor interface
   * @param context - The execution context
   * @param next - The next call handler
   * @returns Observable with transformed response
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    // Get the HTTP response from the context
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode || HttpStatus.OK;

    return next.handle().pipe(
      map((data: T) => {
        // Handle the case when the response is already in our standard format
        if (
          data &&
          typeof data === 'object' &&
          'success' in data &&
          'code' in data &&
          'message' in data &&
          'data' in data
        ) {
          return data as unknown as ApiResponse<T>;
        }

        // Handle null or undefined data
        const responseData = data === undefined ? null : data;

        // Transform the response into our standard API response format
        return {
          success: true,
          code: statusCode,
          message: this.getSuccessMessageForStatusCode(statusCode),
          timestamp: new Date().toISOString(),
          data: responseData,
        };
      }),
    );
  }

  /**
   * Get an appropriate success message based on the HTTP status code
   * @param statusCode - The HTTP status code
   * @returns A descriptive success message
   */
  private getSuccessMessageForStatusCode(statusCode: number): string {
    switch (statusCode) {
      case HttpStatus.CREATED:
        return 'Resource created successfully';
      case HttpStatus.ACCEPTED:
        return 'Request accepted for processing';
      case HttpStatus.NO_CONTENT:
        return 'Request processed successfully';
      default:
        return 'Request successful';
    }
  }
}
