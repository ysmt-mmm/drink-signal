import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

interface ChatWindowProps {
  personId: string;
  personName: string;
  personAvatar: string;
  status: 'light' | 'another' | 'chill' | 'meal' | 'cafe';
  timeLeft: number;
  messages: ChatMessage[];
  onSendMessage: (personId: string, text: string) => void;
  onBack: () => void;
}

const statusInfo = {
  light: { emoji: '🍺', label: '軽く1杯' },
  another: { emoji: '🍻', label: 'もう一軒' },
  chill: { emoji: '🥃', label: 'しっぽり' },
  meal: { emoji: '🍽️', label: 'ご飯' },
  cafe: { emoji: '☕', label: 'カフェ' },
};

export function ChatWindow({ 
  personId, 
  personName, 
  personAvatar, 
  status,
  timeLeft,
  messages, 
  onSendMessage,
  onBack 
}: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const statusData = statusInfo[status];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(personId, inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 flex items-center gap-3">
        <Button
          onClick={onBack}
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="relative flex-shrink-0">
          <img 
            src={personAvatar} 
            alt={personName}
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
          <div className="absolute -bottom-1 -right-1 text-base">
            {statusData.emoji}
          </div>
        </div>

        <div className="flex-1">
          <div className="font-semibold">{personName}</div>
          <div className="text-xs text-white/90 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            残り{timeLeft}分 · {statusData.label}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <div className="text-4xl">👋</div>
            <p className="text-gray-600">メッセージを送って会話を始めましょう</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  message.isMe
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.isMe ? 'text-orange-100' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="メッセージを入力..."
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}