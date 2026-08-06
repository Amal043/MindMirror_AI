import React, { useState } from 'react';
import { useSensory } from '../context/SensoryContext';

export const ContactScreen = () => {
  const { lowStimulation } = useSensory();
  const [formData, setFormData] = useState({ name: '', email: '', category: 'Feedback', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.message.trim()) return;
    setIsSubmitted(true);
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-12 text-left">
      <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-lg space-y-6 relative overflow-hidden">
        
        {/* Soft Ambient Glow Halo */}
        <div 
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none opacity-20"
          style={{ background: 'var(--accent-gradient)' }}
        />

        <div>
          <div className="inline-block px-3 py-1 bg-accent-soft text-text-accent text-xs font-semibold rounded-full mb-3 border border-accent/20">
            📬 Contact &amp; Feedback
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
            We value your input.
          </h1>
          <p className="text-sm text-text-secondary">
            Have thoughts on accessibility, scenario ideas, or sensory improvements? Send us a direct message below.
          </p>
        </div>

        {isSubmitted ? (
          <div className={`p-6 bg-accent-soft border border-accent/30 rounded-2xl space-y-3 ${
            lowStimulation ? 'transition-none' : ''
          }`}>
            <div className="flex items-center space-x-2 text-text-accent font-bold text-base">
              <span>✓ Message Received</span>
            </div>
            <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
              Thank you for sharing your feedback with us! We read every note to continuously refine our neurodiversity-friendly design.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ name: '', email: '', category: 'Feedback', message: '' });
              }}
              className="mt-2 text-xs font-semibold text-text-accent underline focus:outline-none"
            >
              Send another note
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-semibold text-text-primary mb-1">
                Your Name (Optional)
              </label>
              <input
                id="contact-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Alex"
                className="w-full p-3.5 bg-bg-input text-text-primary border border-border rounded-xl text-sm focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-xs font-semibold text-text-primary mb-1">
                Email Address (Optional)
              </label>
              <input
                id="contact-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. alex@example.com"
                className="w-full p-3.5 bg-bg-input text-text-primary border border-border rounded-xl text-sm focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="contact-category" className="block text-xs font-semibold text-text-primary mb-1">
                Category
              </label>
              <select
                id="contact-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3.5 bg-bg-input text-text-primary border border-border rounded-xl text-sm focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus shadow-sm"
              >
                <option value="Feedback">General Feedback</option>
                <option value="Accessibility">Sensory &amp; Accessibility Suggestion</option>
                <option value="Scenario">New Scenario Idea</option>
                <option value="Bug">Report an Issue</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-semibold text-text-primary mb-1">
                Your Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="contact-message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Share your thoughts..."
                className="w-full p-3.5 bg-bg-input text-text-primary border border-border rounded-xl text-sm focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus resize-y shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={!formData.message.trim()}
              className={`w-full py-3.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-border-focus disabled:opacity-50 btn-press cursor-pointer shadow-sm ${
                lowStimulation ? 'transition-none' : ''
              }`}
            >
              Submit Message
            </button>
          </form>
        )}

      </div>
    </main>
  );
};
