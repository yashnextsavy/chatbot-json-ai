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
        <label htmlFor="company-select">Select Company: </label>
        <select 
          id="company-select"
          value={activeCompany}
          onChange={(e) => setActiveCompany(e.target.value)}
        >
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
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
          margin: 20px 0;
          text-align: center;
        }

        #company-select {
          padding: 8px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .chat-header-controls {
          display: flex;
          justify-content: ${SHOW_DEV_TABS ? "space-between" : "flex-end"};
          align-items: center;
          margin-bottom: 15px;
          cursor: pointer;
          padding: 8px;
          background-color: #f8f9fa;
          border-radius: 8px 8px 0 0;
          border-bottom: 1px solid #eaeaea;
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
