import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './components/LandingPage';
import AnalysisPage from './components/AnalysisPage';
import ResultsPage from './components/ResultsPage';

type Page = 'landing' | 'analysis' | 'results';

interface AnalysisData {
  file: File;
  role: string;
  analysisType: string;
  jobDescription?: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const handleGetStarted = () => {
    setCurrentPage('analysis');
  };

  const handleAnalyze = (file: File, role: string, analysisType: string, jobDescription?: string) => {
    setAnalysisData({ file, role, analysisType, jobDescription });
    setCurrentPage('results');
  };

  const handleBack = () => {
    if (currentPage === 'results') {
      setCurrentPage('analysis');
    } else if (currentPage === 'analysis') {
      setCurrentPage('landing');
    }
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
    setAnalysisData(null);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen">
        {currentPage === 'landing' && (
          <LandingPage onGetStarted={handleGetStarted} />
        )}
        {currentPage === 'analysis' && (
          <AnalysisPage onBack={handleBack} onAnalyze={handleAnalyze} />
        )}
        {currentPage === 'results' && analysisData && (
          <ResultsPage
            onBack={handleBackToLanding}
            file={analysisData.file}
            role={analysisData.role}
            analysisType={analysisData.analysisType}
            jobDescription={analysisData.jobDescription}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;