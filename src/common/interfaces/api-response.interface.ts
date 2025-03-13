export interface BaseResponse {
  /**
   * Status of the response (always true for successful responses)
   */
  success: boolean;

  /**
   * Response code (typically HTTP status code)
   */
  code: number;

  /**
   * A human-readable message to describe the response
   */
  message: string;

  /**
   * Optional timestamp of when the response was generated
   */
  timestamp: string;
}

/**
 * Standard API response structure for success responses
 * @template T - The type of data being returned
 */
export interface ApiResponse<T> extends BaseResponse {
  /**
   * The actual data returned by the API - can be any objectLiteral or primitive type
   */
  data: T;
}

/**
 * Standard API response structure for error responses
 */
export interface ApiErrorResponse extends BaseResponse {
  /**
   * Detailed error information (optional)
   */
  error?: {
    /**
     * Error name or type
     */
    name?: string;

    /**
     * Additional error details
     */
    details?: Record<string, any>;
  };
}

/**
 * Interface for pagination metadata
 */
export interface PaginationMeta {
  /**
   * Total number of items
   */
  total: number;

  /**
   * Current page number
   */
  page: number;

  /**
   * Number of items per page
   */
  perPage: number;

  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Whether there is a previous page
   */
  hasPrevious: boolean;

  /**
   * Whether there is a next page
   */
  hasNext: boolean;
}

/**
 * Interface for paginated data
 * @template T - The type of items in the paginated list
 */
export interface PaginatedData<T> {
  /**
   * The list of items
   */
  items: T[];

  /**
   * Pagination metadata
   */
  paginationInfo: PaginationMeta;
}

/**
 * Standard API response structure for paginated responses
 * @template T - The type of items in the paginated list
 */
export interface PaginatedApiResponse<T> extends ApiResponse<PaginatedData<T>> {
  // This now extends ApiResponse with PaginatedData as the generic type
}
