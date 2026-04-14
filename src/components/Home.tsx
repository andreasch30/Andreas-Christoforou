import React, { useState, useEffect, useCallback } from 'react';
import { Copy, RefreshCw, Timer, CheckCircle2, ShieldCheck, Zap, AlertTriangle, Info, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { mailApi, Domain } from '@/src/services/mailApi';
import { motion, AnimatePresence } from 'motion/react';

const MAX_TIME = 3600; // 1 hour

export default function Home() {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(MAX_TIME);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [copied, setCopied] = useState(false);
  const [customName, setCustomName] = useState('');

  const maxTime = MAX_TIME;

  const generateEmail = useCallback(async (preferredDomain?: string, name?: string) => {
    setLoading(true);
    try {
      let availableDomains = domains;
      if (availableDomains.length === 0) {
        availableDomains = await mailApi.getDomains();
        setDomains(availableDomains);
      }

      const selectedDomain = preferredDomain || 
                             availableDomains.find(d => d.domain === 'antreasch30.com')?.domain || 
                             availableDomains[0].domain;
      
      const emailName = name || Math.random().toString(36).substring(2, 10);
      const address = `${emailName}@${selectedDomain}`;
      const password = Math.random().toString(36).substring(2, 15);

      await mailApi.createAccount(address, password);
      const token = await mailApi.getToken(address, password);
      
      const accountData = { address, password, token, createdAt: Date.now() };
      localStorage.setItem('temp_mail_account', JSON.stringify(accountData));
      setEmail(address);
      setTimeLeft(maxTime);
      toast.success(`New email generated on ${selectedDomain}`);
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 422) {
        toast.error('This name or domain might not be available right now.');
      } else {
        toast.error('Failed to generate email');
      }
    } finally {
      setLoading(false);
    }
  }, [domains, maxTime]);

  useEffect(() => {
    const saved = localStorage.getItem('temp_mail_account');
    if (saved) {
      const data = JSON.parse(saved);
      setEmail(data.address);
      mailApi.setToken(data.token);
      
      const elapsed = Math.floor((Date.now() - data.createdAt) / 1000);
      const remaining = Math.max(0, maxTime - elapsed);
      setTimeLeft(remaining);

      if (remaining === 0) {
        generateEmail();
      }
    } else {
      generateEmail();
    }
  }, [generateEmail, maxTime]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          generateEmail();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, generateEmail]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    toast.success('Email copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    if (timeLeft > maxTime * 0.5) return 'bg-green-500';
    if (timeLeft > maxTime * 0.2) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (timeLeft > maxTime * 0.2) return 'Active';
    if (timeLeft > 0) return 'Expiring Soon';
    return 'Expired';
  };

  const handleCustomEmail = () => {
    if (!customName || customName.length < 3) {
      toast.error('Name must be at least 3 characters');
      return;
    }
    const sanitized = customName.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    generateEmail(undefined, sanitized);
  };

  const usability = email ? (email.split('@')[1] === 'antreasch30.com' ? { label: 'Likely Works', color: 'text-green-500', icon: <CheckCircle2 className="w-3 h-3" /> } : { label: 'May Be Blocked', color: 'text-yellow-500', icon: <AlertTriangle className="w-3 h-3" /> }) : { label: 'Unknown', color: 'text-zinc-500', icon: <Info className="w-3 h-3" /> };

  return (
    <div className="p-6 h-full flex flex-col gap-6 overflow-y-auto pb-24">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">TempMail <span className="text-blue-500">Pro</span></h2>
          <p className="text-zinc-400 text-sm">Disposable email for your privacy.</p>
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden relative shadow-2xl shadow-blue-500/5">
        <div className={`absolute top-0 left-0 w-full h-1 transition-colors duration-500 ${getStatusColor()}`}></div>
        <CardContent className="p-8 flex flex-col items-center gap-6">
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${getStatusColor()}`}></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{getStatusText()}</span>
              </div>
              <div className={`flex items-center gap-1.5 ${usability.color}`}>
                {usability.icon}
                <span className="text-[10px] font-bold uppercase tracking-widest">{usability.label}</span>
              </div>
            </div>
            
            <div className="relative group">
              <div className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 transition-all group-hover:border-blue-500/30">
                <span className="text-xl sm:text-2xl font-mono font-bold tracking-tight truncate w-full text-center">
                  {loading ? 'Generating...' : email}
                </span>
                <div className="flex items-center gap-2 text-zinc-500 text-xs">
                  <Timer className="w-3 h-3" />
                  <span>Expires in {formatTime(timeLeft)}</span>
                </div>
              </div>
              <AnimatePresence>
                {copied && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute inset-0 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold z-10"
                  >
                    <CheckCircle2 className="w-6 h-6 mr-2" />
                    COPIED!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Button 
              onClick={copyToClipboard}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-2xl text-lg font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
            >
              <Copy className="w-5 h-5 mr-2" />
              Copy Email Address
            </Button>
            
            <div className="flex gap-3">
              <Button 
                onClick={() => generateEmail()} 
                disabled={loading}
                variant="outline"
                className="flex-1 border-zinc-800 hover:bg-zinc-800 h-12 rounded-xl font-bold"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Reset Email
              </Button>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        localStorage.removeItem('temp_mail_account');
                        generateEmail();
                      }}
                      className="border-zinc-800 hover:bg-red-500/10 hover:text-red-500 h-12 w-12 rounded-xl"
                    />
                  }
                >
                  <Trash2 className="w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-900 border-zinc-800 text-white">
                  <p>Clear all data and start fresh</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="w-full space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              <span>Session Progress</span>
              <span>{Math.round((timeLeft / maxTime) * 100)}%</span>
            </div>
            <Progress value={(timeLeft / maxTime) * 100} className="h-1.5 bg-zinc-800" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Custom Email Name</h3>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input 
              placeholder="your-name" 
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="bg-zinc-900 border-zinc-800 h-12 rounded-xl pl-4 pr-10 font-mono"
            />
          </div>
          <Button 
            onClick={handleCustomEmail}
            className="h-12 px-6 rounded-xl font-bold transition-all bg-blue-600 hover:bg-blue-700"
          >
            Create
          </Button>
        </div>
      </div>

    </div>
  );
}
