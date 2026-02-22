import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import AICompanionPanel from "@/components/ai/AICompanionPanel";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-14 md:pb-0">
        {children}
      </main>
      <AICompanionPanel />
      <BottomNav />
    </div>
  );
}
