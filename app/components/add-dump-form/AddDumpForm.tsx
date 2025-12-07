'use client';

import { useState } from 'react';

export default function AddDumpForm() {
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Server Action will be called here
    alert("Form submission is not implemented yet.");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-bold mb-3 text-gray-200">Add a new Brain Dump</h2>
      <textarea
        className="w-full bg-gray-700 text-gray-200 rounded-md p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        rows={3}
        placeholder="e.g., 'Team meeting tomorrow at 10am to discuss project X'"
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
      />
      <div className="flex justify-between items-center mt-3">
        <p className="text-xs text-gray-400">
          Press{' '}
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
            Ctrl/Cmd
          </kbd>{' '}
          +{' '}
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
            Enter
          </kbd>{' '}
          to submit
        </p>
        <button
          type="submit"
          disabled={loading || rawText.trim() === ''}
          className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
        >
          {loading ? 'Processing...' : 'Add & Organize'}
        </button>
      </div>
    </form>
  );
}
