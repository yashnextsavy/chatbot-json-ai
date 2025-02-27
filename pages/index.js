import ChatbotUI from "../components/ChatbotUI";

export default function Home() {
  // Suppose we are customizing for "companyIT"
  const companyId = "companyCyberMech";

  return (
    <div>
      <h1>Welcome to the Chatbot Demo</h1>
      {companyId && <ChatbotUI companyId={companyId} />}
    </div>
  );
}
