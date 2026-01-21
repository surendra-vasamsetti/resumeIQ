const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface AnalysisRequest {
  file: File;
  role: string;
  analysisType: string;
  jobDescription?: string;
}

export interface AnalysisResponse {
  success: boolean;
  analysis: {
    overallScore: number;
    scores: {
      impact: number;
      brevity: number;
      style: number;
      structure: number;
      skills: number;
      atsCompatibility: number;
    };
    strengths?: string[];
    improvements?: string[];
    analysis: string;
    missingKeywords?: string[];
    atsImprovements?: string[];
    formattingTips?: string[];
    sectionAnalysis?: {
      summary: string;
      experience: string;
      skills: string;
      education: string;
    };
  };
}

// Define error response interface
interface APIErrorResponse {
  message?: string;
  error?: string;
  details?: string;
  code?: string;
  timestamp?: string;
  [key: string]: unknown;
}

// Enhanced error class for better error handling
class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: APIErrorResponse
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const analyzeResume = async (request: AnalysisRequest): Promise<AnalysisResponse> => {
  // Validate inputs before sending
  if (!request.file) {
    throw new APIError('No file provided', 400);
  }

  if (!request.role) {
    throw new APIError('Role is required', 400);
  }

  if (!request.analysisType) {
    throw new APIError('Analysis type is required', 400);
  }

  // Validate file type
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  if (!allowedTypes.includes(request.file.type)) {
    throw new APIError(
      `Unsupported file type: ${request.file.type}. Please upload a PDF, DOC, DOCX, or TXT file.`,
      400
    );
  }

  // Validate file size (e.g., max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (request.file.size > maxSize) {
    throw new APIError('File too large. Maximum size is 10MB.', 400);
  }

  const formData = new FormData();
  formData.append('resume', request.file);
  formData.append('role', request.role);
  formData.append('analysisType', request.analysisType);
  
  if (request.jobDescription) {
    formData.append('jobDescription', request.jobDescription);
  }

  try {
    console.log('Sending request to:', `${API_BASE_URL}/api/analyze-resume`);
    console.log('Request details:', {
      fileName: request.file.name,
      fileSize: request.file.size,
      fileType: request.file.type,
      role: request.role,
      analysisType: request.analysisType,
      hasJobDescription: !!request.jobDescription
    });

    const response = await fetch(`${API_BASE_URL}/api/analyze-resume`, {
      method: 'POST',
      body: formData,
      // Add headers for better compatibility
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorMessage = 'Failed to analyze resume';
      let errorData: APIErrorResponse | null = null;

      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json() as APIErrorResponse;
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          // If response is not JSON, try to get text
          const textResponse = await response.text();
          errorMessage = textResponse || errorMessage;
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }

      console.error('API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        errorMessage,
        errorData
      });

      // Provide more specific error messages based on status code
      let userFriendlyMessage = errorMessage;
      
      switch (response.status) {
        case 400:
          userFriendlyMessage = `Bad request: ${errorMessage}`;
          break;
        case 401:
          userFriendlyMessage = 'Authentication required. Please check your credentials.';
          break;
        case 403:
          userFriendlyMessage = 'Access forbidden. You don\'t have permission to perform this action.';
          break;
        case 404:
          userFriendlyMessage = 'Service not found. Please check if the server is running.';
          break;
        case 413:
          userFriendlyMessage = 'File too large. Please upload a smaller file.';
          break;
        case 415:
          userFriendlyMessage = 'Unsupported file type. Please upload a PDF, DOC, DOCX, or TXT file.';
          break;
        case 429:
          userFriendlyMessage = 'Too many requests. Please wait a moment and try again.';
          break;
        case 500:
          userFriendlyMessage = `Server error: ${errorMessage}. Please try again later or contact support.`;
          break;
        case 502:
          userFriendlyMessage = 'Bad gateway. The server is temporarily unavailable.';
          break;
        case 503:
          userFriendlyMessage = 'Service unavailable. Please try again later.';
          break;
        case 504:
          userFriendlyMessage = 'Gateway timeout. The request took too long to process.';
          break;
        default:
          userFriendlyMessage = `HTTP ${response.status}: ${errorMessage}`;
      }

      throw new APIError(userFriendlyMessage, response.status, errorData || undefined);
    }

    const result = await response.json() as AnalysisResponse;
    console.log('API Response:', result);

    // Validate response structure
    if (!result.success || !result.analysis) {
      throw new APIError('Invalid response format from server', 500, { message: 'Invalid response structure' });
    }

    return result;
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof APIError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(
        'Network error. Please check if the backend server is running and accessible.',
        0
      );
    }
    
    // Handle other errors
    throw new APIError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      500
    );
  }
};

export const checkAPIHealth = async (): Promise<boolean> => {
  try {
    console.log('Checking API health at:', `${API_BASE_URL}/health`);
    
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    console.log('Health check response:', response.status);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

// Helper function to test API connectivity
export const testAPI = async (): Promise<{ healthy: boolean; error?: string }> => {
  try {
    const healthy = await checkAPIHealth();
    return { healthy };
  } catch (error) {
    return {
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// export interface AnalysisRequest {
//   file: File;
//   role: string;
//   analysisType: string;
//   jobDescription?: string;
// }

// export interface AnalysisResponse {
//   success: boolean;
//   analysis: {
//     overallScore: number;
//     scores: {
//       impact: number;
//       brevity: number;
//       style: number;
//       structure: number;
//       skills: number;
//       atsCompatibility: number;
//     };
//     strengths?: string[];
//     improvements?: string[];
//     analysis: string;
//     missingKeywords?: string[];
//     atsImprovements?: string[];
//     formattingTips?: string[];
//     sectionAnalysis?: {
//       summary: string;
//       experience: string;
//       skills: string;
//       education: string;
//     };
//   };
// }

// export const analyzeResume = async (request: AnalysisRequest): Promise<AnalysisResponse> => {
//   const formData = new FormData();
//   formData.append('resume', request.file);
//   formData.append('role', request.role);
//   formData.append('analysisType', request.analysisType);
  
//   if (request.jobDescription) {
//     formData.append('jobDescription', request.jobDescription);
//   }

//   try {
//     const response = await fetch(`${API_BASE_URL}/api/analyze-resume`, {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to analyze resume');
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('API Error:', error);
//     throw error;
//   }
// };

// export const checkAPIHealth = async (): Promise<boolean> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/health`);
//     return response.ok;
//   } catch (error) {
//     console.error('Health check failed:', error);
//     return false;
//   }
// };