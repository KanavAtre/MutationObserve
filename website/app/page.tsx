'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Shield, Zap, Eye, CheckCircle, Download, Github, Chrome } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';
import HowItWorks from '@/components/HowItWorks';
import DemoSection from '@/components/DemoSection';
import InstallationSection from '@/components/InstallationSection';

const HeroSection = dynamic(() => import('@/components/HeroSection'), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">Credify</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
              <a href="#demo" className="text-gray-300 hover:text-white transition-colors">Demo</a>
              <a href="#install" className="text-gray-300 hover:text-white transition-colors">Install</a>
              <a 
                href="https://github.com/yourusername/MutationObserve" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D Background */}
      <HeroSection />

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Credify uses advanced detection to help you navigate Reddit with confidence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Real-time Analysis"
              description="Get instant credibility scores on any Reddit post with a single click"
              delay={0.1}
            />
            <FeatureCard
              icon={<Eye className="w-8 h-8" />}
              title="Smart Detection"
              description="Automatically identifies unverified sources and disputed claims"
              delay={0.2}
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Privacy First"
              description="All analysis happens locally - no data collection or tracking"
              delay={0.3}
            />
            <FeatureCard
              icon={<CheckCircle className="w-8 h-8" />}
              title="Visual Indicators"
              description="Color-coded scores and clear flag warnings for quick assessment"
              delay={0.4}
            />
            <FeatureCard
              icon={<Chrome className="w-8 h-8" />}
              title="Seamless Integration"
              description="Injected directly into Reddit with MutationObserver technology"
              delay={0.5}
            />
            <FeatureCard
              icon={<Download className="w-8 h-8" />}
              title="Easy Installation"
              description="Simple Chrome extension - install and start verifying in seconds"
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Interactive Demo Section */}
      <DemoSection />

      {/* Installation Section */}
      <InstallationSection />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-blue-900/20 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold text-white">Credify</span>
          </div>
          <p className="text-gray-400 mb-4">
            Fight misinformation, one post at a time
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">MIT License</a>
            <span>•</span>
            <a href="https://github.com/yourusername/MutationObserve" className="hover:text-white transition-colors">
              GitHub
            </a>
            <span>•</span>
            <span>Built with Next.js & Three.js</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
