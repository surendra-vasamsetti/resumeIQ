# 🚀 ResumeIQ - AI-Powered Resume Analyzer

A modern, AI-powered resume analyzer that helps optimize resumes for ATS (Applicant Tracking Systems) and provides detailed feedback for job seekers.

## ✨ Features

- **🎨 Modern UI** with smooth animations and dark/light mode
- **🤖 AI-Powered Analysis** using Google's Gemini AI
- **📊 Detailed Scoring** with visual progress indicators
- **🎯 Job-Specific Analysis** with custom job descriptions
- **📱 Responsive Design** for all devices
- **⚡ Real-time Results** with animated feedback

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

### Backend
- **Node.js** with Express
- **Google Generative AI** (Gemini)
- **PDF parsing** with pdf-parse
- **File uploads** with Multer

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- A Google Gemini API key

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd resumeiq

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key

### 3. Configure Environment

In the `backend` directory, create a `.env` file by copying the example:

```bash
# Navigate to the backend folder
cd backend

# Copy the example environment file
cp .env.example .env
```

Now, open the `.env` file and add your Google Gemini API key:

```
GOOGLE_API_KEY=your_actual_api_key_here
PORT=3001
```

### 4. Start the Application

You will need two separate terminals to run the frontend and backend servers.

```bash
# Terminal 1: Start the backend server
cd backend
npm run server

# Terminal 2: Start the frontend (in a new terminal)
cd frontend
npm run dev
```

### 5. Open Your Browser

Navigate to `http://localhost:5173` to see the application!

## 📁 Project Structure

```
resumeiq/
├── frontend/               # Frontend React application
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/                # Backend Node.js API
│   ├── index.js
│   ├── package.json
│   └── .env.example
└── README.md               # This file
```

## 🔧 API Endpoints

### `POST /api/analyze-resume`
Analyzes a resume file with AI

**Request:**
- `resume`: PDF file (multipart/form-data)
- `role`: Target job role
- `analysisType`: 'quick' | 'detailed' | 'optimization'
- `jobDescription`: Optional job description text

**Response:**
```json
{
  "success": true,
  "analysis": {
    "overallScore": 85,
    "scores": {
      "impact": 88,
      "brevity": 82,
      "style": 85,
      "structure": 90,
      "skills": 80,
      "atsCompatibility": 85
    },
    "strengths": ["Strong technical skills", "..."],
    "improvements": ["Add more keywords", "..."],
    "analysis": "Detailed analysis text..."
  }
}
```

### `GET /api/health`
Health check endpoint

## 🎯 Analysis Types

1. **Quick Scan** - Fast overview with key insights
2. **Detailed Analysis** - Comprehensive review with detailed scores
3. **ATS Optimization** - Focus on ATS compatibility and keyword optimization

## 🔒 Security Notes

- API keys are stored securely on the backend
- File uploads are processed in memory (not stored)
- CORS is configured for local development

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy the 'dist' folder
```

### Backend (Railway/Heroku)
```bash
cd server
# Set environment variables in your hosting platform
# Deploy the server folder
```

## 🛠️ Troubleshooting

### Common Issues

1. **"API key not configured"**
   - Make sure `.env` file exists in the `server` directory
   - Verify your Gemini API key is correct

2. **"Cannot connect to backend"**
   - Ensure backend server is running on port 3001
   - Check if `http://localhost:3001/api/health` returns OK

3. **"PDF parsing failed"**
   - Ensure the uploaded file is a valid PDF
   - Try with a different PDF file

4. **Port already in use**
   ```bash
   # Change frontend port
   npm run dev -- --port 3000
   
   # Change backend port in .env
   PORT=3002
   ```

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Ensure all dependencies are installed correctly
3. Verify your API key is configured properly
4. Check the browser console for error messages

---

**Happy Resume Analyzing! 🎉**