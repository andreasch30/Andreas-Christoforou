import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Mail, RefreshCw, Trash2, ChevronRight, Inbox as InboxIcon, Clock, User, Paperclip, Copy, Bell, Filter, ShieldCheck, Zap, ExternalLink, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { mailApi, Message, MessageDetail } from '@/src/services/mailApi';
import { formatDistanceToNow } from 'date-fns';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'motion/react';

type FilterType = 'all' | 'unread' | 'codes';

export default function Inbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<MessageDetail | null>(null);
  const [viewingMessage, setViewingMessage] = useState(false);
  const [fetchingDetail, setFetchingDetail] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [lastMessageCount, setLastMessageCount] = useState(0);

  const fetchMessages = useCallback(async (isAuto = false) => {
    if (!isAuto) setRefreshing(true);
    try {
      const saved = localStorage.getItem('temp_mail_account');
      if (saved) {
        const data = JSON.parse(saved);
        mailApi.setToken(data.token);
      }

      const msgs = await mailApi.getMessages();
      
      // Check for new messages and trigger notification
      if (isAuto && msgs.length > lastMessageCount) {
        const newMsg = msgs[0];
        
        // Auto-copy code
        const code = extractCode(newMsg.intro + newMsg.subject);
        if (code) {
          navigator.clipboard.writeText(code);
          toast.success(`Verification code ${code} auto-copied!`, {
            icon: <Star className="w-4 h-4 text-yellow-500" />
          });
        }

        if (Notification.permission === 'granted' && localStorage.getItem('notifications_enabled') === 'true') {
          new Notification(`New Email from ${newMsg.from.name || newMsg.from.address}`, {
            body: newMsg.subject,
            icon: '/favicon.ico'
          });
        }
        toast.info(`New email: ${newMsg.subject}`);
      }
      
      setMessages(msgs);
      setLastMessageCount(msgs.length);
    } catch (error) {
      console.error(error);
      if (!isAuto) toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [lastMessageCount]);

  useEffect(() => {
    fetchMessages();
    // Everyone gets fast refresh (2s)
    const refreshRate = 2000;
    const interval = setInterval(() => fetchMessages(true), refreshRate);
    
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const filteredMessages = useMemo(() => {
    switch (filter) {
      case 'unread': return messages.filter(m => !m.seen);
      case 'codes': return messages.filter(m => /\b\d{4,8}\b/.test(m.intro) || /\b\d{4,8}\b/.test(m.subject));
      default: return messages;
    }
  }, [messages, filter]);

  const handleOpenMessage = async (id: string) => {
    setFetchingDetail(true);
    setViewingMessage(true);
    try {
      const detail = await mailApi.getMessage(id);
      setSelectedMessage(detail);
      // Mark as seen locally
      setMessages(prev => prev.map(m => m.id === id ? { ...m, seen: true } : m));
    } catch (error) {
      console.error(error);
      toast.error('Failed to load email content');
      setViewingMessage(false);
    } finally {
      setFetchingDetail(false);
    }
  };

  const handleDeleteMessage = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await mailApi.deleteMessage(id);
      setMessages(messages.filter(m => m.id !== id));
      toast.success('Message deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete message');
    }
  };

  const extractCode = (text: string) => {
    const match = text.match(/\b\d{4,8}\b/);
    return match ? match[0] : null;
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Code ${code} copied!`);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <div className="px-6 py-6 flex flex-col gap-6 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold">Inbox</h2>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
              <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Live</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => fetchMessages()}
              disabled={refreshing}
              className="text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-all h-12 w-12"
            >
              <RefreshCw className={`w-6 h-6 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)} className="w-full">
            <TabsList className="bg-zinc-900 border border-zinc-800 w-full p-1.5 h-14 rounded-2xl">
              <TabsTrigger value="all" className="flex-1 rounded-xl text-xs font-bold uppercase tracking-widest data-[state=active]:bg-zinc-800 data-[state=active]:text-blue-500">All</TabsTrigger>
              <TabsTrigger value="unread" className="flex-1 rounded-xl text-xs font-bold uppercase tracking-widest data-[state=active]:bg-zinc-800 data-[state=active]:text-blue-500">Unread</TabsTrigger>
              <TabsTrigger value="codes" className="flex-1 rounded-xl text-xs font-bold uppercase tracking-widest data-[state=active]:bg-zinc-800 data-[state=active]:text-blue-500">Codes</TabsTrigger>
            </TabsList>
          </Tabs>

          {localStorage.getItem('temp_mail_account') && (
            <div className="flex items-center gap-3 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
              <div className="text-xs text-zinc-400 font-mono truncate flex-1 px-2">
                {JSON.parse(localStorage.getItem('temp_mail_account')!).address}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-zinc-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg"
                onClick={() => {
                  const addr = JSON.parse(localStorage.getItem('temp_mail_account')!).address;
                  navigator.clipboard.writeText(addr);
                  toast.success('Email copied');
                }}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4 pb-24">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-zinc-900/50 border-zinc-900">
                <CardContent className="p-6 flex gap-6">
                  <Skeleton className="w-14 h-14 rounded-2xl bg-zinc-800" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="w-1/3 h-5 bg-zinc-800" />
                    <Skeleton className="w-full h-4 bg-zinc-800" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-zinc-500 gap-6">
              <div className="w-24 h-24 rounded-3xl bg-zinc-900 flex items-center justify-center border border-zinc-800">
                <InboxIcon className="w-12 h-12 opacity-20" />
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-zinc-300">No emails found</p>
                <p className="text-sm text-zinc-500 max-w-[250px] mx-auto mt-2">
                  {filter === 'all' ? 'Waiting for incoming emails...' : `No ${filter} emails match your current filter.`}
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredMessages.map((msg) => {
                const code = extractCode(msg.intro + msg.subject);
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                  >
                    <Card 
                      onClick={() => handleOpenMessage(msg.id)}
                      className={`bg-zinc-900 border-zinc-800 hover:border-blue-500/50 transition-all cursor-pointer group relative overflow-hidden ${!msg.seen ? 'border-l-4 border-l-blue-500' : ''}`}
                    >
                      <CardContent className="p-6 flex gap-6 items-start">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${!msg.seen ? 'bg-blue-500/20 text-blue-500' : 'bg-zinc-800 text-zinc-500'}`}>
                          {code ? <ShieldCheck className="w-7 h-7" /> : <User className="w-7 h-7" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-base truncate font-bold ${!msg.seen ? 'text-white' : 'text-zinc-400'}`}>
                              {msg.from.name || msg.from.address}
                            </span>
                            <span className="text-xs text-zinc-500 whitespace-nowrap ml-2 font-medium">
                              {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <h3 className={`text-lg truncate mb-2 ${!msg.seen ? 'font-bold text-white' : 'font-medium text-zinc-300'}`}>
                            {msg.subject || '(No Subject)'}
                          </h3>
                          <p className="text-sm text-zinc-500 truncate line-clamp-2 leading-relaxed">
                            {msg.intro}
                          </p>
                          
                          {code && (
                            <div className="mt-4 flex items-center gap-3">
                              <div className="bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-xl flex items-center gap-3">
                                <span className="text-sm font-mono font-bold text-blue-400 tracking-wider">{code}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-blue-500 hover:bg-blue-500/20"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyCode(code);
                                  }}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-blue-500/60 uppercase tracking-widest">Verification Code</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          {msg.hasAttachments && <Paperclip className="w-4 h-4 text-zinc-500" />}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => handleDeleteMessage(msg.id, e)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-10 w-10 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>

      {/* Email Viewer Dialog */}
      <Dialog open={viewingMessage} onOpenChange={setViewingMessage}>
        <DialogContent className="bg-zinc-950 border-zinc-800 sm:max-w-[700px] h-[85vh] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-6 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl">
            {fetchingDetail ? (
              <div className="space-y-4">
                <Skeleton className="w-2/3 h-8 bg-zinc-900" />
                <div className="flex gap-3">
                  <Skeleton className="w-10 h-10 rounded-full bg-zinc-900" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="w-1/2 h-4 bg-zinc-900" />
                    <Skeleton className="w-1/3 h-3 bg-zinc-900" />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <DialogTitle className="text-2xl font-bold leading-tight mb-4 pr-8">
                  {selectedMessage?.subject || '(No Subject)'}
                </DialogTitle>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500 border border-blue-500/20">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">
                      {selectedMessage?.from.name || selectedMessage?.from.address}
                    </p>
                    <p className="text-xs text-zinc-500 truncate flex items-center gap-1">
                      To: {selectedMessage?.to[0].address}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Received</p>
                    <p className="text-xs text-zinc-300 font-medium">
                      {selectedMessage && formatDistanceToNow(new Date(selectedMessage.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </>
            )}
          </DialogHeader>

          <ScrollArea className="flex-1 p-8 bg-zinc-50 text-zinc-900">
            {fetchingDetail ? (
              <div className="space-y-6">
                <Skeleton className="w-full h-4 bg-zinc-200" />
                <Skeleton className="w-full h-4 bg-zinc-200" />
                <Skeleton className="w-full h-4 bg-zinc-200" />
                <Skeleton className="w-3/4 h-4 bg-zinc-200" />
              </div>
            ) : selectedMessage ? (
              <div className="space-y-6">
                {/* Smart Highlight: Verification Code */}
                {extractCode(selectedMessage.html[0] || selectedMessage.text) && (
                  <div className="bg-blue-600 rounded-2xl p-6 text-white flex items-center justify-between shadow-xl shadow-blue-600/20">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Verification Code Detected</p>
                      </div>
                      <p className="text-3xl font-mono font-bold tracking-[0.3em]">{extractCode(selectedMessage.html[0] || selectedMessage.text)}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button 
                        onClick={() => copyCode(extractCode(selectedMessage.html[0] || selectedMessage.text)!)}
                        className="bg-white text-blue-600 hover:bg-zinc-100 font-bold rounded-xl h-12 px-6"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        COPY CODE
                      </Button>
                    </div>
                  </div>
                )}

                <div 
                  className="email-content break-words prose prose-blue max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(
                      Array.isArray(selectedMessage.html) 
                        ? (selectedMessage.html[0] || selectedMessage.text || 'No content') 
                        : (selectedMessage.html || selectedMessage.text || 'No content'),
                      { ADD_ATTR: ['target'] }
                    ).replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" class="text-blue-600 font-bold underline" ')
                  }} 
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
                Select an email to view its content
              </div>
            )}
          </ScrollArea>

          {selectedMessage?.attachments && selectedMessage.attachments.length > 0 && (
            <div className="p-6 border-t border-zinc-900 bg-zinc-950">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Attachments ({selectedMessage.attachments.length})</p>
              <div className="flex flex-wrap gap-3">
                {selectedMessage.attachments.map((att) => (
                  <Button key={att.id} variant="outline" className="bg-zinc-900 border-zinc-800 text-xs h-10 px-4 rounded-xl hover:bg-zinc-800 transition-colors">
                    <Paperclip className="w-3 h-3 mr-2 text-blue-500" />
                    {att.filename}
                    <span className="ml-2 opacity-40">({(att.size / 1024).toFixed(1)} KB)</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
