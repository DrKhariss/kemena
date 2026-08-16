/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import TriviaPage from './components/TriviaPage';
import Trivia from './components/Trivia';
import Leaderboard from './components/Leaderboard';
import AdminNews from './components/AdminNews';
import MixingRoutes from './mixing/MixingRoutes';
import { ThemeProvider } from './context/ThemeContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppShell() {
  const { pathname } = useLocation();
  const isMixing = pathname.startsWith('/mixing');
  const [username, setUsername] = useState('');
  const [isMusicRequested, setIsMusicRequested] = useState(true);
  const [battleMusicUrl, setBattleMusicUrl] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const unsubscribeConfig = onSnapshot(
      doc(db, 'config', 'mainPage'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.battleMusicUrl) {
            setBattleMusicUrl(data.battleMusicUrl);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'config/mainPage');
      },
    );

    return () => unsubscribeConfig();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.log('Initial autoplay prevented by browser. Hooking global interaction triggers.', err);
      });

      const handleUserInteraction = () => {
        if (audioRef.current?.paused && isMusicRequested) {
          audioRef.current.play().catch(() => {});
        }
        removeInteractionListeners();
      };

      const removeInteractionListeners = () => {
        window.removeEventListener('click', handleUserInteraction);
        window.removeEventListener('touchstart', handleUserInteraction);
        window.removeEventListener('keydown', handleUserInteraction);
        window.removeEventListener('scroll', handleUserInteraction);
      };

      window.addEventListener('click', handleUserInteraction);
      window.addEventListener('touchstart', handleUserInteraction);
      window.addEventListener('keydown', handleUserInteraction);
      window.addEventListener('scroll', handleUserInteraction);

      return () => {
        removeInteractionListeners();
      };
    }
  }, [isMusicRequested]);

  useEffect(() => {
    if (audioRef.current) {
      if (isMusicRequested && battleMusicUrl) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMusicRequested, battleMusicUrl]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (audioRef.current) {
        if (document.hidden) {
          audioRef.current.pause();
        } else if (isMusicRequested) {
          audioRef.current.play().catch((err) => {
            console.log('Unable to automatically resume playback on tab active:', err);
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isMusicRequested]);

  if (isMixing) {
    return (
      <>
        <ScrollToTop />
        <div className="bg-army-dark text-tactical-cyan min-h-screen selection:bg-tactical-amber selection:text-white">
          <div className="scanline"></div>
          <Routes>
            <Route path="/mixing/*" element={<MixingRoutes />} />
          </Routes>
        </div>
      </>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <div className="bg-army-dark text-tactical-cyan min-h-screen selection:bg-tactical-amber selection:text-white">
        <div className="scanline"></div>

        <div className="hidden">
          <audio ref={audioRef} loop src={battleMusicUrl || undefined} />
        </div>

        <div className="main-wrapper">
          <main className="flex-1 px-4 md:px-0 pt-[80px] sm:pt-[100px]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/trivia"
                element={<TriviaPage setUsername={setUsername} startMusic={() => setIsMusicRequested(true)} />}
              />
              <Route path="/quiz" element={<Trivia username={username} />} />
              <Route path="/leaderboard" element={<Leaderboard highlightUser={username} />} />
              <Route path="/admin" element={<AdminNews />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppShell />
      </Router>
    </ThemeProvider>
  );
}
