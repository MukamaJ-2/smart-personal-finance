import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Mic, Sparkles, TrendingUp, Target, Zap, BarChart3, Lightbulb } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const quickActions = [
  { icon: TrendingUp, label: "Spending Analysis", query: "Analyze my spending patterns this month" },
  { icon: Target, label: "Goal Progress", query: "Show me my goal progress and recommendations" },
  { icon: Zap, label: "Budget Tips", query: "Give me tips to optimize my budget" },
  { icon: BarChart3, label: "Financial Health", query: "What's my current financial health score?" },
];

const sampleMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm your FinNexus AI companion. I can help you analyze spending patterns, plan goals, optimize your budget, and provide personalized financial insights. What would you like to explore?",
    timestamp: new Date(),
    suggestions: ["Spending analysis", "Goal progress", "Budget tips"],
  },
];

export default function Companion() {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "spending": "Based on your recent transactions, I notice you've spent ₹45,000 on essentials this month, which is 56% of your allocated budget. Your dining expenses are trending up by 15% compared to last month. Consider setting up alerts for the 'Dining Out' flux pod.",
        "goal": "You're making excellent progress! Your Emergency Fund is at 82% completion with 14 days remaining. At your current contribution rate, you'll reach the target on time. Your Japan Trip goal needs attention - you're at 34% with only 80 days left. I recommend increasing monthly contributions to ₹55,000.",
        "budget": "Here are 3 budget optimization tips:\n1. Your Entertainment pod is at 83% capacity - consider pausing some subscriptions\n2. Transport expenses are well-managed at 40% usage\n3. You could save ₹5,000/month by reducing dining out frequency by 20%",
        "health": "Your financial health score is 87/100 - Excellent! 🎉\n\nStrengths:\n• Strong savings rate (28%)\n• Most goals on track\n• Healthy emergency fund\n\nAreas to improve:\n• Reduce entertainment spending\n• Optimize dining expenses",
      };

      const lowerInput = input.toLowerCase();
      let response = "I'm analyzing your request. Based on your financial data, I can provide insights and recommendations. Would you like me to dive deeper into any specific area?";

      if (lowerInput.includes("spending") || lowerInput.includes("expense")) {
        response = responses["spending"];
      } else if (lowerInput.includes("goal") || lowerInput.includes("target")) {
        response = responses["goal"];
      } else if (lowerInput.includes("budget") || lowerInput.includes("tip")) {
        response = responses["budget"];
      } else if (lowerInput.includes("health") || lowerInput.includes("score")) {
        response = responses["health"];
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        suggestions: ["Tell me more", "Show details", "Set up alerts"],
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (query: string) => {
    setInput(query);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <AppLayout>
      <div className="min-h-screen p-6 flex flex-col max-w-5xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-secondary flex items-center justify-center shadow-glow-secondary">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                AI Companion
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Your intelligent financial advisor
              </p>
            </div>
            <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-mono text-foreground">Online</span>
            </div>
          </div>
        </motion.header>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
        >
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => handleQuickAction(action.query)}
                className="glass-card rounded-xl p-4 hover:glass-card-glow transition-all group text-left"
              >
                <div className="p-2 rounded-lg bg-primary/10 w-fit mb-2 group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs font-medium text-foreground">{action.label}</p>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Chat Area */}
        <div className="flex-1 glass-card rounded-2xl overflow-hidden flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted/50 text-foreground rounded-bl-md"
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium text-primary">AI Assistant</span>
                      </div>
                    )}
                    <p className="whitespace-pre-line">{message.content}</p>
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.suggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => handleQuickAction(suggestion)}
                            className="px-3 py-1.5 text-xs rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-muted/50 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0s" }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 glass-card rounded-xl px-4 py-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Ask me anything about your finances..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                disabled={isTyping}
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground h-8 w-8"
                disabled={isTyping}
                onClick={() => {
                  toast({
                    title: "Voice input",
                    description: "Voice input for AI companion will be available soon.",
                  });
                }}
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="h-8 w-8 rounded-lg bg-gradient-primary hover:opacity-90 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              <Lightbulb className="w-3 h-3 inline mr-1" />
              Try: "How can I save more?" or "Analyze my spending"
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

