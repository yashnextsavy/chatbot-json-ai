import { useState, useEffect, useRef } from "react";
import CustomMarkdown from "./CustomMarkdown";

export default function ChatbotUI({ companyId, onMinimize }) {
    // Function to generate context-aware quick replies
    const generateContextualReplies = (messages, companyId) => {
        // Default suggestions based on company type (as fallback)
        const defaultRepliesByCompany = {
            companyCyberMech: [
                "Tell me about your robots",
                "How much are humanoid androids?",
                "Are your robots safe?",
                "Do you offer military solutions?"
            ],
            companyIT: [
                "Cloud computing options",
                "Cybersecurity services",
                "AI solutions pricing",
                "Do you offer 24/7 support?"
            ],
            companyPhotography: [
                "Wedding photography rates",
                "Do you do corporate events?",
                "Portrait session details",
                "Drone photography options"
            ]
        };

        // If there are no messages yet, use the defaults
        if (messages.length <= 1) {
            return defaultRepliesByCompany[companyId] || [];
        }

        // Get the last bot message to generate context-aware replies
        const lastBotMessage = [...messages].reverse().find(msg => msg.sender === 'bot');

        if (!lastBotMessage) return defaultRepliesByCompany[companyId] || [];

        // Generate contextual replies based on the last bot message content
        const content = lastBotMessage.text.toLowerCase();

        // CyberMech context-aware replies
        if (companyId === 'companyCyberMech') {
            if (content.includes('robot') || content.includes('android')) {
                return [
                    "What are the safety features?",
                    "How much do they cost?",
                    "What maintenance is required?",
                    "Are they customizable?"
                ];
            } else if (content.includes('security') || content.includes('defense')) {
                return [
                    "Do you have military contracts?",
                    "What's your most advanced system?",
                    "How do you ensure ethical use?",
                    "Are there civilian applications?"
                ];
            }
        }

        // IT Solutions context-aware replies
        else if (companyId === 'companyIT') {
            if (content.includes('cloud') || content.includes('computing')) {
                return [
                    "What about data migration?",
                    "How does pricing work?",
                    "Do you offer hybrid solutions?",
                    "What about compliance?"
                ];
            } else if (content.includes('security') || content.includes('cyber')) {
                return [
                    "Do you offer security audits?",
                    "What about ransomware protection?",
                    "How do you handle breaches?",
                    "What certifications do you have?"
                ];
            }
        }

        // Photography context-aware replies
        else if (companyId === 'companyPhotography') {
            if (content.includes('wedding') || content.includes('event')) {
                return [
                    "Do you have package deals?",
                    "How many photographers attend?",
                    "Do you edit the photos?",
                    "How long until we get the photos?"
                ];
            } else if (content.includes('portrait') || content.includes('session')) {
                return [
                    "Do you have a studio?",
                    "Can we choose locations?",
                    "What about outfit changes?",
                    "How many final images do we get?"
                ];
            }
        }

        // If no specific context is detected, use defaults
        return defaultRepliesByCompany[companyId] || [];
    };
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [conversationId, setConversationId] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const [companyData, setCompanyData] = useState(null);

    // Focus input on load
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        // Fetch company JSON dynamically based on companyId
        const fetchCompanyData = async () => {
            try {
                const response = await fetch(`/data/${companyId}.json`);
                const data = await response.json();
                console.log("data company id based ", data);
                setCompanyData(data);

                // Reset conversation when company changes
                localStorage.removeItem("conversationId");
                const newConversationId = crypto.randomUUID
                    ? crypto.randomUUID()
                    : Math.random().toString(36).substring(2, 15) +
                    Math.random().toString(36).substring(2, 15);
                localStorage.setItem("conversationId", newConversationId);
                setConversationId(newConversationId);

                // Add a welcome message
                if (data.company) {
                    setMessages([
                        { 
                            sender: "bot", 
                            text: `Welcome to ${data.company.name}! How can I assist you today?`,
                            timestamp: new Date().toISOString()
                        }
                    ]);
                }
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
                // Try to get conversation from localStorage first
                const localMessages = localStorage.getItem(`messages_${storedConversationId}`);
                if (localMessages) {
                    const parsedMessages = JSON.parse(localMessages);
                    if (parsedMessages.length > 0) {
                        setMessages(parsedMessages);
                    }
                }

                // Then try to get from API
                const res = await fetch(`/api/getConversation?conversationId=${storedConversationId}`);
                const data = await res.json();

                if (data.messages && data.messages.length > 0) {
                    // Add timestamps if they don't exist
                    const messagesWithTimestamps = data.messages.map(msg => {
                        if (!msg.timestamp) {
                            return {...msg, timestamp: new Date().toISOString()};
                        }
                        return msg;
                    });
                    setMessages(messagesWithTimestamps);
                    // Update local storage
                    localStorage.setItem(`messages_${storedConversationId}`, JSON.stringify(messagesWithTimestamps));
                }
            } catch (error) {
                console.error("Error fetching conversation history:", error);
                // Try to load from local storage if API fails
                const localMessages = localStorage.getItem(`messages_${storedConversationId}`);
                if (localMessages) {
                    try {
                        setMessages(JSON.parse(localMessages));
                    } catch (e) {
                        console.error("Error parsing local messages:", e);
                    }
                }
            }
        };

        fetchConversation();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const sendMessage = async () => {
        if (!userInput.trim()) return;

        const timestamp = new Date().toISOString();
        const newMessages = [...messages, { sender: "user", text: userInput, timestamp }];
        setMessages(newMessages);
        setUserInput("");
        setIsTyping(true);

        try {
            const saveResponse = await fetch("/api/saveConversation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversationId, messages: newMessages }),
            });

            // Always save to localStorage as a backup
            localStorage.setItem(`messages_${conversationId}`, JSON.stringify(newMessages));

            const saveData = await saveResponse.json();
            if (saveData.error) {
                console.warn("Server error saving conversation, using local storage:", saveData.error);
            }
        } catch (error) {
            console.error("Error saving conversation:", error);
            // Fallback to localStorage
            localStorage.setItem(`messages_${conversationId}`, JSON.stringify(newMessages));
        }

        try {
            const res = await fetch("/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userInput, companyId }),
            });
            console.log("res", res);
            const data = await res.json();

            setIsTyping(false);
            if (data.reply) {
                const botTimestamp = new Date().toISOString();
                // Extract key topics from the bot's reply for future context
                const keyPhrases = data.reply
                    .toLowerCase()
                    .match(/(?:robot|android|security|cloud|computing|cyber|wedding|event|portrait|session|price|cost|rate)/g) || [];

                const updatedMessages = [...newMessages, { 
                    sender: "bot", 
                    text: data.reply,
                    timestamp: botTimestamp,
                    keyPhrases: Array.from(new Set(keyPhrases)) // Store unique key phrases for context
                }];
                setMessages(updatedMessages);

                try {
                    const saveResponse = await fetch("/api/saveConversation", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ conversationId, messages: updatedMessages }),
                    });

                    // Always save to localStorage as a backup
                    localStorage.setItem(`messages_${conversationId}`, JSON.stringify(updatedMessages));

                    const saveData = await saveResponse.json();
                    if (saveData.error) {
                        console.warn("Server error saving bot response, using local storage:", saveData.error);
                    }
                } catch (error) {
                    console.error("Error saving bot response:", error);
                    // Fallback to localStorage
                    localStorage.setItem(`messages_${conversationId}`, JSON.stringify(updatedMessages));
                }
            }
        } catch (error) {
            setIsTyping(false);
            console.error("Error fetching chatbot reply:", error);
            // Show error message to user
            const errorMessages = [...newMessages, { 
                sender: "bot", 
                text: "I'm having trouble connecting right now. Please try again later.",
                timestamp: new Date().toISOString()
            }];
            setMessages(errorMessages);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Handle mobile touch interactions
    useEffect(() => {
        const preventZoom = (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        };

        // Add meta viewport tag for better mobile rendering
        const metaViewport = document.createElement('meta');
        metaViewport.name = 'viewport';
        metaViewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
        document.head.appendChild(metaViewport);

        // Add touch event listeners
        document.addEventListener('touchmove', preventZoom, { passive: false });

        return () => {
            document.removeEventListener('touchmove', preventZoom);
            document.head.removeChild(metaViewport);
        };
    }, []);

    return (
        <div className="chat-container">
            <style jsx>{`
                .chat-container {
                    display: flex;
                    flex-direction: column;
                    height: 600px;
                    max-height: 85vh;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    background-color: #fff;
                }

                .chat-header {
                    display: flex;
                    align-items: center;
                    padding: 15px 20px;
                    background-color: var(--header-bg);
                    color: white;
                    font-weight: 600;
                    justify-content: space-between;
                }

                .chat-header-left {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .chat-header img {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    object-fit: cover;
                    background-color: white;
                }

                .status-indicator {
                    width: 8px;
                    height: 8px;
                    background-color: #4CAF50;
                    border-radius: 50%;
                    margin-left: 5px;
                }

                .minimize-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    margin-right: -10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 8px;
                }

                .message-list {
                    padding: 20px;
                    overflow-y: auto;
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    background-color: var(--chat-bg);
                }

                .message-input-container {
                    display: flex;
                    align-items: center;
                    padding: 10px 20px;
                    border-top: 1px solid #eaeaea;
                    background-color: white;
                    position: relative;
                }

                .message-input {
                    flex-grow: 1;
                    border: 1px solid #ddd;
                    border-radius: 20px;
                    padding: 12px 20px;
                    outline: none;
                    transition: border-color 0.3s;
                    font-size: 16px;
                    background-color: #f5f5f5;
                    padding-right: 45px;
                }

                .message-input:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.1);
                }

                .send-button {
                    background-color: var(--primary);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    position: absolute;
                    right: 25px;
                    transition: background-color 0.3s;
                }

                .send-button:hover {
                    background-color: var(--secondary);
                }

                .message {
                    max-width: 75%;
                    padding: 12px 16px;
                    border-radius: 18px;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                }

                .message.assistant {
                    align-self: flex-start;
                    background-color: var(--bot-message-bg);
                    border-bottom-left-radius: 4px;
                }

                .message.user {
                    align-self: flex-end;
                    background-color: var(--user-message-bg);
                    color: var(--user-message-text);
                    border-bottom-right-radius: 4px;
                }

                .message-content {
                    font-size: 16px;
                    line-height: 1.5;
                }

                .timestamp {
                    font-size: 10px;
                    opacity: 0.6;
                    margin-top: 6px;
                    align-self: flex-end;
                }

                .quick-replies {
                    display: flex;
                    overflow-x: auto;
                    gap: 10px;
                    padding: 10px 20px;
                    background-color: white;
                    border-top: 1px solid #eaeaea;
                    scrollbar-width: none; /* Firefox */
                }

                .quick-replies::-webkit-scrollbar {
                    display: none; /* Chrome, Safari, Opera*/
                }

                .quick-reply-button {
                    white-space: nowrap;
                    padding: 8px 16px;
                    border-radius: 18px;
                    background-color: var(--quickReplyBg);
                    color: var(--quickReplyText);
                    border: none;
                    font-size: 14px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .quick-reply-button:hover {
                    background-color: rgba(66, 133, 244, 0.2);
                }

                /* Typing indicator */
                .typing-indicator {
                    display: flex;
                    gap: 3px;
                    padding: 6px 12px;
                    background-color: var(--bot-message-bg);
                    border-radius: 18px;
                    align-self: flex-start;
                    margin-top: 10px;
                }

                .typing-dot {
                    width: 8px;
                    height: 8px;
                    background-color: #aaa;
                    border-radius: 50%;
                    opacity: 0.7;
                    animation: typing 1s infinite;
                }

                .typing-dot:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .typing-dot:nth-child(3) {
                    animation-delay: 0.4s;
                }

                @media (max-width: 500px) {
                    .chat-container {
                        height: 100vh;
                        border-radius: 0;
                        max-height: 100vh;
                    }

                    .message-list {
                        padding: 10px;
                    }

                    .message {
                        max-width: 85%;
                    }
                }
            `}</style>

            {/* Chat Header */}
            <div className="chat-header">
                <div className="header-main" onClick={onMinimize}>
                    {companyData?.company?.image && (
                        <img src={companyData.company.image} alt={`${companyData.company.name} Logo`} />
                    )}
                    <div>
                        Chat with {companyData?.company?.name || "AI Assistant"}
                    </div>
                </div>
                {/* <button 
                    className="minimize-btn" 
                    onClick={(e) => {
                        e.stopPropagation();
                        onMinimize();
                    }} 
                    aria-label="Minimize chat"
                >−</button> */}
            </div>

            {/* Chat Messages */}
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`message ${msg.sender}`}
                        data-time={formatTime(msg.timestamp)}
                    >
                        {msg.sender === "bot" ? (
                            <CustomMarkdown response={msg.text} />
                        ) : (
                            msg.text
                        )}
                    </div>
                ))}

                {isTyping && (
                    <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Contextual Quick Reply Suggestions */}
            {!isTyping && messages.length > 0 && (
                <div className="quick-replies">
                    {generateContextualReplies(messages, companyId).map((reply, index) => (
                        <button 
                            key={index}
                            className="quick-reply-btn"
                            onClick={() => {
                                setUserInput(reply);
                                setTimeout(() => sendMessage(), 100);
                            }}
                        >
                            {reply}
                        </button>
                    ))}
                </div>
            )}

            {/* Chat Input */}
            <div className="chat-input-container">
                <input
                    className="chat-input"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    ref={inputRef}
                />
                <button 
                    className="chat-send-btn" 
                    onClick={sendMessage}
                    aria-label="Send message"
                    disabled={isTyping}
                >
                    <img src="/assets/icons/paper-plane-solid.svg" alt="Send" className="send-icon" />
                </button>
            </div>
        </div>
    );
}