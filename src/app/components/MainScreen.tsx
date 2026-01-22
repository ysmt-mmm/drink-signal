import { useState, useEffect } from 'react';
import { MapPin, User, LogOut, Bell, MessageCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { StatusSelector, DrinkStatus } from '@/app/components/StatusSelector';
import { NearbyPeopleMap, NearbyPerson } from '@/app/components/NearbyPeopleMap';
import { ChatList, ChatConversation } from '@/app/components/ChatList';
import { ChatWindow, ChatMessage } from '@/app/components/ChatWindow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

interface MainScreenProps {
  onLogout: () => void;
}

// Mock data with coordinates (Tokyo - Shinjuku area)
const mockNearbyPeople: NearbyPerson[] = [
  {
    id: '1',
    name: '田中太郎',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    distance: 450,
    status: 'light',
    timeLeft: 67,
    lat: 35.6945,
    lng: 139.7030,
  },
  {
    id: '2',
    name: '佐藤花子',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    distance: 890,
    status: 'cafe',
    timeLeft: 42,
    lat: 35.6920,
    lng: 139.7010,
  },
  {
    id: '3',
    name: '鈴木一郎',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    distance: 1200,
    status: 'chill',
    timeLeft: 85,
    lat: 35.6900,
    lng: 139.7050,
  },
  {
    id: '4',
    name: '山田美咲',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    distance: 650,
    status: 'meal',
    timeLeft: 55,
    lat: 35.6955,
    lng: 139.7020,
  },
  {
    id: '5',
    name: '高橋健太',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    distance: 1100,
    status: 'another',
    timeLeft: 73,
    lat: 35.6925,
    lng: 139.7045,
  },
];

// User location (Shinjuku Station area)
const userLocation = {
  lat: 35.6938,
  lng: 139.7034,
};

export function MainScreen({ onLogout }: MainScreenProps) {
  const [currentStatus, setCurrentStatus] = useState<DrinkStatus>(null);
  const [nearbyPeople, setNearbyPeople] = useState<NearbyPerson[]>([]);
  const [activeTab, setActiveTab] = useState<string>('status');
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [activeChatPerson, setActiveChatPerson] = useState<string | null>(null);

  useEffect(() => {
    // Simulate nearby people when status is active
    if (currentStatus) {
      setNearbyPeople(mockNearbyPeople);
      setActiveTab('nearby');
    } else {
      setNearbyPeople([]);
    }
  }, [currentStatus]);

  const handleReaction = (personId: string, reaction: 'yes' | 'maybe' | 'no') => {
    setNearbyPeople(prev => 
      prev.map(person => 
        person.id === personId 
          ? { ...person, reaction } 
          : person
      )
    );

    // If reaction is 'yes', create a chat conversation
    if (reaction === 'yes') {
      const person = nearbyPeople.find(p => p.id === personId);
      if (person && !conversations.find(c => c.personId === personId)) {
        const newConversation: ChatConversation = {
          id: `conv-${personId}`,
          personId: person.id,
          personName: person.name,
          personAvatar: person.avatar,
          lastMessage: '合流希望を送信しました',
          lastMessageTime: '今',
          unreadCount: 0,
          status: person.status,
        };
        setConversations(prev => [newConversation, ...prev]);
        setMessages(prev => ({
          ...prev,
          [personId]: [{
            id: `msg-${Date.now()}`,
            senderId: 'me',
            text: '合流希望を送信しました！よろしくお願いします 🍺',
            timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
          }]
        }));
      }
    }
  };

  const handleSendMessage = (personId: string, text: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      text,
      timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages(prev => ({
      ...prev,
      [personId]: [...(prev[personId] || []), newMessage]
    }));

    // Update conversation last message
    setConversations(prev =>
      prev.map(conv =>
        conv.personId === personId
          ? { ...conv, lastMessage: text, lastMessageTime: '今' }
          : conv
      )
    );

    // Simulate response after 2 seconds
    setTimeout(() => {
      const responses = [
        'いいですね！今どこにいますか？',
        'ありがとうございます！何時頃がいいですか？',
        '了解です！どこか良いお店知ってます？',
        'わかりました！楽しみにしてます 🍻',
      ];
      const response: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: personId,
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
      };

      setMessages(prev => ({
        ...prev,
        [personId]: [...(prev[personId] || []), response]
      }));

      setConversations(prev =>
        prev.map(conv =>
          conv.personId === personId
            ? { ...conv, lastMessage: response.text, lastMessageTime: '今', unreadCount: activeChatPerson === personId ? 0 : conv.unreadCount + 1 }
            : conv
        )
      );
    }, 2000);
  };

  const handleSelectChat = (personId: string) => {
    setActiveChatPerson(personId);
    // Clear unread count
    setConversations(prev =>
      prev.map(conv =>
        conv.personId === personId
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  const activePerson = activeChatPerson ? nearbyPeople.find(p => p.id === activeChatPerson) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍺</span>
            <span className="font-bold text-gray-900">DRINK SIGNAL</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {currentStatus && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={onLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Status Bar */}
      {currentStatus && (
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">位置情報を共有中</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setCurrentStatus(null)}
              className="text-white hover:bg-white/20"
            >
              停止
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="status">ステータス</TabsTrigger>
            <TabsTrigger value="nearby" className="relative">
              近くの人
              {nearbyPeople.length > 0 && (
                <span className="ml-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {nearbyPeople.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="chat" className="relative">
              チャット
              {totalUnread > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalUnread}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="mt-0">
            <StatusSelector 
              currentStatus={currentStatus} 
              onStatusChange={setCurrentStatus}
            />

            {!currentStatus && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-900">
                  <strong>💡 使い方</strong><br />
                  気分に合わせてステータスをONにすると、近くで飲める人が表示されます。
                  誘わなくても、自然に合流できます。
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="nearby" className="mt-0">
            <NearbyPeopleMap 
              people={nearbyPeople} 
              onReact={handleReaction}
              userLocation={userLocation}
            />
          </TabsContent>

          <TabsContent value="chat" className="mt-0">
            {activeChatPerson && activePerson ? (
              <ChatWindow
                personId={activeChatPerson}
                personName={activePerson.name}
                personAvatar={activePerson.avatar}
                status={activePerson.status}
                timeLeft={activePerson.timeLeft}
                messages={messages[activeChatPerson] || []}
                onSendMessage={handleSendMessage}
                onBack={() => setActiveChatPerson(null)}
              />
            ) : (
              <ChatList
                conversations={conversations}
                onSelectChat={handleSelectChat}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
        <p>今いるなら、会おう。</p>
      </footer>
    </div>
  );
}