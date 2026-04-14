import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Mail, Home, Settings, Inbox } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
export default function Layout() {
  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
          {/* Header */}
          <header className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">TempMail <span className="text-blue-500">Pro</span></h1>
            </div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Created by Antreasch30</span>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-hidden relative">
            <Outlet />
          </main>

          {/* Bottom Navigation */}
          <nav className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-md flex justify-around items-center">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-blue-500' : 'text-zinc-500 hover:text-zinc-300'}`
              }
            >
              <Home className="w-6 h-6" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Home</span>
            </NavLink>
            <NavLink 
              to="/inbox" 
              className={({ isActive }) => 
                `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-blue-500' : 'text-zinc-500 hover:text-zinc-300'}`
              }
            >
              <Inbox className="w-6 h-6" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Inbox</span>
            </NavLink>
            <NavLink 
              to="/settings" 
              className={({ isActive }) => 
                `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-blue-500' : 'text-zinc-500 hover:text-zinc-300'}`
              }
            >
              <Settings className="w-6 h-6" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Settings</span>
            </NavLink>
          </nav>

          <Toaster position="top-center" theme="dark" />
        </div>
      </TooltipProvider>
  );
}
