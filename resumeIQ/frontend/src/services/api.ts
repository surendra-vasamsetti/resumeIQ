const API_BASE_URL = 'http://localhost:3001/api';

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

export const analyzeResume = async (request: AnalysisRequest): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append('resume', request.file);
  formData.append('role', request.role);
  formData.append('analysisType', request.analysisType);
  
  if (request.jobDescription) {
    formData.append('jobDescription', request.jobDescription);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/analyze-resume`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to analyze resume');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const checkAPIHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};