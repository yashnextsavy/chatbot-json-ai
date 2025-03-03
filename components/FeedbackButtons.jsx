
import { useState } from 'react';

export default function FeedbackButtons({ messageId, onFeedbackSubmit }) {
  const [feedback, setFeedback] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFeedback = (value) => {
    setFeedback(value);
    onFeedbackSubmit(messageId, value);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="feedback-submitted">
        Thanks for your feedback!
        <style jsx>{`
          .feedback-submitted {
            font-size: 12px;
            color: #4285f4;
            margin-top: 5px;
            opacity: 0.8;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="feedback-buttons">
      <button 
        className="feedback-btn" 
        onClick={() => handleFeedback('helpful')}
        aria-label="Mark as helpful"
      >
        👍
      </button>
      <button 
        className="feedback-btn" 
        onClick={() => handleFeedback('not-helpful')}
        aria-label="Mark as not helpful"
      >
        👎
      </button>
      <style jsx>{`
        .feedback-buttons {
          display: flex;
          gap: 10px;
          margin-top: 5px;
        }
        .feedback-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          opacity: 0.6;
          transition: all 0.2s ease;
          padding: 2px 5px;
        }
        .feedback-btn:hover {
          opacity: 1;
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}
