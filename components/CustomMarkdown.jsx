// components/CustomMarkdown.jsx
import ReactMarkdown from 'react-markdown';

export default function CustomMarkdown({ response }) {
  return <ReactMarkdown>{response}</ReactMarkdown>;
}
