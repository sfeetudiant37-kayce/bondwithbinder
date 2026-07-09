'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, Avatar, Badge, Button, Input } from '@/components/ui';
import {
  MessageSquare,
  Phone,
  Mail,
  Send,
  ArrowLeft,
} from 'lucide-react';
import { ChatBubble, QuickReplies } from '@/components/features';
import { useUserStore } from '@/lib/stores/userStore';

interface ConversationWithMatch {
  id: string;
  matchId: string;
  match: any;
  messages: any[];
  lastMessageAt: string;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeRole } = useUserStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [activeMatch, setActiveMatch] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const conversationIdParam = searchParams.get('conversation');
  const matchIdParam = searchParams.get('matchId');
  const providerIdParam = searchParams.get('provider');

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch matches with conversations
        const matchesRes = await fetch('/api/matches');
        const matches = await matchesRes.json();

        const convos = matches
          .filter((m: any) => m.conversation)
          .map((m: any) => ({
            ...m.conversation,
            match: m,
          }));

        setConversations(convos);

        // If conversation ID in URL, load messages
        if (conversationIdParam) {
          const msgsRes = await fetch(
            `/api/messages?conversationId=${conversationIdParam}`
          );
          const msgs = await msgsRes.json();
          setMessages(msgs);
          const convo = convos.find((c: any) => c.id === conversationIdParam);
          if (convo) {
            setActiveConversation(convo);
            setActiveMatch(convo.match);
          } else {
            // Need to find the match for this conversation
            const matchingMatch = matches.find(
              (m: any) => m.conversation?.id === conversationIdParam
            );
            if (matchingMatch) {
              setActiveMatch(matchingMatch);
              setActiveConversation(matchingMatch.conversation);
            }
          }
          return;
        }

        // If match ID in URL, find or create conversation
        if (matchIdParam) {
          const match = matches.find((m: any) => m.id === matchIdParam);
          if (match?.conversation) {
            setActiveMatch(match);
            setActiveConversation(match.conversation);
            const msgsRes = await fetch(
              `/api/messages?conversationId=${match.conversation.id}`
            );
            const msgs = await msgsRes.json();
            setMessages(msgs);
          } else {
            // Create conversation
            const createRes = await fetch('/api/conversations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ matchId: matchIdParam }),
            });
            const conversation = await createRes.json();
            setActiveConversation(conversation);
            setMessages([]);
            // Update URL without reload
            router.replace(`/messages?conversation=${conversation.id}`);
          }
          return;
        }

        // If provider ID in URL, start conversation with provider
        if (providerIdParam) {
          const match = matches.find(
            (m: any) => m.providerId === providerIdParam
          );
          if (match?.conversation) {
            setActiveMatch(match);
            setActiveConversation(match.conversation);
            const msgsRes = await fetch(
              `/api/messages?conversationId=${match.conversation.id}`
            );
            const msgs = await msgsRes.json();
            setMessages(msgs);
          } else {
            // Create a new match and conversation
            const createRes = await fetch('/api/conversations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                providerId: providerIdParam,
                clientId: session.user?.id,
              }),
            });
            const conversation = await createRes.json();
            setActiveConversation(conversation);
            setMessages([]);
            router.replace(`/messages?conversation=${conversation.id}`);
          }
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, router, conversationIdParam, matchIdParam, providerIdParam]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    setSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          content: newMessage.trim(),
        }),
      });

      const msg = await response.json();
      setMessages((prev) => [...prev, msg]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    setNewMessage(reply);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner" />
      </div>
    );
  }

  // Conversations list view
  if (!activeConversation) {
    return (
      <div className="p-4">
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-text mt-1">Your conversations</p>
        </div>

        {conversations.length === 0 ? (
          <Card className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-text mb-4">No conversations yet</p>
            <Button onClick={() => router.push('/matches')}>
              View Matches
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {conversations.map((convo) => {
              const match = convo.match;
              const otherUser =
                match.clientId === session?.user?.id
                  ? match.provider
                  : match.client;
              const lastMessage = convo.messages?.[convo.messages.length - 1];

              return (
                <Card
                  key={convo.id}
                  className="flex items-center gap-3"
                  onClick={() => router.push(`/messages?conversation=${convo.id}`)}
                >
                  <Avatar
                    src={otherUser?.profile?.photoUrl}
                    name={otherUser?.name || 'User'}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {otherUser?.name}
                    </p>
                    <p className="text-sm text-gray-text truncate">
                      {lastMessage?.content || 'Start a conversation'}
                    </p>
                  </div>
                  <Badge variant={match.status === 'mutual' ? 'success' : 'primary'}>
                    {match.status}
                  </Badge>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Chat view
  const otherUser =
    activeMatch?.clientId === session?.user?.id
      ? activeMatch?.provider
      : activeMatch?.client;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-white border-b border-gray-border">
        <button
          onClick={() => {
            setActiveConversation(null);
            setActiveMatch(null);
            router.push('/messages');
          }}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <Avatar
          src={otherUser?.profile?.photoUrl}
          name={otherUser?.name || 'User'}
          size="md"
        />
        <div className="flex-1">
          <p className="font-medium text-gray-900">{otherUser?.name}</p>
          <p className="text-sm text-gray-text">{otherUser?.location}</p>
        </div>
        {otherUser?.phone && (
          <a
            href={`tel:${otherUser.phone}`}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Phone className="w-5 h-5 text-gray-700" />
          </a>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-text py-8">
            <p>Start a conversation</p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              isOwn={msg.senderId === session?.user?.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 py-2 bg-white border-t border-gray-border">
        <QuickReplies onSelect={handleQuickReply} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-4 bg-white border-t border-gray-border">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend} disabled={!newMessage.trim() || sending}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
