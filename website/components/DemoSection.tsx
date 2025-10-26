'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { MessageSquare, ArrowUp, Share2, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export default function DemoSection() {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowAnalysis(true);
    }, 1500);
  };

  const credibilityScore = 6.5;
  const scoreColor = credibilityScore >= 7 ? 'green' : credibilityScore >= 4 ? 'yellow' : 'red';
  const scoreColorClass = {
    green: 'from-green-500 to-emerald-500',
    yellow: 'from-yellow-500 to-orange-500',
    red: 'from-red-500 to-rose-500',
  }[scoreColor];

  return (
    <section id="demo" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full filter blur-[128px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Interactive Demo
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            See Credify in action! Click the button below to analyze a sample Reddit post
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Mock Reddit Post */}
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex flex-col items-center space-y-2">
                  <button className="text-gray-400 hover:text-orange-500">
                    <ArrowUp className="w-6 h-6" />
                  </button>
                  <span className="text-white font-bold">42.5k</span>
                  <button className="text-gray-400 hover:text-blue-500">
                    <ArrowUp className="w-6 h-6 rotate-180" />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                    <span className="font-medium text-white">r/technology</span>
                    <span>•</span>
                    <span>Posted by u/techuser123</span>
                    <span>•</span>
                    <span>4 hours ago</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">
                    Breaking: New Study Shows Revolutionary Technology Could Change Everything
                  </h3>

                  <p className="text-gray-300 mb-4">
                    A groundbreaking study from an unnamed research institute claims to have discovered 
                    a revolutionary technology that could completely transform how we live. The findings 
                    have not yet been peer-reviewed, but sources say the implications are massive...
                  </p>

                  <div className="flex items-center space-x-4 text-gray-400 text-sm">
                    <button className="flex items-center space-x-2 hover:text-white">
                      <MessageSquare className="w-5 h-5" />
                      <span>1.2k Comments</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-white">
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Credify Button */}
              <div className="mt-6 pt-6 border-t border-slate-800 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold flex items-center space-x-2 shadow-lg shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>🔍</span>
                      <span>Credify Post</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Analysis Results */}
            {showAnalysis && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.5 }}
                className="border-t border-slate-800 bg-slate-950/50 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-2xl font-bold text-white">Credibility Analysis</h4>
                  <button
                    onClick={() => setShowAnalysis(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                {/* Score Display */}
                <div className="flex items-center justify-center mb-8">
                  <div className="relative">
                    <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${scoreColorClass} flex items-center justify-center shadow-lg`}>
                      <div className="w-28 h-28 rounded-full bg-slate-900 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-white">{credibilityScore}</span>
                        <span className="text-sm text-gray-400">/ 10</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flags */}
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-white mb-3">Detected Issues:</h5>
                  
                  <div className="flex items-start space-x-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h6 className="font-semibold text-yellow-400 mb-1">Unverified Source</h6>
                      <p className="text-sm text-gray-400">
                        The study mentioned is not from a recognized research institution
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h6 className="font-semibold text-red-400 mb-1">Disputed Claims</h6>
                      <p className="text-sm text-gray-400">
                        Claims lack peer review and specific details about the research
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h6 className="font-semibold text-green-400 mb-1">Active Discussion</h6>
                      <p className="text-sm text-gray-400">
                        High engagement suggests community is critically evaluating the content
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-blue-400">Recommendation:</span> Exercise caution with this post. 
                    Look for additional verified sources before accepting claims as factual.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

