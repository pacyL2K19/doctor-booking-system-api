/**
 * Standard API response structure for success responses
 * @template T - The type of data being returned
 */
export interface ApiResponse<T> {
  /**
   * Status of the response (always true for successful responses)
   */
  success: boolean;
  
  /**
   * Response code (typically HTTP status code)
   */
  code: number;
  
  /**
   * Human-readable message describing the response
   */
  message: string;
  
  /**
   * Optional timestamp of when the response was generated
   */
  timestamp: string;
  
  /**
   * The actual data returned by the API
   */
  data: T;
}

/**
 * Standard API response structure for error responses
 */
export interface ApiErrorResponse {
  /**
   * Status of the response (always false for error responses)
   */
  success: boolean;
  
  /**
   * Error code (typically HTTP status code)
   */
  code: number;
  
  /**
   * Human-readable error message
   */
  message: string;
  
  /**
   * Optional timestamp of when the error occurred
   */
  timestamp: string;
  
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
 * Standard API response structure for paginated responses
 * @template T - The type of items in the paginated list
 */
export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  /**
   * Pagination metadata
   */
  pagination: PaginationMeta;
} 