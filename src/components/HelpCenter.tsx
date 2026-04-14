import React, { useState } from 'react';
import { 
  Search, 
  ChevronLeft, 
  Mail, 
  HelpCircle, 
  Info, 
  Zap, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  MessageSquare,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const FAQ_DATA = [
  {
    id: 'what-is',
    icon: <Info className="w-5 h-5 text-blue-500" />,
    title: "What is TempMail Pro?",
    content: "TempMail Pro is a temporary email generator service that provides you with a disposable email address. It's designed to help you avoid spam, protect your primary email from data breaches, and maintain your privacy when signing up for new services or testing websites."
  },
  {
    id: 'how-to',
    icon: <Zap className="w-5 h-5 text-yellow-500" />,
    title: "How to Use the App",
    content: (
      <ol className="list-decimal list-inside space-y-2">
        <li>Open the app to see your auto-generated email address.</li>
        <li>Click the <strong>Copy</strong> button to save it to your clipboard.</li>
        <li>Use the address on any website or service.</li>
        <li>Go to the <strong>Inbox</strong> tab to receive and read emails instantly.</li>
      </ol>
    )
  },
  {
    id: 'inbox-guide',
    icon: <Mail className="w-5 h-5 text-green-500" />,
    title: "Inbox Guide",
    content: (
      <ul className="list-disc list-inside space-y-2">
        <li>Emails appear automatically in your inbox as they arrive.</li>
        <li>If you're expecting an email that hasn't appeared, use the <strong>Refresh</strong> button.</li>
        <li>Note: Some services may block temporary email domains. If an email never arrives, try generating a new address on a different domain.</li>
      </ul>
    )
  },
  {
    id: 'timer',
    icon: <Clock className="w-5 h-5 text-purple-500" />,
    title: "Expiration Timer",
    content: "Every temporary email has an expiration period. The timer on the home screen shows how much time is left. Once the timer reaches zero, the email is automatically deleted and a new one is generated. Generating a new email manually also resets the timer."
  },
  {
    id: 'privacy',
    icon: <ShieldCheck className="w-5 h-5 text-cyan-500" />,
    title: "Privacy & Security",
    content: (
      <ul className="list-disc list-inside space-y-2">
        <li><strong>No Personal Data:</strong> We never ask for your name, phone number, or real email.</li>
        <li><strong>Auto-Deletion:</strong> All emails and accounts are temporary and are permanently deleted after expiration.</li>
        <li><strong>Anonymous Use:</strong> Your activity is not tracked, making it safe for anonymous browsing and signups.</li>
      </ul>
    )
  },
  {
    id: 'problems',
    icon: <AlertCircle className="w-5 h-5 text-red-500" />,
    title: "Common Problems & Fixes",
    content: (
      <div className="space-y-3">
        <div>
          <p className="font-bold text-sm">Not receiving emails?</p>
          <p className="text-xs text-zinc-400">Try refreshing the inbox or check if the service you're using blocks disposable emails.</p>
        </div>
        <div>
          <p className="font-bold text-sm">Email expired too soon?</p>
          <p className="text-xs text-zinc-400">Emails are temporary by design. If you need a new address, you can reset it at any time from the home screen.</p>
        </div>
        <div>
          <p className="font-bold text-sm">Blocked domain?</p>
          <p className="text-xs text-zinc-400">Some websites maintain blacklists. Use the "New Email" button to try a different domain.</p>
        </div>
      </div>
    )
  }
];

export default function HelpCenter() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFaqs = FAQ_DATA.filter(faq => 
    faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (typeof faq.content === 'string' && faq.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Header */}
      <header className="px-6 py-6 bg-gradient-to-b from-blue-900/20 to-transparent border-b border-zinc-900">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-full bg-zinc-900/50 hover:bg-zinc-800"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Help Center</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input 
            placeholder="Search for help..." 
            className="pl-10 bg-zinc-900/50 border-zinc-800 h-12 rounded-xl focus:ring-blue-500/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6 pb-12">
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
            <p className="text-sm text-zinc-400">Find quick answers to common questions about TempMail Pro.</p>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq) => (
              <Card 
                key={faq.id} 
                className={`bg-zinc-900 border-zinc-800 overflow-hidden transition-all ${expandedId === faq.id ? 'ring-1 ring-blue-500/50' : ''}`}
              >
                <button 
                  className="w-full text-left p-4 flex items-center justify-between gap-4"
                  onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center">
                      {faq.icon}
                    </div>
                    <span className="font-bold text-sm">{faq.title}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${expandedId === faq.id ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {expandedId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 pb-4 pt-0 text-sm text-zinc-400 border-t border-zinc-800/50 mt-2 pt-4">
                        {faq.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-500">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>

          {/* Contact Support */}
          <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 mt-8">
            <CardContent className="p-6 flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Still need help?</h3>
                <p className="text-xs text-zinc-400">Our support team is available 24/7 to assist you with any issues.</p>
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                onClick={() => window.location.href = 'mailto:support@tempmailpro.com'}
              >
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Footer */}
      <footer className="p-6 border-t border-zinc-900 bg-zinc-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
            <Mail className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-bold tracking-tight">TempMail Pro</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="text-[10px] text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">Terms</a>
          <a href="#" className="text-[10px] text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">Privacy</a>
        </div>
      </footer>
    </div>
  );
}
