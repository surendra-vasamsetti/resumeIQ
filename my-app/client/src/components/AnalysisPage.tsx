import React, { useState } from 'react';
import { Upload, FileText, ArrowLeft, Zap, Target, Settings, Briefcase, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface AnalysisPageProps {
  onBack: () => void;
  onAnalyze: (file: File, role: string, analysisType: string, jobDescription?: string) => void;
}

const AnalysisPage: React.FC<AnalysisPageProps> = ({ onBack, onAnalyze }) => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [analysisType, setAnalysisType] = useState('detailed');
  const [dragOver, setDragOver] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [useJobDescription, setUseJobDescription] = useState(false);

  const predefinedRoles = [
    'Full Stack Developer',
    'Backend Engineer',
    'Frontend Developer',
    'Data Scientist',
    'DevOps Engineer',
    'Software Engineer',
    'Product Manager',
    'UX/UI Designer',
    'Mobile Developer',
    'Machine Learning Engineer',
    'Cloud Architect',
    'Cybersecurity Specialist'
  ];

  const handleFileUpload = (uploadedFile: File) => {
    if (uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileUpload(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  const handleAnalyze = () => {
    if (file && (selectedRole || useJobDescription)) {
      onAnalyze(file, selectedRole, analysisType, useJobDescription ? jobDescription : undefined);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-colors duration-500">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center group">
                <div className="relative">
                  <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
                  <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-pulse" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  ResumeIQ
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="hidden sm:block text-sm text-gray-600 dark:text-gray-300">
                Resume Analysis
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Analyze Your Resume
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload your resume and select a target role or paste a job description to get personalized insights and recommendations.
          </p>
        </div>

        {/* File Upload Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 border border-gray-200/50 dark:border-gray-700/50 animate-fade-in-up delay-200 hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Upload className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
            Upload Your Resume
          </h2>
          
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 transform ${
              dragOver 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105' 
                : file 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 scale-105' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:scale-105'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
          >
            {file ? (
              <div className="flex items-center justify-center animate-bounce-in">
                <FileText className="h-12 w-12 text-green-600 mr-4 animate-pulse" />
                <div>
                  <p className="text-lg font-semibold text-green-800 dark:text-green-400">{file.name}</p>
                  <p className="text-sm text-green-600 dark:text-green-500">File uploaded successfully</p>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-bounce" />
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                  Drag and drop your resume here, or click to browse
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  PDF files only, max 10MB
                </p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Choose File
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Job Description Toggle */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 border border-gray-200/50 dark:border-gray-700/50 animate-fade-in-up delay-300 hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Briefcase className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
              Analysis Method
            </h2>
            <div className="flex items-center space-x-2 sm:space-x-4 mt-4 sm:mt-0">
              <button
                onClick={() => setUseJobDescription(false)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  !useJobDescription
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Predefined Roles
              </button>
              <button
                onClick={() => setUseJobDescription(true)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  useJobDescription
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Job Description
              </button>
            </div>
          </div>

          {!useJobDescription ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {predefinedRoles.map((role, index) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-left transform hover:scale-105 animate-fade-in-up ${
                    selectedRole === role
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-lg'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:shadow-md'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="font-semibold text-gray-900 dark:text-white">{role}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Optimize for {role.toLowerCase()} positions
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="animate-fade-in">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Paste Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here for targeted analysis..."
                className="w-full h-40 p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
              />
            </div>
          )}
        </div>

        {/* Analysis Type */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 border border-gray-200/50 dark:border-gray-700/50 animate-fade-in-up delay-400 hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Settings className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
            Analysis Type
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => setAnalysisType('quick')}
              className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 animate-fade-in-up ${
                analysisType === 'quick'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-lg'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:shadow-md'
              }`}
            >
              <Zap className="h-8 w-8 mb-2 text-blue-600 dark:text-blue-400 animate-pulse" />
              <div className="font-semibold text-gray-900 dark:text-white">Quick Scan</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Fast overview with key insights
              </div>
            </button>
            
            <button
              onClick={() => setAnalysisType('detailed')}
              className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-100 ${
                analysisType === 'detailed'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-lg'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:shadow-md'
              }`}
            >
              <FileText className="h-8 w-8 mb-2 text-blue-600 dark:text-blue-400 animate-pulse" />
              <div className="font-semibold text-gray-900 dark:text-white">Detailed Analysis</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Comprehensive review with scores
              </div>
            </button>
            
            <button
              onClick={() => setAnalysisType('optimization')}
              className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-200 ${
                analysisType === 'optimization'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-lg'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:shadow-md'
              }`}
            >
              <Target className="h-8 w-8 mb-2 text-blue-600 dark:text-blue-400 animate-pulse" />
              <div className="font-semibold text-gray-900 dark:text-white">ATS Optimization</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Focus on ATS compatibility
              </div>
            </button>
          </div>
        </div>

        {/* Analyze Button */}
        <div className="text-center animate-fade-in-up delay-500">
          <button
            onClick={handleAnalyze}
            disabled={!file || (!selectedRole && !useJobDescription) || (useJobDescription && !jobDescription.trim())}
            className={`group px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform ${
              file && ((selectedRole && !useJobDescription) || (useJobDescription && jobDescription.trim()))
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl animate-pulse-glow'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {file && ((selectedRole && !useJobDescription) || (useJobDescription && jobDescription.trim())) ? (
              <span className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                Analyze Resume
                <Sparkles className="ml-2 h-5 w-5 animate-spin" />
              </span>
            ) : (
              'Upload resume & select method'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;