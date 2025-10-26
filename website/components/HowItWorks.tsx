'use client';

import { motion } from 'framer-motion';
import { MousePointer, Sparkles, Shield, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: <MousePointer className="w-8 h-8" />,
    title: 'Browse Reddit',
    description: 'Navigate to any Reddit page as you normally would',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: 'Automatic Detection',
    description: 'Credify buttons appear on every post automatically',
    color: 'from-cyan-500 to-teal-500',
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Click to Analyze',
    description: 'Click any button to instantly analyze the post',
    color: 'from-teal-500 to-green-500',
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: 'View Results',
    description: 'Get credibility scores, flags, and detailed analysis',
    color: 'from-green-500 to-emerald-500',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Credify seamlessly integrates into your Reddit experience in just four simple steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent -z-10" />
              )}

              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center h-full hover:border-blue-500/50 transition-all duration-300">
                  <div className={`bg-gradient-to-br ${step.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg`}>
                    {step.icon}
                  </div>
                  <div className="absolute -top-3 -right-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

