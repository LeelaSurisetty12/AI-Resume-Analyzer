import { useState, useRef, useEffect } from "react";
import { MessageSquareText, Send, User, Bot, Loader2, FileText } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useAuth } from "../../features/auth/AuthContext";

function ResumeChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resumeId, setResumeId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch the user's latest resume ID
  useEffect(() => {
    const fetchLatestResume = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/resume/latest?user_id=${user?.uid || "anonymous"}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.id) {
            setResumeId(data.id);
          }
        }
      } catch (e) {
        console.error("Failed to fetch latest resume", e);
      }
    };
    fetchLatestResume();
  }, [user]);

  // Fetch chat history for the loaded resume
  useEffect(() => {
    if (!resumeId) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat/history/${resumeId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages);
          } else {
            // Default welcome message if no history
            setMessages([
              { role: "assistant", content: "Hi! I'm your AI Resume Assistant. I've read your latest uploaded resume. What would you like to know?" }
            ]);
          }
        }
      } catch (e) {
        console.error("Failed to fetch chat history", e);
      }
    };
    fetchHistory();
  }, [resumeId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !resumeId) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume_id: resumeId,
          message: input
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      } else {
        const errorData = await response.json();
        setMessages([...newMessages, { role: "assistant", content: `Error: ${errorData.detail || "Something went wrong"}` }]);
      }
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: `Network Error: ${e.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <MessageSquareText className="w-6 h-6 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Resume Chat</h1>
          <p className="text-gray-400">Ask questions about your uploaded resume</p>
        </div>
      </div>

      {!resumeId ? (
        <Card className="flex flex-col items-center justify-center flex-1 p-8 text-center border-dashed">
          <FileText className="w-12 h-12 text-gray-500 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No Resume Found</h2>
          <p className="text-gray-400 mb-6 max-w-md">
            You need to upload and analyze a resume before you can chat with it. Head over to the Upload section to get started.
          </p>
        </Card>
      ) : (
        <Card className="flex flex-col flex-1 overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-emerald-500" : "bg-gray-700"}`}>
                  {msg.role === "user" ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-emerald-400" />}
                </div>
                <div className={`flex flex-col max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`p-4 rounded-2xl ${msg.role === "user" ? "bg-emerald-500 text-white rounded-tr-none" : "bg-gray-800/50 text-gray-200 border border-white/5 rounded-tl-none"}`}>
                    <p className="whitespace-pre-wrap text-[15px]">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="p-4 rounded-2xl bg-gray-800/50 border border-white/5 rounded-tl-none flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span className="text-gray-400 text-sm">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-gray-900/50">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="E.g., What are my strongest skills?"
                className="flex-1 px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()} className="px-6 rounded-xl">
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </div>
  );
}

export default ResumeChat;
