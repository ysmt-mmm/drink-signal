import { useState } from 'react';
import { Clock, ThumbsUp, HelpCircle, X, MapPin } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

export interface NearbyPerson {
  id: string;
  name: string;
  avatar: string;
  distance: number; // meters
  status: 'light' | 'another' | 'chill' | 'meal' | 'cafe';
  timeLeft: number; // minutes
  lat: number;
  lng: number;
  reaction?: 'yes' | 'maybe' | 'no';
}

interface NearbyPeopleMapProps {
  people: NearbyPerson[];
  onReact: (personId: string, reaction: 'yes' | 'maybe' | 'no') => void;
  userLocation: { lat: number; lng: number };
}

const statusInfo = {
  light: { emoji: '🍺', label: '軽く1杯', color: '#FFB84D' },
  another: { emoji: '🍻', label: 'もう一軒', color: '#FF6B35' },
  chill: { emoji: '🥃', label: 'しっぽり', color: '#A855F7' },
  meal: { emoji: '🍽️', label: 'ご飯', color: '#10B981' },
  cafe: { emoji: '☕', label: 'カフェ', color: '#8B4513' },
};

export function NearbyPeopleMap({ people, onReact, userLocation }: NearbyPeopleMapProps) {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  if (people.length === 0) {
    return (
      <div className="h-[500px] rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔍</div>
          <div className="space-y-2">
            <p className="text-gray-900 font-semibold">近くに飲める人がいません</p>
            <p className="text-sm text-gray-600">
              半径2km以内で「今飲める」をONにしている<br />
              フォロワーが表示されます
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate relative positions for map visualization
  const mapWidth = 600;
  const mapHeight = 500;
  const radius = 2000; // 2km in meters

  const getPosition = (lat: number, lng: number) => {
    // Simple coordinate to pixel conversion
    const latDiff = (lat - userLocation.lat) * 111000; // roughly 111km per degree
    const lngDiff = (lng - userLocation.lng) * 111000 * Math.cos(userLocation.lat * Math.PI / 180);
    
    const x = (mapWidth / 2) + (lngDiff / radius) * (mapWidth / 2.5);
    const y = (mapHeight / 2) - (latDiff / radius) * (mapHeight / 2.5);
    
    return { x, y };
  };

  const selected = selectedPerson ? people.find(p => p.id === selectedPerson) : null;

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-900">近くで飲める人</h2>
        <p className="text-sm text-gray-600">{people.length}人が近くにいます</p>
      </div>

      <div className="relative h-[500px] rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg bg-gradient-to-br from-blue-50 to-green-50">
        {/* Grid pattern for map feel */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* 2km radius circle */}
        <svg className="absolute inset-0 w-full h-full">
          <circle
            cx={mapWidth / 2}
            cy={mapHeight / 2}
            r={Math.min(mapWidth, mapHeight) / 2.5}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeDasharray="10,5"
            opacity="0.3"
          />
        </svg>

        {/* User position (center) */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ left: `${mapWidth / 2}px`, top: `${mapHeight / 2}px` }}
        >
          <div className="relative">
            <div className="w-12 h-12 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded shadow">
                あなた
              </div>
            </div>
          </div>
        </div>

        {/* People markers */}
        {people.map((person) => {
          const pos = getPosition(person.lat, person.lng);
          const status = statusInfo[person.status];
          const isSelected = selectedPerson === person.id;
          
          return (
            <div
              key={person.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 z-20"
              style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
              onClick={() => setSelectedPerson(isSelected ? null : person.id)}
            >
              <div className={`relative ${isSelected ? 'scale-125' : ''} transition-transform`}>
                <div className="w-12 h-12 bg-white rounded-full border-2 border-gray-300 shadow-lg flex items-center justify-center text-2xl">
                  {status.emoji}
                </div>
                {isSelected && (
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-3">
                      <div className="flex items-start gap-3 mb-3">
                        <img 
                          src={person.avatar} 
                          alt={person.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm truncate">{person.name}</div>
                          <div className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            残り{person.timeLeft}分
                          </div>
                        </div>
                        <div className="text-center flex-shrink-0">
                          <div className="text-xl">{status.emoji}</div>
                          <div className="text-xs text-gray-600">{status.label}</div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-600 mb-3 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        約{person.distance < 1000 ? `${person.distance}m` : `${(person.distance / 1000).toFixed(1)}km`}
                      </div>

                      {person.reaction ? (
                        <div className="bg-gray-50 rounded p-2 text-center">
                          <p className="text-xs text-gray-600">
                            {person.reaction === 'yes' && '👍 合流希望を送信しました'}
                            {person.reaction === 'maybe' && '🤔 検討中として送信しました'}
                            {person.reaction === 'no' && '❌ 今回は見送りました'}
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-1">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              onReact(person.id, 'yes');
                              setSelectedPerson(null);
                            }}
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white p-1 h-auto"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              onReact(person.id, 'maybe');
                              setSelectedPerson(null);
                            }}
                            size="sm"
                            variant="outline"
                            className="p-1 h-auto"
                          >
                            <HelpCircle className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              onReact(person.id, 'no');
                              setSelectedPerson(null);
                            }}
                            size="sm"
                            variant="outline"
                            className="p-1 h-auto"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Distance indicator */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow px-3 py-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-gray-400"></div>
            <span>= 500m</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow"></div>
            <span className="text-gray-700">あなた</span>
          </div>
          {Object.entries(statusInfo).map(([key, info]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-xl">{info.emoji}</span>
              <span className="text-gray-700">{info.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}