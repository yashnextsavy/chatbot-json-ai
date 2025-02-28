import { useState, useEffect } from "react";
import ChatbotUI from "../components/ChatbotUI";
import Head from "next/head";

export default function Home() {
  const [activeCompany, setActiveCompany] = useState("companyCyberMech");
  const companies = [
    { id: "companyCyberMech", name: "CyberMech Robotics" },
    { id: "companyIT", name: "Technology Solutions" },
    { id: "companyPhotography", name: "Photography Studio" },
  ];

  const [minimized, setMinimized] = useState(false);

  // Development feature toggle - set to true to show company tabs
  const SHOW_DEV_TABS = false;

  return (
    <div className="app-container">
      <Head>
        <title>AI Assistant - Company Chatbot</title>
        <meta name="description" content="Chat with Company AI Assistant" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="company-selector">
        <label htmlFor="company-select" className="company-select-label">Choose your virtual assistant: </label>
        <div className="select-wrapper">
          <select 
            id="company-select"
            value={activeCompany}
            onChange={(e) => setActiveCompany(e.target.value)}
            className="company-select"
          >
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
          <div className="select-arrow">▼</div>
        </div>
      </div>

      <div className="chatbot-container">
        {minimized && (
          <button
            className="chat-float-btn"
            onClick={() => setMinimized(false)}
          >
            <span className="chat-icon">💬</span>
          </button>
        )}
        <div className={`chatbot-wrapper ${minimized ? "minimized" : ""}`}>
          <main>
            {activeCompany && (
              <ChatbotUI
                companyId={activeCompany}
                key={activeCompany}
                onMinimize={() => setMinimized(true)}
              />
            )}
          </main>
        </div>
      </div>

      <style jsx>{`        
      .company-selector {
          margin: 30px 0;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 20px;
          background-color: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
          animation: fadeIn 0.5s ease-out;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        @keyframes fadeIn {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        .company-select-label {
          font-size: 18px;
          font-weight: 500;
          color: #3c4043;
          margin-bottom: 10px;
        }

        .select-wrapper {
          position: relative;
          width: 100%;
          max-width: 300px;
        }

        .company-select {
          width: 100%;
          padding: 12px 20px;
          font-size: 16px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          background-color: white;
          appearance: none;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          color: #3c4043;
          font-weight: 500;
        }

        .company-select:hover {
          border-color: #4285f4;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
        }

        .company-select:focus {
          outline: none;
          border-color: #4285f4;
          box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.2);
        }

        .select-arrow {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #4285f4;
          font-size: 12px;
          pointer-events: none;
          transition: transform 0.3s ease;
        }

        .company-select:focus + .select-arrow {
          transform: translateY(-50%) rotate(180deg);
        }

        .chat-header-controls {
          display: flex;
          justify-content: ${SHOW_DEV_TABS ? "space-between" : "flex-end"};
          align-items: center;
          margin-bottom: 15px;
          cursor: pointer;
          padding: 12px;
          background-color: #f8f9fa;
          border-radius: 12px 12px 0 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }     

        .minimize-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          margin-left: ${SHOW_DEV_TABS ? "10px" : "0"};
          color: #888;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}
