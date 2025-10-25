import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const sampleMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm your FinNexus AI companion. I can help you analyze spending patterns, plan goals, and optimize your financial health. What would you like to explore?",
    timestamp: new Date(),
  },
];

export default function AICompanionPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm analyzing your request. This is a demo response. In the full version, I'll provide detailed insights about your finances, spending patterns, and personalized recommendations.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-primary shadow-glow-md flex items-center justify-center z-50 hover:shadow-glow-lg transition-shadow"
          >
            <MessageSquare className="w-6 h-6 text-primary-foreground" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-[400px] bg-sidebar border-l border-sidebar-border flex flex-col z-50"
          >
            {/* Header */}
            <div className="h-16 px-4 flex items-center justify-between border-b border-sidebar-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-secondary flex items-center justify-center shadow-glow-secondary">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground">AI Companion</h3>
                  <p className="text-xs text-success flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "glass-card text-foreground rounded-bl-md"
                    )}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Suggestions */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
              {["Spending analysis", "Goal progress", "Budget tips"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="px-3 py-1.5 text-xs rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors whitespace-nowrap"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-sidebar-border">
              <div className="flex items-center gap-2 glass-card rounded-xl px-4 py-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground h-8 w-8"
                >
                  <Mic className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="h-8 w-8 rounded-lg bg-gradient-primary hover:opacity-90 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
