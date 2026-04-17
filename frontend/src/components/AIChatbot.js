import React, { useState } from "react";
import axios from "axios";

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false); // ✅ toggle
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", text: input };
        setMessages(prev => [...prev, userMessage]);

        setLoading(true);

        try {
            const res = await axios.post(
                "http://localhost:5000/api/ai/chat",
                { message: input }
            );

            const botMessage = {
                role: "bot",
                text: res.data.reply || "No response"
            };

            setMessages(prev => [...prev, botMessage]);

        } catch (err) {
            setMessages(prev => [
                ...prev,
                { role: "bot", text: "Error: Unable to connect AI" }
            ]);
        }

        setInput("");
        setLoading(false);
    };

    return (
        <>
            {/* 💬 Floating Button */}
            <div
    onClick={() => setIsOpen(!isOpen)}
    style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: "50%",
        background: "#1976d2",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 26,
        cursor: "pointer",
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        zIndex: 999,
        transition: "all 0.3s ease",   // ✅ smooth
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
    onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.9)"} // click effect
    onMouseUp={(e) => e.currentTarget.style.transform = "scale(1.1)"}
>
    🤖
</div>

            {/* 📦 Chat Window */}
            {isOpen && (
                <div style={{
    position: "fixed",
    bottom: 90,
    right: 20,
    width: 320,
    height: 400,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    zIndex: 999,
    transform: isOpen ? "translateY(0)" : "translateY(20px)",
    opacity: isOpen ? 1 : 0,
    transition: "all 0.3s ease"
}}>
                    
                    {/* Header */}
                    <div style={{
                        background: "#1976d2",
                        color: "#fff",
                        padding: 10,
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "space-between"
                    }}>
                        AI Assistant
                        <span
                            style={{ cursor: "pointer" }}
                            onClick={() => setIsOpen(false)}
                        >
                            ✖
                        </span>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        padding: 10,
                        overflowY: "auto",
                        fontSize: 14
                    }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{
                                textAlign: m.role === "user" ? "right" : "left",
                                marginBottom: 8
                            }}>
                                <span style={{
                                    background: m.role === "user" ? "#1976d2" : "#e5e7eb",
                                    color: m.role === "user" ? "#fff" : "#000",
                                    padding: "6px 10px",
                                    borderRadius: 8,
                                    display: "inline-block"
                                }}>
                                    {m.text}
                                </span>
                            </div>
                        ))}

                        {loading && <div>Typing...</div>}
                    </div>

                    {/* Input */}
<div style={{ display: "flex", borderTop: "1px solid #ddd" }}>
    <input
        style={{
            flex: 1,
            padding: 10,
            border: "none",
            outline: "none",
            fontSize: 14
        }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something..."
        
        // ✅ ENTER KEY SUPPORT
        onKeyDown={(e) => {
            if (e.key === "Enter") {
                sendMessage();
            }
        }}
    />

    <button
        onClick={sendMessage}
        style={{
            background: "#1976d2",
            color: "#fff",
            border: "none",
            padding: "0 15px",
            cursor: "pointer",
            transition: "all 0.2s ease"
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
        onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
    >
        Send
    </button>
</div>
                </div>
            )}
        </>
    );
}