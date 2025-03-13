import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiResponse,
  PaginatedApiResponse,
} from '../interfaces/api-response.interface';
import { PaginatedResult } from '../dtos/pagination.dto';

/**
 * Interceptor that transforms all successful responses into a standardized format
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T> | PaginatedApiResponse<any>>
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
  ): Observable<ApiResponse<T> | PaginatedApiResponse<any>> {
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

        // Check if this is a paginated response
        if (
          data &&
          typeof data === 'object' &&
          'items' in data &&
          'meta' in data
        ) {
          const paginatedData = data as unknown as PaginatedResult<any>;

          // Transform to paginated API response
          return {
            success: true,
            code: statusCode,
            message: this.getSuccessMessageForStatusCode(statusCode),
            timestamp: new Date().toISOString(),
            data: {
              items: paginatedData.items,
              paginationInfo: {
                total: paginatedData.meta.total,
                page: paginatedData.meta.page,
                perPage: paginatedData.meta.perPage,
                totalPages: paginatedData.meta.totalPages,
                hasPrevious: paginatedData.meta.hasPrevious,
                hasNext: paginatedData.meta.hasNext,
              },
            },
          } as PaginatedApiResponse<any>;
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
