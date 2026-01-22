import { MessageCircle, Clock } from 'lucide-react';

export interface ChatConversation {
  id: string;
  personId: string;
  personName: string;
  personAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'light' | 'another' | 'chill' | 'meal' | 'cafe';
}

interface ChatListProps {
  conversations: ChatConversation[];
  onSelectChat: (personId: string) => void;
}

const statusInfo = {
  light: { emoji: '🍺', label: '軽く1杯' },
  another: { emoji: '🍻', label: 'もう一軒' },
  chill: { emoji: '🥃', label: 'しっぽり' },
  meal: { emoji: '🍽️', label: 'ご飯' },
  cafe: { emoji: '☕', label: 'カフェ' },
};

export function ChatList({ conversations, onSelectChat }: ChatListProps) {
  if (conversations.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-6xl">💬</div>
        <div className="space-y-2">
          <p className="text-gray-900 font-semibold">チャットはまだありません</p>
          <p className="text-sm text-gray-600">
            合流が成立すると、ここでメッセージの<br />
            やり取りができるようになります
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1 mb-6">
        <h2 className="text-xl font-bold text-gray-900">メッセージ</h2>
        <p className="text-sm text-gray-600">{conversations.length}件の会話</p>
      </div>

      <div className="space-y-2">
        {conversations.map((conv) => {
          const status = statusInfo[conv.status];
          
          return (
            <button
              key={conv.id}
              onClick={() => onSelectChat(conv.personId)}
              className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <img 
                    src={conv.personAvatar} 
                    alt={conv.personName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 text-lg">
                    {status.emoji}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold text-gray-900">{conv.personName}</div>
                    <div className="text-xs text-gray-500">{conv.lastMessageTime}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate flex-1">
                      {conv.lastMessage}
                    </p>
                    {conv.unreadCount > 0 && (
                      <div className="ml-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {conv.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}