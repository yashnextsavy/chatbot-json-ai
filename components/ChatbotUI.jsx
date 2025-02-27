import { useState, useEffect, useRef } from "react";
import CustomMarkdown from "./CustomMarkdown";

export default function ChatbotUI({ companyId }) {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [conversationId, setConversationId] = useState("");
    const messagesEndRef = useRef(null);

    const [companyData, setCompanyData] = useState(null);

    useEffect(() => {
        // Fetch company JSON dynamically based on companyId
        const fetchCompanyData = async () => {
            try {
                const response = await fetch(`/data/${companyId}.json`);
                const data = await response.json();
                console.log("data company id based ", data)
                setCompanyData(data);
            } catch (error) {
                console.error("Error fetching company data:", error);
            }
        };

        fetchCompanyData();
    }, [companyId]);


    useEffect(() => {
        let storedConversationId = localStorage.getItem("conversationId");

        if (!storedConversationId) {
            storedConversationId = crypto.randomUUID
                ? crypto.randomUUID()
                : Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);
            localStorage.setItem("conversationId", storedConversationId);
        }

        setConversationId(storedConversationId);

        const fetchConversation = async () => {
            try {
                const res = await fetch(`/api/getConversation?conversationId=${storedConversationId}`);
                const data = await res.json();
                if (data.messages) setMessages(data.messages);
            } catch (error) {
                console.error("Error fetching conversation history:", error);
            }
        };

        fetchConversation();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!userInput.trim()) return;

        const newMessages = [...messages, { sender: "user", text: userInput }];
        setMessages(newMessages);

        await fetch("/api/saveConversation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ conversationId, messages: newMessages }),
        });

        try {
            const res = await fetch("/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userInput, companyId }),
            });
            console.log("res", res);
            const data = await res.json();

            if (data.reply) {
                const updatedMessages = [...newMessages, { sender: "bot", text: data.reply }];
                setMessages(updatedMessages);

                await fetch("/api/saveConversation", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ conversationId, messages: updatedMessages }),
                });
            }
        } catch (error) {
            console.error("Error fetching chatbot reply:", error);
        }
        setUserInput("");
    };

    return (
        <div className="chat-container">
            {/* Chat Header */}
            <div className="chat-header">
                <img src={companyData?.company?.image} alt="Company Logo" />
                Chat with {companyData?.company?.name}
            </div>

            {/* Chat Messages */}
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.sender === "bot" ? (
                            <CustomMarkdown response={msg.text} />
                        ) : (
                            msg.text
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="chat-input-container">
                <input
                    className="chat-input"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                />
                <button className="chat-send-btn" onClick={sendMessage}>
                    <img src="/assets/icons/paper-plane-solid.svg" alt="Send" className="send-icon" />
                </button>
            </div>
        </div>
    );
}
