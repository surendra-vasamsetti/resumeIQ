const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdf = require('pdf-parse');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Initialize OpenAI
const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to extract text from PDF
async function extractPDFText(buffer) {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    throw new Error('Failed to extract text from PDF');
  }
}

// Helper function to get OpenAI analysis
async function getOpenAIAnalysis(pdfText, role, analysisType, jobDescription) {
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

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant designed to output JSON." },
        { role: "user", content: prompt }
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    let errorMessage = 'Failed to get a valid JSON response from the AI model.';
    
    if (error.response) {
        console.error('OpenAI API Error Data:', error.response.data);
        errorMessage = `OpenAI API Error: ${JSON.stringify(error.response.data)}`;
    } else if (error.message) {
        errorMessage = `OpenAI API Error: ${error.message}`;
    }
    
    console.error('OpenAI API Error Stack:', error.stack);
    throw new Error(errorMessage);
  }
}

// API Routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ 
    message: 'ResumeIQ API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/analyze-resume', upload.single('resume'), async (req, res) => {
  console.log('--- New /api/analyze-resume request ---');
  console.log('Request Body:', JSON.stringify(req.body, null, 2));
  console.log('Request File:', req.file);
  console.log('------------------------------------');

  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No resume file uploaded',
        details: {
          receivedFields: req.body,
          receivedFile: req.file
        }
      });
    }

    const { role, analysisType, jobDescription } = req.body;

    if (!role) {
      return res.status(400).json({
        error: 'Role is required.',
        details: { receivedFields: req.body }
      });
    }
    if (!analysisType) {
      return res.status(400).json({
        error: 'Analysis type is required.',
        details: { receivedFields: req.body }
      });
    }

    // Specific validation for optimization analysis
    if (analysisType === 'optimization' && (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0)) {
      return res.status(400).json({
        error: 'A job description is required for optimization analysis and must be a non-empty string.',
        details: { receivedFields: req.body }
      });
    }

    // Extract text from PDF
    let pdfText;
    try {
      pdfText = await extractPDFText(req.file.buffer);
    } catch (err) {
      return res.status(400).json({
        error: 'Could not extract text from PDF. The file may not be a valid PDF.',
        details: { receivedFile: req.file }
      });
    }

    if (!pdfText || pdfText.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Could not extract text from PDF. The file may be empty or corrupted.',
        details: { receivedFile: req.file }
      });
    }

    // Get AI analysis
    const analysis = await getOpenAIAnalysis(pdfText, role, analysisType, jobDescription);

    res.json({
      success: true,
      analysis: analysis
    });

  } catch (error) {
    console.error(`[ERROR] /api/analyze-resume: ${error.message}`);
    console.error(`[ERROR] /api/analyze-resume: ${error.stack}`); // Log the error stack for debugging
    // Send a more specific error message to the client
    res.status(500).json({ error: error.message || 'An unexpected error occurred during analysis.' });
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