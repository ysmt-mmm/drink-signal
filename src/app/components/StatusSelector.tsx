import { useState } from 'react';
import { Button } from '@/app/components/ui/button';

export type DrinkStatus = 'light' | 'another' | 'chill' | 'meal' | 'cafe' | null;

interface StatusSelectorProps {
  onStatusChange: (status: DrinkStatus) => void;
  currentStatus: DrinkStatus;
}

export function StatusSelector({ onStatusChange, currentStatus }: StatusSelectorProps) {
  const statuses = [
    { id: 'light' as const, emoji: '🍺', label: '軽く1杯', description: 'サクッと30分くらい' },
    { id: 'another' as const, emoji: '🍻', label: 'もう一軒', description: '1〜2時間くらい' },
    { id: 'chill' as const, emoji: '🥃', label: 'しっぽり', description: 'じっくり話したい' },
    { id: 'meal' as const, emoji: '🍽️', label: 'ご飯', description: '一緒に食事したい' },
    { id: 'cafe' as const, emoji: '☕', label: 'カフェ', description: 'お茶でも飲みたい' },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-900">今の気分は?</h2>
        <p className="text-sm text-gray-600">ステータスをONにすると、近くの人に表示されます</p>
      </div>

      <div className="space-y-3">
        {statuses.map((status) => (
          <button
            key={status.id}
            onClick={() => onStatusChange(currentStatus === status.id ? null : status.id)}
            className={`w-full p-4 rounded-xl border-2 transition-all ${
              currentStatus === status.id
                ? 'border-orange-500 bg-orange-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-orange-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{status.emoji}</span>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">{status.label}</div>
                <div className="text-sm text-gray-600">{status.description}</div>
              </div>
              {currentStatus === status.id && (
                <div className="text-orange-500 font-semibold">ON</div>
              )}
            </div>
          </button>
        ))}
      </div>

      {currentStatus && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-800">
          <p className="font-semibold">📍 位置情報が共有されています</p>
          <p className="text-xs mt-1">90分後、または手動でOFFにすると自動的に消去されます</p>
        </div>
      )}

      {currentStatus && (
        <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-gray-700">
            💡 <strong>近くの人</strong>タブで、同じ気分の人を見つけて<br />
            気軽に合流できます！
          </p>
        </div>
      )}
    </div>
  );
}