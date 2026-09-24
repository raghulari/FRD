'use client';

import { useEffect, useState } from 'react';

interface TextStreamProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export function TextStream({ text, speed = 30, className = '', onComplete }: TextStreamProps) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let currentIndex = 0;
    setDisplayedText('');

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span className={`font-mono ${className}`}>
      {displayedText}
      <span className="animate-pulse text-cobalt font-bold">_</span>
    </span>
  );
}
