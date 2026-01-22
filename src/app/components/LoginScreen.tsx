import { Instagram } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo */}
        <div className="space-y-4">
          <div className="text-6xl">🍺</div>
          <h1 className="text-4xl font-bold text-gray-900">DRINK SIGNAL</h1>
          <p className="text-lg text-gray-600">今いるなら、会おう。</p>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
          <p className="text-gray-700">
            飲みたいときだけ、<br />
            存在をそっと共有するアプリ
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>相互フォローの人とだけ共有</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>半径2km・最大90分限定</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>誘わなくていいのに、合流できる</span>
            </div>
          </div>
        </div>

        {/* Login Button */}
        <Button 
          onClick={onLogin}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg rounded-full shadow-lg"
        >
          <Instagram className="mr-2 h-6 w-6" />
          Instagramでログイン
        </Button>

        <p className="text-xs text-gray-500">
          ※このプロトタイプではモックデータを使用しています
        </p>
      </div>
    </div>
  );
}
