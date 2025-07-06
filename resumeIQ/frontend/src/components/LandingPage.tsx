import React, { useState } from 'react';
import { FileText, Zap, Target, TrendingUp, ArrowRight, Sparkles, Menu, X, Eye, Cpu, Github, Twitter, Linkedin } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-colors duration-500">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float-1"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float-2 delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-green-400/15 to-blue-400/15 rounded-full blur-3xl animate-float-3 delay-500"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-br from-yellow-400/15 to-red-400/15 rounded-full blur-3xl animate-float-4 delay-1500"></div>
      </div>

      {/* Header */}
<header className="bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center group">
              <div className="relative">
                <FileText className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-pulse" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent">
                ResumeIQ
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-2 rounded-full font-semibold hover:from-primary-700 hover:to-secondary-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-bounce-subtle"
              >
                Get Started
              </button>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-300 transform hover:scale-110"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-neutral-50/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-700 py-4 animate-slide-down">
            <div className="flex flex-col items-center space-y-4">
              <ThemeToggle />
              <button
                onClick={() => {
                  onGetStarted();
                  setIsMobileMenuOpen(false);
                }}
                className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-2 rounded-full font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 shadow-lg hover:shadow-xl w-fit"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8 animate-fade-in-up">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent text-lg font-semibold flex items-center justify-center">
                <Sparkles className="h-5 w-5 mr-2 text-yellow-400 animate-pulse" />
                AI-Powered Resume Analysis
                <Sparkles className="h-5 w-5 ml-2 text-yellow-400 animate-pulse" />
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-zoom-in delay-200">
              Optimize Your Resume for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent animate-text-gradient-animation"> ATS Success</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto animate-slide-in-up delay-400">
              Get instant feedback on your resume with our advanced AI analyzer. Increase your chances of landing interviews with personalized recommendations and ATS optimization.
            </p>
            <div className="animate-pop-in delay-600">
              <button
                onClick={onGetStarted}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden animate-pulse-ring"
              >
                <span className="relative z-10 flex items-center">
                  Analyze Your Resume Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              About ResumeIQ
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              ResumeIQ was born from a simple idea: to level the playing field for job seekers everywhere. Our mission is to empower you with the tools and insights needed to craft a resume that not only beats the bots but also captivates recruiters.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Mission Card */}
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-lg text-center animate-fade-in-up delay-200">
              <div className="bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Target className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-300">To provide accessible, AI-driven resume feedback that helps individuals confidently pursue their dream careers.</p>
            </div>
            {/* Vision Card */}
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-lg text-center animate-fade-in-up delay-400">
              <div className="bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Eye className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Our Vision</h3>
              <p className="text-gray-600 dark:text-gray-300">To create a world where every talented individual has the opportunity to showcase their potential, regardless of their background.</p>
            </div>
            {/* Technology Card */}
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-lg text-center animate-fade-in-up delay-600">
              <div className="bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Cpu className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Our Technology</h3>
              <p className="text-gray-600 dark:text-gray-300">We leverage cutting-edge AI, trained on millions of successful resumes, to provide you with the most accurate and actionable advice.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose ResumeIQ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our advanced AI technology provides comprehensive analysis to help you stand out in today's competitive job market.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-lg text-center group animate-fade-in-left delay-200">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl animate-pulse-shadow">
                <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover:animate-icon-pop" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Instant Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">Get immediate feedback on your resume with our AI-powered analysis engine.</p>
            </div>
            
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-lg text-center group animate-fade-in-up delay-400">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl animate-pulse-shadow">
                <Target className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover:animate-icon-pop" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">ATS Optimization</h3>
              <p className="text-gray-600 dark:text-gray-300">Ensure your resume passes through Applicant Tracking Systems with flying colors.</p>
            </div>
            
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-lg text-center group animate-fade-in-right delay-600">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl animate-pulse-shadow">
                <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover:animate-icon-pop" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Score Improvement</h3>
              <p className="text-gray-600 dark:text-gray-300">Track your progress and watch your resume score improve with actionable insights.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get professional resume feedback in just three simple steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-lg text-center animate-slide-in-from-bottom delay-200">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold shadow-lg animate-pop-in">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 animate-slide-in-up delay-300">Upload Resume</h3>
              <p className="text-gray-600 dark:text-gray-300 animate-slide-in-up delay-400">Upload your resume in PDF format or drag and drop it into our secure analyzer.</p>
            </div>
            
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-lg text-center animate-slide-in-from-bottom delay-400">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold shadow-lg animate-pop-in delay-200">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 animate-slide-in-up delay-500">Select Role & JD</h3>
              <p className="text-gray-600 dark:text-gray-300 animate-slide-in-up delay-600">Choose from predefined roles or paste a specific job description for targeted analysis.</p>
            </div>
            
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-lg text-center animate-slide-in-from-bottom delay-600">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold shadow-lg animate-pop-in delay-400">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 animate-slide-in-up delay-700">Get Results</h3>
              <p className="text-gray-600 dark:text-gray-300 animate-slide-in-up delay-800">Receive detailed analysis with scores, recommendations, and actionable improvements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* New CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-500/20 via-secondary-500/20 to-neutral-500/20 dark:from-primary-500/10 dark:via-secondary-500/10 dark:to-neutral-500/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl animate-fade-in-up">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Impress <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">Recruiters</span>?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of job seekers who have already improved their resumes and landed their dream jobs with ResumeIQ.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                <button
                  onClick={onGetStarted}
                  className="group bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto flex items-center justify-center"
                >
                  <Zap className="h-5 w-5 mr-2 group-hover:animate-icon-pop" />
                  Start Resume Analysis
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                <button className="bg-white/50 dark:bg-white/10 backdrop-blur-md border border-white/20 text-gray-800 dark:text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-white/80 dark:hover:bg-white/20 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto">
                  View Sample Report
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-x-3">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                Free analysis
                <span>•</span>
                No credit card required
                <span>•</span>
                Results in seconds
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* New Footer */}
      <footer className="bg-neutral-100/50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800 backdrop-blur-lg text-neutral-800 dark:text-neutral-200 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center group mb-4">
                <FileText className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-2" />
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent">
                  ResumeIQ
                </span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Empowering careers through intelligent resume analysis.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</a></li>
                <li><a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About Us</a></li>
                <li><a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"><Github className="h-6 w-6" /></a>
                <a href="#" className="text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"><Twitter className="h-6 w-6" /></a>
                <a href="#" className="text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"><Linkedin className="h-6 w-6" /></a>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-neutral-200 dark:border-neutral-800 pt-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
            <p>&copy; 2025 ResumeIQ. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;