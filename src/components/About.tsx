import React from 'react';
import { ChevronLeft, Mail, Shield, Zap, Heart, Globe, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="px-6 py-8 bg-gradient-to-b from-blue-900/20 to-transparent border-b border-zinc-900">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-full bg-zinc-900/50 hover:bg-zinc-800"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">About TempMail Pro</h1>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-2xl mx-auto w-full space-y-12 pb-24">
        {/* Hero Section */}
        <section className="text-center space-y-4 pt-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-6"
          >
            <Mail className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold tracking-tight">TempMail Pro</h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            The ultimate solution for temporary, secure, and disposable email addresses. 
            Protect your privacy and keep your primary inbox clean from spam.
          </p>
        </section>

        {/* Creator Section */}
        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
          <CardContent className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
              <User className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Created by Antreasch30</h3>
              <p className="text-sm text-zinc-500 uppercase tracking-widest">Lead Developer & Designer</p>
            </div>
            <p className="text-zinc-400 text-sm max-w-md">
              TempMail Pro was built with a focus on speed, simplicity, and user privacy. 
              Antreasch30 designed this tool to provide a premium experience for everyone, 
              ensuring that high-quality privacy tools are accessible to all.
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-3">
            <Shield className="w-6 h-6 text-green-500" />
            <h4 className="font-bold">Privacy First</h4>
            <p className="text-xs text-zinc-500">No personal data required. Your temporary emails are deleted automatically.</p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-3">
            <Zap className="w-6 h-6 text-yellow-500" />
            <h4 className="font-bold">Instant Setup</h4>
            <p className="text-xs text-zinc-500">Generate a new address in seconds and start receiving emails immediately.</p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-3">
            <Globe className="w-6 h-6 text-blue-500" />
            <h4 className="font-bold">Global Reach</h4>
            <p className="text-xs text-zinc-500">Works with almost any service that requires email verification.</p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-3">
            <Heart className="w-6 h-6 text-red-500" />
            <h4 className="font-bold">100% Free</h4>
            <p className="text-xs text-zinc-500">All premium features are unlocked for all users, forever.</p>
          </div>
        </div>

        {/* Mission Statement */}
        <section className="space-y-4 text-center border-t border-zinc-900 pt-12">
          <h3 className="text-lg font-bold">Our Mission</h3>
          <p className="text-sm text-zinc-500 leading-relaxed">
            In an era of increasing digital tracking and data breaches, TempMail Pro aims to give 
            power back to the user. We believe that your primary email address is a key to your 
            digital identity and should be protected at all costs.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="p-8 border-t border-zinc-900 bg-zinc-950 text-center">
        <p className="text-[10px] text-zinc-600 uppercase tracking-[0.3em]">
          © 2026 TempMail Pro • Built by Antreasch30
        </p>
      </footer>
    </div>
  );
}
