import React, { useEffect, useState } from 'react';
import { SparklesIcon } from 'lucide-react';

const QuoteBox = () => {
  const [quote, setQuote] = useState({ text: '', author: '' });

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await fetch('https://zenquotes.io/api/today');
        const data = await res.json();
        setQuote({
          text: data[0].q,
          author: data[0].a
        });
      } catch {
        setQuote({
          text: 'Stay focused and keep growing.',
          author: 'RelatoVerse'
        });
      }
    };
    fetchQuote();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex items-start gap-3 border-l-4 border-indigo-500">
      <SparklesIcon className="w-6 h-6 text-indigo-600 mt-1" />
      <div>
        <p className="italic text-gray-700">“{quote.text}”</p>
        <p className="text-sm text-gray-500 mt-1">— {quote.author}</p>
      </div>
    </div>
  );
};

export default QuoteBox;
