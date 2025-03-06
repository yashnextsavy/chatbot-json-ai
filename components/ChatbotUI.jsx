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
                "Do you offer military solutions?",
            ],
            companyIT: [
                "Cloud computing options",
                "Cybersecurity services",
                "AI solutions pricing",
                "Do you offer 24/7 support?",
            ],
            companyPhotography: [
                "Wedding photography rates",
                "Do you do corporate events?",
                "Portrait session details",
                "Drone photography options",
            ],
        };

        // If there are no messages yet, use the defaults
        if (messages.length <= 1) {
            return defaultRepliesByCompany[companyId] || [];
        }

        // Get the last bot message to generate context-aware replies
        const lastBotMessage = [...messages]
            .reverse()
            .find((msg) => msg.sender === "bot");
        if (!lastBotMessage) return defaultRepliesByCompany[companyId] || [];

        // Get the last user message to understand what they've asked
        const lastUserMessage = [...messages]
            .filter((msg) => msg.sender === "user")
            .pop();
        const userQuestion = lastUserMessage
            ? lastUserMessage.text.toLowerCase()
            : "";

        // Generate contextual replies based on the last bot message content
        const content = lastBotMessage.text.toLowerCase();

        // Extract key entities and topics from the content
        const extractKeywords = (text) => {
            const keywords = [
                // Products and services
                "robot",
                "android",
                "drone",
                "security",
                "defense",
                "military",
                "cloud",
                "computing",
                "cyber",
                "cybersecurity",
                "ai",
                "artificial intelligence",
                "photography",
                "wedding",
                "portrait",
                "event",
                "photo",
                "drone photography",
                // Features and attributes
                "price",
                "cost",
                "feature",
                "specification",
                "model",
                "version",
                "customization",
                "maintenance",
                "support",
                "training",
                "design",
                // Business terms
                "contract",
                "service",
                "package",
                "consultation",
                "warranty",
                "guarantee",
            ];

            return keywords.filter((keyword) => text.includes(keyword));
        };

        const botKeywords = extractKeywords(content);
        const userKeywords = lastUserMessage
            ? extractKeywords(userQuestion)
            : [];
        const allKeywords = [...new Set([...botKeywords, ...userKeywords])];

        // Generate company-specific contextual replies
        if (companyId === "companyCyberMech") {
            // Robot-related context
            if (
                allKeywords.some((k) =>
                    ["robot", "android", "humanoid"].includes(k),
                )
            ) {
                // Different follow-ups based on what was mentioned
                if (
                    content.includes("price") ||
                    content.includes("cost") ||
                    userQuestion.includes("how much")
                ) {
                    return [
                        "Can I finance a purchase?",
                        "What's included in the price?",
                        "Are there any discounts for bulk orders?",
                        "How does the cost compare to competitors?",
                    ];
                }
                if (
                    content.includes("feature") ||
                    content.includes("can") ||
                    content.includes("capability")
                ) {
                    return [
                        "Can they recognize faces?",
                        "How long does the battery last?",
                        "Can they operate autonomously?",
                        "How do they handle unexpected situations?",
                    ];
                }
                return [
                    "How much customization is possible?",
                    "What maintenance is required?",
                    "How do they compare to human workers?",
                    "What's your most advanced model?",
                ];
            }

            // Security and defense context
            else if (
                allKeywords.some((k) =>
                    ["security", "defense", "military", "protection"].includes(
                        k,
                    ),
                )
            ) {
                if (
                    content.includes("military") ||
                    content.includes("contract")
                ) {
                    return [
                        "What countries do you work with?",
                        "How do you handle ethical concerns?",
                        "What's your most advanced system?",
                        "Do you have civilian versions?",
                    ];
                }
                return [
                    "How do you prevent hacking?",
                    "Are there any legal restrictions?",
                    "What kind of training is provided?",
                    "Do you offer maintenance plans?",
                ];
            }
        }

        // IT Solutions context-aware replies
        else if (companyId === "companyIT") {
            // Cloud computing context
            if (
                allKeywords.some((k) =>
                    ["cloud", "computing", "server", "data"].includes(k),
                )
            ) {
                if (
                    content.includes("migration") ||
                    content.includes("moving")
                ) {
                    return [
                        "How long does migration typically take?",
                        "What about data security during transition?",
                        "Can you handle legacy systems?",
                        "What's your uptime guarantee?",
                    ];
                }
                return [
                    "What about data migration?",
                    "How does your pricing compare to AWS?",
                    "Do you offer hybrid cloud solutions?",
                    "What compliance certifications do you have?",
                ];
            }

            // Security context
            else if (
                allKeywords.some((k) =>
                    [
                        "security",
                        "cyber",
                        "hack",
                        "breach",
                        "ransomware",
                    ].includes(k),
                )
            ) {
                if (
                    content.includes("breach") ||
                    content.includes("incident")
                ) {
                    return [
                        "What's your response time?",
                        "Do you have a recovery process?",
                        "Do you offer forensic analysis?",
                        "How do you prevent future incidents?",
                    ];
                }
                return [
                    "Do you offer penetration testing?",
                    "What about employee security training?",
                    "How do you handle zero-day threats?",
                    "Do you have 24/7 monitoring?",
                ];
            }
        }

        // Photography context-aware replies
        else if (companyId === "companyPhotography") {
            // Wedding/event context
            if (
                allKeywords.some((k) =>
                    ["wedding", "event", "ceremony", "party"].includes(k),
                )
            ) {
                if (
                    content.includes("package") ||
                    content.includes("price") ||
                    content.includes("cost")
                ) {
                    return [
                        "What's included in your basic package?",
                        "Do you offer video services too?",
                        "Are there any seasonal discounts?",
                        "Do you require a deposit?",
                    ];
                }
                return [
                    "How many photographers attend?",
                    "Do you have backup equipment?",
                    "How quickly do we get the photos?",
                    "Can we create a shot list in advance?",
                ];
            }

            // Portrait context
            else if (
                allKeywords.some((k) =>
                    ["portrait", "session", "headshot", "family"].includes(k),
                )
            ) {
                if (
                    content.includes("location") ||
                    content.includes("studio")
                ) {
                    return [
                        "Do you charge extra for outdoor locations?",
                        "How many locations in one session?",
                        "Can we bring pets to the shoot?",
                        "What about bad weather backup plans?",
                    ];
                }
                return [
                    "Do you provide makeup services?",
                    "How many outfit changes are allowed?",
                    "Do you edit all the photos?",
                    "Can we purchase additional images later?",
                ];
            }
        }

        // If the conversation has progressed but no specific context is detected
        if (messages.length > 3) {
            return [
                "Tell me more about that",
                "Can you provide specific examples?",
                "What are the advantages of this?",
                "How does this compare to alternatives?",
            ];
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
                            timestamp: new Date().toISOString(),
                        },
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
                const localMessages = localStorage.getItem(
                    `messages_${storedConversationId}`,
                );
                if (localMessages) {
                    const parsedMessages = JSON.parse(localMessages);
                    if (parsedMessages.length > 0) {
                        setMessages(parsedMessages);
                    }
                }

                // Then try to get from API
                const res = await fetch(
                    `/api/getConversation?conversationId=${storedConversationId}`,
                );
                const data = await res.json();

                if (data.messages && data.messages.length > 0) {
                    // Add timestamps if they don't exist
                    const messagesWithTimestamps = data.messages.map((msg) => {
                        if (!msg.timestamp) {
                            return {
                                ...msg,
                                timestamp: new Date().toISOString(),
                            };
                        }
                        return msg;
                    });
                    setMessages(messagesWithTimestamps);
                    // Update local storage
                    localStorage.setItem(
                        `messages_${storedConversationId}`,
                        JSON.stringify(messagesWithTimestamps),
                    );
                }
            } catch (error) {
                console.error("Error fetching conversation history:", error);
                // Try to load from local storage if API fails
                const localMessages = localStorage.getItem(
                    `messages_${storedConversationId}`,
                );
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
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const sendMessage = async () => {
        if (!userInput.trim()) return;

        const timestamp = new Date().toISOString();
        const newMessages = [
            ...messages,
            { sender: "user", text: userInput, timestamp },
        ];
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
            localStorage.setItem(
                `messages_${conversationId}`,
                JSON.stringify(newMessages),
            );

            const saveData = await saveResponse.json();
            if (saveData.error) {
                console.warn(
                    "Server error saving conversation, using local storage:",
                    saveData.error,
                );
            }
        } catch (error) {
            console.error("Error saving conversation:", error);
            // Fallback to localStorage
            localStorage.setItem(
                `messages_${conversationId}`,
                JSON.stringify(newMessages),
            );
        }

        try {
            // Get the last few messages for context (limit to last 6 to avoid token limits)
            const contextMessages = messages.slice(-6);

            const res = await fetch("/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userInput,
                    companyId,
                    conversationHistory: contextMessages,
                }),
            });
            console.log("res", res);
            const data = await res.json();

            setIsTyping(false);
            if (data.reply) {
                const botTimestamp = new Date().toISOString();
                // Extract key topics from the bot's reply for future context
                const keyPhrases =
                    data.reply
                        .toLowerCase()
                        .match(
                            /(?:robot|android|security|cloud|computing|cyber|wedding|event|portrait|session|price|cost|rate)/g,
                        ) || [];

                const updatedMessages = [
                    ...newMessages,
                    {
                        sender: "bot",
                        text: data.reply,
                        timestamp: botTimestamp,
                        keyPhrases: Array.from(new Set(keyPhrases)), // Store unique key phrases for context
                    },
                ];
                setMessages(updatedMessages);

                try {
                    const saveResponse = await fetch("/api/saveConversation", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            conversationId,
                            messages: updatedMessages,
                        }),
                    });

                    // Always save to localStorage as a backup
                    localStorage.setItem(
                        `messages_${conversationId}`,
                        JSON.stringify(updatedMessages),
                    );

                    const saveData = await saveResponse.json();
                    if (saveData.error) {
                        console.warn(
                            "Server error saving bot response, using local storage:",
                            saveData.error,
                        );
                    }
                } catch (error) {
                    console.error("Error saving bot response:", error);
                    // Fallback to localStorage
                    localStorage.setItem(
                        `messages_${conversationId}`,
                        JSON.stringify(updatedMessages),
                    );
                }
            }
        } catch (error) {
            setIsTyping(false);
            console.error("Error fetching chatbot reply:", error);
            // Show error message to user
            const errorMessages = [
                ...newMessages,
                {
                    sender: "bot",
                    text: "I'm having trouble connecting right now. Please try again later.",
                    timestamp: new Date().toISOString(),
                },
            ];
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
        const metaViewport = document.createElement("meta");
        metaViewport.name = "viewport";
        metaViewport.content =
            "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
        document.head.appendChild(metaViewport);

        // Add touch event listeners
        document.addEventListener("touchmove", preventZoom, { passive: false });

        return () => {
            document.removeEventListener("touchmove", preventZoom);
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
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
                    background-color: #fff;
                    transition: all 0.3s ease;
                }

                .chat-header {
                    display: flex;
                    align-items: center;
                    padding: 18px 24px;
                    background: linear-gradient(135deg, #4285f4, #0d47a1);
                    color: white;
                    font-weight: 600;
                    justify-content: space-between;
                    position: relative;
                    overflow: hidden;
                }

                .chat-header::after {
                    content: "";
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(
                        circle,
                        rgba(255, 255, 255, 0.1) 0%,
                        transparent 70%
                    );
                    opacity: 0.6;
                    transform: rotate(30deg);
                }

                .chat-header-left {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    position: relative;
                    z-index: 2;
                }

                .chat-header img {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    object-fit: cover;
                    background-color: white;
                    border: 2px solid rgba(255, 255, 255, 0.7);
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                    transition: transform 0.2s ease;
                }

                .chat-header img:hover {
                    transform: scale(1.05);
                }

                .status-indicator {
                    width: 10px;
                    height: 10px;
                    background-color: #4caf50;
                    border-radius: 50%;
                    margin-left: 5px;
                    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 6px rgba(76, 175, 80, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
                    }
                }

                .minimize-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 5px 10px;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                    position: relative;
                    z-index: 2;
                }

                .minimize-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-2px);
                }

                .message-list {
                    padding: 24px;
                    overflow-y: auto;
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                    background-color: #f5f7fa;
                    background-image: radial-gradient(
                            circle at 25px 25px,
                            rgba(0, 0, 0, 0.01) 2%,
                            transparent 0%
                        ),
                        radial-gradient(
                            circle at 75px 75px,
                            rgba(0, 0, 0, 0.01) 2%,
                            transparent 0%
                        );
                    background-size: 100px 100px;
                    scrollbar-width: thin;
                }

                .message-list::-webkit-scrollbar {
                    width: 6px;
                }

                .message-list::-webkit-scrollbar-thumb {
                    background-color: rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                }

                .message-list::-webkit-scrollbar-track {
                    background: transparent;
                }

                .message-input-container {
                    display: flex;
                    align-items: center;
                    padding: 16px 24px;
                    border-top: 1px solid rgba(0, 0, 0, 0.05);
                    background-color: white;
                    position: relative;
                    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.03);
                }

                .message-input {
                    flex-grow: 1;
                    border: 1px solid #e1e4e8;
                    border-radius: 24px;
                    padding: 14px 24px;
                    outline: none;
                    transition: all 0.3s ease;
                    font-size: 16px;
                    background-color: #f8f9fa;
                    padding-right: 50px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                }

                .message-input:focus {
                    border-color: #4285f4;
                    box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.15);
                    background-color: #fff;
                    transform: translateY(-1px);
                }

                .send-button {
                    background: linear-gradient(135deg, #4285f4, #0d47a1);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 42px;
                    height: 42px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    position: absolute;
                    right: 28px;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
                    overflow: hidden;
                    transform: translateZ(0);
                }

                .send-button::before {
                    content: "";
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(
                        circle,
                        rgba(255, 255, 255, 0.3) 0%,
                        transparent 70%
                    );
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .send-button:hover::before {
                    opacity: 1;
                }

                .send-button:hover {
                    transform: translateY(-2px) scale(1.05);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    background: linear-gradient(135deg, #0d47a1, #4285f4);
                }

                .send-button:active {
                    transform: translateY(0) scale(0.95);
                }

                .message {
                    max-width: 75%;
                    padding: 14px 20px;
                    border-radius: 18px;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                    transition: transform 0.2s ease;
                    animation: messageAppear 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                @keyframes messageAppear {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .message:hover {
                    transform: translateY(-1px);
                }

                .message.assistant {
                    align-self: flex-start;
                    background-color: white;
                    border-bottom-left-radius: 4px;
                    color: #333;
                    border: 1px solid rgba(0, 0, 0, 0.05);
                }

                .message.user {
                    align-self: flex-end;
                    background: linear-gradient(135deg, #4285f4, #0d47a1);
                    color: white;
                    border-bottom-right-radius: 4px;
                }

                .message-content {
                    font-size: 16px;
                    line-height: 1.6;
                }

                .timestamp {
                    font-size: 10px;
                    opacity: 0.6;
                    margin-top: 8px;
                    align-self: flex-end;
                }

                .quick-replies {
                    display: flex;
                    overflow-x: auto;
                    gap: 10px;
                    padding: 12px 24px;
                    background-color: white;
                    border-top: 1px solid rgba(0, 0, 0, 0.05);
                    scrollbar-width: none;
                    -webkit-overflow-scrolling: touch;
                }

                .quick-replies::-webkit-scrollbar {
                    display: none;
                }

                .quick-reply-button {
                    white-space: nowrap;
                    padding: 10px 18px;
                    border-radius: 20px;
                    background-color: #e8f0fe;
                    color: #4285f4;
                    border: none;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                }

                .quick-reply-button:hover {
                    background-color: #d2e3fc;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .quick-reply-button:active {
                    transform: translateY(0);
                }

                /* Typing indicator */
                .typing-indicator {
                    display: flex;
                    gap: 4px;
                    padding: 10px 16px;
                    background-color: white;
                    border-radius: 18px;
                    align-self: flex-start;
                    margin-top: 10px;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                }

                .typing-dot {
                    width: 8px;
                    height: 8px;
                    background-color: #4285f4;
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

                @keyframes typing {
                    0%,
                    100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-5px);
                    }
                }

                @media (max-width: 500px) {
                    .chat-container {
                        height: 100vh;
                        border-radius: 0;
                        max-height: 100vh;
                    }

                    .message-list {
                        padding: 16px;
                    }

                    .message {
                        max-width: 85%;
                    }

                    .chat-header {
                        padding: 16px 20px;
                    }

                    .message-input-container {
                        padding: 12px 16px;
                    }

                    .quick-replies {
                        padding: 10px 16px;
                    }
                }
            `}</style>

            {/* Chat Header */}
            <div className="chat-header">
                <div className="header-main" onClick={onMinimize}>
                    {companyData?.company?.image && (
                        <img
                            src={companyData.company.image}
                            alt={`${companyData.company.name} Logo`}
                        />
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
                    {generateContextualReplies(messages, companyId).map(
                        (reply, index) => (
                            <button
                                key={index}
                                className="quick-reply-button"
                                onClick={() => {
                                    setUserInput(reply);
                                    // Immediately send the message after setting input
                                    setTimeout(() => sendMessage(), 50);
                                }}
                            >
                                {reply}
                            </button>
                        ),
                    )}
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
                    <img
                        src="/assets/icons/paper-plane-solid.svg"
                        alt="Send"
                        className="send-icon"
                    />
                </button>
            </div>
        </div>
    );
}
