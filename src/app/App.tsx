import { useState } from 'react';
import { LoginScreen } from '@/app/components/LoginScreen';
import { MainScreen } from '@/app/components/MainScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen">
      {isLoggedIn ? (
        <MainScreen onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <LoginScreen onLogin={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}
