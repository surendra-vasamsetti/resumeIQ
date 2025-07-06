import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Share2, TrendingUp, AlertCircle, CheckCircle, Target, Sparkles, Award, Zap } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { analyzeResume, AnalysisResponse } from '../services/api';

interface ResultsPageProps {
  onBack: () => void;
  file: File;
  role: string;
  analysisType: string;
  jobDescription?: string;
}

interface ScoreData {
  overall: number;
  impact: number;
  brevity: number;
  style: number;
  structure: number;
  skills: number;
  atsCompatibility: number;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ onBack, file, role, analysisType, jobDescription }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [scores, setScores] = useState<ScoreData>({
    overall: 0,
    impact: 0,
    brevity: 0,
    style: 0,
    structure: 0,
    skills: 0,
    atsCompatibility: 0
  });

  // Fetch analysis from API
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await analyzeResume({
          file,
          role,
          analysisType,
          jobDescription
        });
        
        setAnalysisData(response);
        
        // Animate scores
        const targetScores = {
          overall: response.analysis.overallScore,
          impact: response.analysis.scores.impact,
          brevity: response.analysis.scores.brevity,
          style: response.analysis.scores.style,
          structure: response.analysis.scores.structure,
          skills: response.analysis.scores.skills,
          atsCompatibility: response.analysis.scores.atsCompatibility
        };
        
        Object.entries(targetScores).forEach(([key, value]) => {
          let current = 0;
          const increment = value / 30;
          const interval = setInterval(() => {
            current += increment;
            if (current >= value) {
              current = value;
              clearInterval(interval);
            }
            setScores(prev => ({ ...prev, [key]: Math.round(current) }));
          }, 50);
        });
        
      } catch (err) {
        console.error('Analysis failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to analyze resume');
      } finally {
        setTimeout(() => setLoading(false), 2500);
      }
    };

    fetchAnalysis();
  }, [file, role, analysisType, jobDescription]);

  const CircularProgress: React.FC<{ score: number; size: number; strokeWidth: number; animated?: boolean }> = ({ 
    score, 
    size, 
    strokeWidth, 
    animated = false 
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444'}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-2000 ease-out ${animated ? 'animate-pulse' : ''}`}
          />
        </svg>
        {animated && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-yellow-400 animate-spin" />
          </div>
        )}
      </div>
    );
  };

  const ProgressBar: React.FC<{ score: number; label: string; icon: React.ReactNode }> = ({ score, label, icon }) => (
    <div className="mb-6 group">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
          {icon}
          <span className="ml-2">{label}</span>
        </span>
        <span className="text-sm font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
          {score}/100
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className={`h-4 rounded-full transition-all duration-2000 ease-out relative overflow-hidden ${
            score >= 80 ? 'bg-gradient-to-r from-green-500 to-green-600' :
            score >= 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
            'bg-gradient-to-r from-red-500 to-red-600'
          }`}
          style={{ width: `${score}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center transition-colors duration-500">
        <div className="text-center animate-fade-in-up">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 dark:border-blue-800 mx-auto"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-600 dark:border-blue-400 absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-yellow-400 animate-pulse" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-4">Analyzing Your Resume</h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
            Our AI is reviewing your resume for {jobDescription ? 'the provided job description' : role} positions...
          </p>
          <div className="mt-6 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center transition-colors duration-500">
        <div className="text-center animate-fade-in-up max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4">Analysis Failed</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Make sure the backend server is running and your API key is configured.
          </p>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-colors duration-500">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
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
                  <Target className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
                  <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-pulse" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  ResumeIQ
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button className="hidden md:flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </button>
              <button className="hidden md:flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overall Score */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 text-center border border-gray-200/50 dark:border-gray-700/50 animate-fade-in-up hover:shadow-xl transition-all duration-300">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <CircularProgress score={scores.overall} size={180} strokeWidth={12} animated />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white animate-count-up">{scores.overall}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Overall Score</div>
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Resume Analysis Results</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            Analysis for <span className="font-semibold text-blue-600 dark:text-blue-400">
              {jobDescription ? 'Custom Job Description' : role}
            </span> position
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center text-green-600 dark:text-green-400 animate-fade-in-up delay-200">
              <CheckCircle className="h-5 w-5 mr-2 animate-pulse" />
              <span className="font-semibold">ATS Compatible</span>
            </div>
            <div className="flex items-center text-yellow-600 dark:text-yellow-400 animate-fade-in-up delay-400">
              <AlertCircle className="h-5 w-5 mr-2 animate-pulse" />
              <span className="font-semibold">Room for Improvement</span>
            </div>
            <div className="flex items-center text-blue-600 dark:text-blue-400 animate-fade-in-up delay-600">
              <Award className="h-5 w-5 mr-2 animate-pulse" />
              <span className="font-semibold">Good Foundation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Detailed Scores */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200/50 dark:border-gray-700/50 animate-fade-in-up delay-200 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
              Detailed Breakdown
            </h2>
            
            <ProgressBar 
              score={scores.impact} 
              label="Impact & Achievements" 
              icon={<Award className="h-4 w-4 text-green-600" />}
            />
            <ProgressBar 
              score={scores.brevity} 
              label="Brevity & Clarity" 
              icon={<Zap className="h-4 w-4 text-yellow-600" />}
            />
            <ProgressBar 
              score={scores.style} 
              label="Style & Formatting" 
              icon={<Sparkles className="h-4 w-4 text-purple-600" />}
            />
            <ProgressBar 
              score={scores.structure} 
              label="Structure & Organization" 
              icon={<Target className="h-4 w-4 text-blue-600" />}
            />
            <ProgressBar 
              score={scores.skills} 
              label="Skills & Keywords" 
              icon={<CheckCircle className="h-4 w-4 text-indigo-600" />}
            />
            <ProgressBar 
              score={scores.atsCompatibility} 
              label="ATS Compatibility" 
              icon={<TrendingUp className="h-4 w-4 text-green-600" />}
            />
          </div>

          {/* Recommendations */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200/50 dark:border-gray-700/50 animate-fade-in-up delay-400 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Target className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
              Key Recommendations
            </h2>
            
            <div className="space-y-6">
              {analysisData?.analysis.strengths && (
                <div className="border-l-4 border-green-500 pl-4 bg-green-50/50 dark:bg-green-900/10 rounded-r-lg p-4 animate-slide-in-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Strengths
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    {analysisData.analysis.strengths.map((strength, index) => (
                      <li key={index}>• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {analysisData?.analysis.improvements && (
                <div className="border-l-4 border-yellow-500 pl-4 bg-yellow-50/50 dark:bg-yellow-900/10 rounded-r-lg p-4 animate-slide-in-left delay-200">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-yellow-600" />
                    Areas for Improvement
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    {analysisData.analysis.improvements.map((improvement, index) => (
                      <li key={index}>• {improvement}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="border-l-4 border-blue-500 pl-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-r-lg p-4 animate-slide-in-left delay-400">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
                  AI Analysis
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {analysisData?.analysis.analysis || "Detailed analysis will appear here after processing."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12 animate-fade-in-up delay-800">
          <button
            onClick={onBack}
            className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              <Sparkles className="mr-2 h-5 w-5 group-hover:animate-spin" />
              Analyze Another Resume
              <Sparkles className="ml-2 h-5 w-5 group-hover:animate-spin" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;