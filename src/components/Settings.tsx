import React, { useState, useEffect } from 'react';
import { Shield, Bell, HelpCircle, Info, ChevronRight, LogOut, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const isPremium = true;
  const [notifications, setNotifications] = useState(() => localStorage.getItem('notifications_enabled') === 'true');
  const [privateSession, setPrivateSession] = useState(() => localStorage.getItem('private_session_enabled') === 'true');

  useEffect(() => {
    localStorage.setItem('notifications_enabled', notifications.toString());
    if (notifications && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('private_session_enabled', privateSession.toString());
    
    const handleBeforeUnload = () => {
      if (localStorage.getItem('private_session_enabled') === 'true') {
        localStorage.removeItem('temp_mail_account');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [privateSession]);

  const handleLogout = () => {
    localStorage.removeItem('temp_mail_account');
    window.location.href = '/';
    toast.success('Account cleared');
  };

  const handleAboutClick = () => {
    navigate('/about');
  };

  return (
    <div className="p-6 h-full flex flex-col gap-8 overflow-y-auto pb-24 bg-zinc-950">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-zinc-400 text-sm">Manage your preferences and account.</p>
      </div>

      {/* Pro Banner (Free for all) */}
      <Card className="border-none overflow-hidden relative group bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl shadow-blue-500/10">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Star className="w-20 h-20 text-white fill-white" />
        </div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Pro Features Unlocked</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Full Access Enabled</h3>
          <p className="text-blue-100 text-sm opacity-90">Enjoy custom names, no ads, and 1h retention at no cost.</p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">General</h3>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer border-b border-zinc-800"
              onClick={() => setNotifications(!notifications)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-bold">Notifications</p>
                  <p className="text-[10px] text-zinc-500">Alerts for new emails</p>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${notifications ? 'bg-blue-600' : 'bg-zinc-800'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${notifications ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>

            <div 
              className="flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer"
              onClick={() => setPrivateSession(!privateSession)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-bold">Private Session</p>
                  <p className="text-[10px] text-zinc-500">Clear data on exit</p>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${privateSession ? 'bg-blue-600' : 'bg-zinc-800'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${privateSession ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Support</h3>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer border-b border-zinc-800"
              onClick={() => window.open('/help', '_blank')}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-zinc-400" />
                </div>
                <p className="text-sm font-bold">Help Center</p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </div>

            <div 
              className="flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer"
              onClick={handleAboutClick}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center">
                  <Info className="w-5 h-5 text-zinc-400" />
                </div>
                <p className="text-sm font-bold">About TempMail Pro by Antreasch30</p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </div>
          </div>
        </section>

        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full h-14 rounded-2xl border border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400 flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-bold">Reset Account</span>
        </Button>
      </div>

      <div className="text-center pb-4">
        <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em]">Created by Antreasch30 • Version 2.1.0</p>
      </div>
    </div>
  );
}
