const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdf = require('pdf-parse');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Helper function to extract text from PDF
async function extractPDFText(buffer) {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    throw new Error('Failed to extract text from PDF');
  }
}

// Helper function to extract JSON from text
function extractJsonFromText(text) {
  const startIndex = text.indexOf('{');
  const endIndex = text.lastIndexOf('}');
  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    let jsonString = text.substring(startIndex, endIndex + 1);
    // Remove potential markdown backticks
    jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '');
    return jsonString.trim();
  }
  // If no JSON object is found, return the original text and let JSON.parse handle it
  // This is to ensure that if the model returns a perfect JSON string, it still works
  return text;
}


// Helper function to get Gemini analysis
async function getGeminiAnalysis(pdfText, role, analysisType, jobDescription) {
  let prompt = '';
  
  if (analysisType === 'quick') {
    prompt = `
    You are ResumeChecker, an expert in resume analysis. Provide a quick scan of the following resume for a ${role} position:
    
    1. Give an overall ATS score out of 100
    2. List 3 key strengths
    3. Suggest 2 quick improvements
    4. Rate these aspects out of 100: Impact, Brevity, Style, Structure, Skills, ATS Compatibility
    
    Resume text: ${pdfText}
    ${jobDescription ? `Job description: ${jobDescription}` : ''}
    
    Format your response as a valid JSON object with this structure:
    {
      "overallScore": number,
      "scores": {
        "impact": number,
        "brevity": number,
        "style": number,
        "structure": number,
        "skills": number,
        "atsCompatibility": number
      },
      "strengths": ["strength1", "strength2", "strength3"],
      "improvements": ["improvement1", "improvement2"],
      "analysis": "detailed analysis text"
    }
    `;
  } else if (analysisType === 'detailed') {
    prompt = `
    You are ResumeChecker, an expert in resume analysis. Provide a detailed analysis of the following resume for a ${role} position:
    
    1. Give an overall ATS score out of 100
    2. Rate these aspects out of 100: Impact, Brevity, Style, Structure, Skills, ATS Compatibility
    3. List 5 strengths of the resume
    4. Suggest 5 areas for improvement with specific recommendations
    5. Provide detailed analysis of each section
    
    Resume text: ${pdfText}
    ${jobDescription ? `Job description: ${jobDescription}` : ''}
    
    Format your response as a valid JSON object with this structure:
    {
      "overallScore": number,
      "scores": {
        "impact": number,
        "brevity": number,
        "style": number,
        "structure": number,
        "skills": number,
        "atsCompatibility": number
      },
      "strengths": ["strength1", "strength2", "strength3", "strength4", "strength5"],
      "improvements": ["improvement1", "improvement2", "improvement3", "improvement4", "improvement5"],
      "analysis": "detailed analysis text",
      "sectionAnalysis": {
        "summary": "analysis of summary section",
        "experience": "analysis of experience section",
        "skills": "analysis of skills section",
        "education": "analysis of education section"
      }
    }
    `;
  } else { // optimization
    prompt = `
    You are ResumeChecker, an expert in ATS optimization. Analyze the following resume for a ${role} position:
    
    1. Give an overall ATS score out of 100
    2. Rate these aspects out of 100: Impact, Brevity, Style, Structure, Skills, ATS Compatibility
    3. Identify missing keywords from job description
    4. Suggest ATS optimization improvements
    5. Provide formatting recommendations
    
    Resume text: ${pdfText}
    ${jobDescription ? `Job description: ${jobDescription}` : ''}
    
    Format your response as a valid JSON object with this structure:
    {
      "overallScore": number,
      "scores": {
        "impact": number,
        "brevity": number,
        "style": number,
        "structure": number,
        "skills": number,
        "atsCompatibility": number
      },
      "missingKeywords": ["keyword1", "keyword2", "keyword3"],
      "atsImprovements": ["improvement1", "improvement2", "improvement3"],
      "formattingTips": ["tip1", "tip2", "tip3"],
      "analysis": "detailed ATS analysis text"
    }
    `;
  }

  let text = '';
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    text = response.text();
    
    const jsonString = extractJsonFromText(text);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Gemini API Error:', error);
    console.error('Raw Gemini Response:', text);
    throw new Error('Failed to analyze resume with AI. Please check the server logs for more details.');
  }
}

// API Routes
app.post('/api/analyze-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    const { role, analysisType, jobDescription } = req.body;

    if (!role || !analysisType) {
      return res.status(400).json({ error: 'Role and analysis type are required' });
    }

    // Extract text from PDF
    const pdfText = await extractPDFText(req.file.buffer);

    if (!pdfText || pdfText.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from PDF' });
    }

    // Get AI analysis
    const analysis = await getGeminiAnalysis(pdfText, role, analysisType, jobDescription);

    res.json({
      success: true,
      analysis: analysis
    });

  } catch (error) {
    console.error('Analysis Error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze resume',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Resume Analyzer API is running' });
});

app.listen(port, () => {
  console.log(`🚀 Resume Analyzer API running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
});