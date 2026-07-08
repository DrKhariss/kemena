import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight, Megaphone } from 'lucide-react';
import { motion } from 'motion/react';
import { collection, query, orderBy, onSnapshot, where, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface TriviaPageProps {
  setUsername: (name: string) => void;
  startMusic: () => void;
}

export default function TriviaPage({ setUsername, startMusic }: TriviaPageProps) {
  const [nameInput, setNameInput] = useState('');
  const [error, setError] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [newsItems, setNewsItems] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Fetch dynamic news from Firestore
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => doc.data().text as string);
      if (items.length > 0) {
        setNewsItems(items);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'news');
    });

    const ctx = gsap.context(() => {
      // Heading animation
      const titleLines = headingRef.current?.querySelectorAll('.line');
      if (titleLines) {
        gsap.from(titleLines, {
          y: 50,
          opacity: 0,
          scale: 0.8,
          duration: 1,
          stagger: 0.1,
          ease: "expo.out"
        });
      }

      // Card animation
      gsap.from(cardRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        delay: 0.5,
        ease: "power4.out"
      });
    });
    return () => ctx.revert();
  }, []);

  const handleStart = async () => {
    if (!nameInput.trim()) {
      setError('Please tell us your name.');
      return;
    }

    try {
      // Check if user exists on leaderboard via Firestore (case-insensitive)
      const q = query(
        collection(db, 'leaderboard'), 
        where('username_lowercase', '==', nameInput.trim().toLowerCase())
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setShowPrompt(true);
      } else {
        setUsername(nameInput.trim());
        startMusic();
        navigate('/quiz');
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'leaderboard');
      // Fallback: allow entry if database check fails
      setUsername(nameInput.trim());
      startMusic();
      navigate('/quiz');
    }
  };

  const handleRetake = (confirm: boolean) => {
    if (confirm) {
      setUsername(nameInput);
      startMusic();
      navigate('/quiz');
    } else {
      setShowPrompt(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-6 sm:py-12 px-4 relative">
      {/* Background Ornaments */}
      <div className="absolute top-20 left-10 w-32 h-32 border-t border-l border-black/5 pointer-events-none hidden lg:block" />
      <div className="absolute bottom-20 right-10 w-32 h-32 border-b border-r border-black/5 pointer-events-none hidden lg:block" />

      <div className="text-center mb-8 sm:mb-12 w-full max-w-full px-2">
        <div className="hud-label tracking-[0.2em] sm:tracking-[0.5em] mb-4">DISCOVER YOUR RANK</div>
        <h1 ref={headingRef} className="hero-heading flex flex-col items-center max-w-full px-2">
          <span className="line px-2">THIS IS THE</span>
          <span className="line highlight leading-[1.1] !px-4 sm:!px-10">
            #KEMENARMY
          </span>
        </h1>
        <div className="flex items-center justify-center gap-4 mt-4 sm:mt-6">
          <div className="h-[1px] w-8 sm:w-12 bg-black/10" />
          <p className="subtitle">Ready to Test Your Knowledge?</p>
          <div className="h-[1px] w-8 sm:w-12 bg-black/10" />
        </div>
      </div>

      <div ref={cardRef} className="card-container mt-4">
        <div className="mb-6 sm:mb-8 border-b border-black/10 pb-4 text-center sm:text-left">
          <h2 className="font-army text-2xl sm:text-3xl uppercase tracking-tighter text-red">BEGIN HERE</h2>
          <h3 className="font-mono text-[9px] sm:text-[10px] text-army-light uppercase mt-1">Status: Restricted Access Required</h3>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <div className="hud-label text-[9px] mb-2 flex justify-between">
              <span>Input ID Token</span>
              <span className="animate-pulse">_WAITING</span>
            </div>
            <input 
              type="text" 
              placeholder="WHAT'S YOUR NAME?"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                setError('');
              }}
              className="input-name"
            />
            {error && (
              <div className="mt-2 flex items-center gap-2 text-tactical-red font-mono text-[10px] bg-tactical-red/5 p-2">
                <span className="animate-pulse">!</span> [ ERROR ]: {error}
              </div>
            )}
          </div>

          <button 
            onClick={handleStart}
            className="btn-primary flex items-center justify-center gap-3 z-10"
          >
            <span className="relative z-10 flex items-center gap-2">LET'S BEGIN<ArrowRight size={18} /></span>
          </button>
        </div>

        <div className="mt-6 sm:mt-8 pt-4 border-t border-black/5 flex justify-between items-center px-1">
          <div className="flex gap-1.5">
            {[1,2,3,4].map(i => <div key={i} className="w-1 h-2.5 sm:h-3 bg-black/5" />)}
          </div>
          <div className="font-mono text-[8px] text-army-light opacity-60">CODE: KMN-77-CMD</div>
        </div>
      </div>

      <div className="pagination-dots">
        <div className="dot active"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>

      {/* Retake Prompt Modal */}
      {showPrompt && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/20 p-4 backdrop-blur-md">
          <div className="card-container max-w-sm w-full text-center">
            <div className="text-tactical-amber mb-2 flex justify-center">
              {[1,2,3].map(i => <div key={i} className="w-4 h-1 bg-tactical-amber mx-1 opacity-50" />)}
            </div>
            <h2 className="font-army text-2xl uppercase mb-3 tracking-tighter text-red">Conflict Detected</h2>
            <p className="font-mono text-army-light text-[11px] mb-6 leading-relaxed uppercase">
              This Username already seems to be in our database.<br /><br />
              If you have taken this trivia before and you want to retake it, you can overwrite your last rank and obtain a new one.<br /><br />
              If you've not taken this test at all, consider changing your name or adding something unique to show it's you!.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => handleRetake(true)}
                className="btn-primary py-3 px-6 z-10"
              >
                Overwrite
              </button>
              <button 
                onClick={() => handleRetake(false)}
                className="btn-primary py-3 px-6 z-10 opacity-70 hover:opacity-100"
              >
                Abort
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
