
import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function CustomMarkdown({ response }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ node, ...props }) => <p style={{ margin: '6px 0' }} {...props} />,
        a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />,
        ul: ({ node, ...props }) => <ul style={{ paddingLeft: '20px', margin: '8px 0' }} {...props} />,
        ol: ({ node, ...props }) => <ol style={{ paddingLeft: '20px', margin: '8px 0' }} {...props} />,
        li: ({ node, ...props }) => <li style={{ margin: '4px 0' }} {...props} />,
        h1: ({ node, ...props }) => <h1 style={{ fontSize: '1.5em', margin: '12px 0 8px' }} {...props} />,
        h2: ({ node, ...props }) => <h2 style={{ fontSize: '1.3em', margin: '10px 0 6px' }} {...props} />,
        h3: ({ node, ...props }) => <h3 style={{ fontSize: '1.1em', margin: '8px 0 4px' }} {...props} />,
        code: ({ node, inline, ...props }) => (
          inline ? 
            <code style={{ backgroundColor: 'rgba(0,0,0,0.05)', padding: '2px 4px', borderRadius: '3px' }} {...props} /> :
            <code {...props} />
        ),
        pre: ({ node, ...props }) => <pre style={{ overflow: 'auto' }} {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote 
            style={{ 
              borderLeft: '4px solid rgba(0,0,0,0.1)', 
              paddingLeft: '16px', 
              marginLeft: '0',
              fontStyle: 'italic',
              color: 'rgba(0,0,0,0.7)'
            }} 
            {...props} 
          />
        ),
      }}
    >
      {response}
    </ReactMarkdown>
  );
}
