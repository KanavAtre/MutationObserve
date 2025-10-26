'use client';

import { motion } from 'framer-motion';
import { Download, Github, Chrome, Terminal } from 'lucide-react';

export default function InstallationSection() {
  return (
    <section id="install" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get Started Today
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Install Credify in minutes and start verifying Reddit content immediately
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* For Developers */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-500/10 p-3 rounded-xl">
                  <Terminal className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">For Developers</h3>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    1
                  </div>
                  <div>
                    <p className="text-gray-300">Clone the repository:</p>
                    <div className="mt-2 bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-sm text-blue-400 overflow-x-auto">
                      git clone https://github.com/yourusername/MutationObserve.git
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    2
                  </div>
                  <p className="text-gray-300">
                    Navigate to <code className="bg-slate-950 px-2 py-1 rounded text-blue-400">chrome://extensions/</code>
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    3
                  </div>
                  <p className="text-gray-300">
                    Enable &ldquo;Developer mode&rdquo; and click &ldquo;Load unpacked&rdquo;
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    4
                  </div>
                  <p className="text-gray-300">
                    Select the MutationObserve directory
                  </p>
                </div>
              </div>

              <motion.a
                href="https://github.com/yourusername/MutationObserve"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold transition-all border border-slate-700"
              >
                <Github className="w-5 h-5" />
                <span>View on GitHub</span>
              </motion.a>
            </motion.div>

            {/* For Users */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border border-blue-500/30 rounded-2xl p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-500/20 p-3 rounded-xl">
                  <Chrome className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">For Users</h3>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <Download className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <p className="text-gray-300">
                    Chrome Web Store version coming soon!
                  </p>
                </div>

                <p className="text-gray-300 leading-relaxed">
                  Credify is currently in development. For now, you can install it manually 
                  using the developer installation method.
                </p>

                <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Features included:</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      <span>Real-time credibility analysis</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      <span>Automatic post detection</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      <span>Beautiful modal interface</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      <span>100% privacy-focused</span>
                    </li>
                  </ul>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled
                className="w-full flex items-center justify-center space-x-2 bg-blue-600/50 text-white px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
              >
                <Download className="w-5 h-5" />
                <span>Coming to Chrome Web Store</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Browser Compatibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <h4 className="text-white font-semibold mb-4">Browser Compatibility</h4>
            <div className="flex items-center justify-center space-x-8 text-gray-400">
              <div className="flex flex-col items-center space-y-2">
                <Chrome className="w-8 h-8 text-green-400" />
                <span className="text-sm">Chrome</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Chrome className="w-8 h-8 text-green-400" />
                <span className="text-sm">Edge</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Chrome className="w-8 h-8 text-yellow-400" />
                <span className="text-sm">Firefox (Planned)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

