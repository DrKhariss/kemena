import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Share2, Trophy, ArrowRight, Loader2, Send, Twitter, Facebook, Instagram, MessageCircle, AtSign, User, Mail, Phone, Globe, Calendar, Hash } from 'lucide-react';
import { toBlob } from 'html-to-image';
import Select from 'react-select';
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TRIVIA_QUESTIONS, getRankData, Question } from '../constants';
import SalutKemena from './SalutKemena';

const COUNTRIES = [
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'United States', label: 'United States' },
  { value: 'Ghana', label: 'Ghana' },
  { value: 'Canada', label: 'Canada' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'Germany', label: 'Germany' },
  { value: 'France', label: 'France' },
  { value: 'Ireland', label: 'Ireland' },
  { value: 'United Arab Emirates', label: 'United Arab Emirates' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Brazil', label: 'Brazil' },
  { value: 'China', label: 'China' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'India', label: 'India' },
  { value: 'Italy', label: 'Italy' },
  { value: 'Jamaica', label: 'Jamaica' },
  { value: 'Japan', label: 'Japan' },
  { value: 'Netherlands', label: 'Netherlands' },
  { value: 'Others', label: 'Others' }
].sort((a, b) => a.label.localeCompare(b.label));

function FanForm({ username }: { username: string }) {
  const [formData, setFormData] = useState({
    name: username,
    email: '',
    phoneNumber: '',
    country: '',
    socialHandle: '',
    dob: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'fans'), {
        ...formData,
        timestamp: serverTimestamp()
      });
      setIsSuccess(true);
    } catch (err) {
      console.error("Error saving fan info:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const customStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: '0',
      minHeight: '45px',
      boxShadow: 'none',
      '&:hover': { borderColor: 'rgba(0, 0, 0, 0.2)' }
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: '#f5f5f5',
      borderRadius: '0',
      zIndex: 50,
      border: '1px solid rgba(0, 0, 0, 0.1)'
    }),
    option: (base: any, state: { isFocused: any; isSelected: any; }) => ({
      ...base,
      backgroundColor: state.isSelected ? '#115e59' : state.isFocused ? 'rgba(17, 94, 89, 0.1)' : 'transparent',
      color: state.isSelected ? 'white' : '#1a1a1a',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '11px',
      textTransform: 'uppercase',
      cursor: 'pointer'
    }),
    singleValue: (base: any) => ({
      ...base,
      color: '#1a1a1a',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '11px',
      textTransform: 'uppercase'
    }),
    placeholder: (base: any) => ({
      ...base,
      color: 'rgba(0,0,0,0.4)',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '11px',
      textTransform: 'uppercase'
    }),
    input: (base: any) => ({
      ...base,
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '11px',
      textTransform: 'uppercase'
    })
  };

  if (isSuccess) {
    return (
      <div className="card-container text-center py-10">
        <Trophy className="mx-auto text-tactical-amber mb-4" size={48} />
        <h3 className="font-army text-2xl text-tactical-cyan uppercase">INTEL SECURED</h3>
        <p className="font-mono text-[10px] text-army-light uppercase mt-2 italic px-4">Soldier, your data has been successfully archived in the #KEMENARMY database.</p>
      </div>
    );
  }

  return (
    <div className="card-container relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3 font-mono text-[8px] text-army-light opacity-30 tracking-widest">#KMN_UNIT_DATABASE</div>
      <div className="hud-label border-b border-black/5 pb-2 mb-6">RECONNAISSANCE PROTOCOL</div>
      <h3 className="font-army text-2xl sm:text-3xl uppercase tracking-wider mb-2 text-tactical-cyan">Join The Elite Division</h3>
      <p className="font-mono text-[10px] text-army-light uppercase mb-8 leading-relaxed">Submit your credentials to authorize full deployment into the #KEMENARMY archives.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-mono text-[10px] text-tactical-cyan uppercase font-bold">
              <User size={12} className="text-tactical-amber" /> Full Name*
            </label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-black/5 border border-black/10 p-3 font-mono text-[11px] uppercase focus:ring-1 focus:ring-tactical-cyan outline-none transition-all placeholder:text-black/20"
              placeholder="DESIGNATION"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-mono text-[10px] text-tactical-cyan uppercase font-bold">
              <Mail size={12} className="text-tactical-amber" /> Email Address*
            </label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-black/5 border border-black/10 p-3 font-mono text-[11px] uppercase focus:ring-1 focus:ring-tactical-cyan outline-none transition-all placeholder:text-black/20"
              placeholder="OPERATIVE@MAIL.COM"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-mono text-[10px] text-tactical-cyan uppercase font-bold">
              <Phone size={12} className="text-tactical-amber" /> Phone Number
            </label>
            <input 
              type="tel" 
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              className="w-full bg-black/5 border border-black/10 p-3 font-mono text-[11px] uppercase focus:ring-1 focus:ring-tactical-cyan outline-none transition-all placeholder:text-black/20"
              placeholder="+234 XXX XXX XXXX"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-mono text-[10px] text-tactical-cyan uppercase font-bold">
              <Globe size={12} className="text-tactical-amber" /> State / Country*
            </label>
            <Select 
              required
              options={COUNTRIES}
              styles={customStyles}
              onChange={(opt: any) => setFormData({...formData, country: opt.value})}
              placeholder="SEARCH TERRITORY"
              className="font-mono text-[11px] tactical-select"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-mono text-[10px] text-tactical-cyan uppercase font-bold">
              <Hash size={12} className="text-tactical-amber" /> IG / X Handle
            </label>
            <input 
              type="text" 
              value={formData.socialHandle}
              onChange={(e) => setFormData({...formData, socialHandle: e.target.value})}
              className="w-full bg-black/5 border border-black/10 p-3 font-mono text-[11px] uppercase focus:ring-1 focus:ring-tactical-cyan outline-none transition-all placeholder:text-black/20"
              placeholder="@HANDLE"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-mono text-[10px] text-tactical-cyan uppercase font-bold">
              <Calendar size={12} className="text-tactical-amber" /> Date of Birth
            </label>
            <input 
              type="date" 
              value={formData.dob}
              onChange={(e) => setFormData({...formData, dob: e.target.value})}
              className="w-full bg-black/5 border border-black/10 p-3 font-mono text-[11px] uppercase focus:ring-1 focus:ring-tactical-cyan outline-none transition-all"
            />
          </div>
        </div>

        <button 
          disabled={isSubmitting}
          type="submit"
          className="btn-primary w-full py-4 mt-6 flex items-center justify-center gap-3 disabled:opacity-50 group"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
          {isSubmitting ? 'TRANSMITTING...' : 'REGISTER INTEL'}
        </button>
      </form>
    </div>
  );
}

interface TriviaProps {
  username: string;
}

export default function Trivia({ username }: TriviaProps) {
  const navigate = useNavigate();
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<{ score: number; rank: string; remark: string } | null>(null);
  const [showSalut, setShowSalut] = useState(false);
  const [validationAttempted, setValidationAttempted] = useState(false);
  const questionsRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const resultCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }
    // Pick 10 random questions
    const shuffled = [...TRIVIA_QUESTIONS].sort(() => 0.5 - Math.random());
    setCurrentQuestions(shuffled.slice(0, 10));
    
    // Animate cards entry
    gsap.from('.question-card', {
      opacity: 0,
      x: 50,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out"
    });
  }, [username, navigate]);

  const handleSelect = (questionId: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    const unansweredIds = currentQuestions
      .filter(q => answers[q.id] === undefined)
      .map(q => q.id);

    if (unansweredIds.length > 0) {
      setValidationAttempted(true);
      alert(`ATTENTION: ${unansweredIds.length} mandatory fields remain unanswered. Please complete the examination.`);
      
      // Scroll to first unanswered
      const firstUnansweredId = unansweredIds[0];
      const element = questionsRefs.current[firstUnansweredId];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    
    // Simulate steps
    const steps = ["Receiving submission...", "Calculating scores...", "Assigning Ranks..."];
    for (let i = 0; i < steps.length; i++) {
      setLoadingStep(i);
      await new Promise(r => setTimeout(r, 1000));
    }

    let score = 0;
    currentQuestions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    const rankData = getRankData(score);
    setResult({ score, ...rankData });

    // Save to leaderboard (Firestore)
    try {
      const q = query(
        collection(db, 'leaderboard'), 
        where('username_lowercase', '==', username.toLowerCase())
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Overwrite existing doc
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          username: username,
          score,
          rank: rankData.rank,
          remark: rankData.remark,
          timestamp: serverTimestamp()
        });
      } else {
        // Create new
        await addDoc(collection(db, 'leaderboard'), {
          username: username,
          username_lowercase: username.toLowerCase(),
          score,
          rank: rankData.rank,
          remark: rankData.remark,
          timestamp: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Failed to save to leaderboard:", error);
    }

    setIsSubmitting(false);
  };

  const handleShare = async () => {
    if (!result || !resultCardRef.current) return;
    const url = window.location.origin;
    const message = `🚨 I just scored ${result.score} on Kemena Army Trivia 😮💨🔥 and I am a ${result.rank} 🪖🏆\n\nThink you know Kemena more than me? 👀\n\nProve it now:\n${url}\n\n#KemenaArmy🧣`;

    try {
      // Capture the card as a snapshot
      const blob = await toBlob(resultCardRef.current, { 
        cacheBust: true, 
        pixelRatio: 2,
        backgroundColor: '#0a0a0a' // Matches CSS dark theme background
      });

      if (blob && navigator.share) {
        const file = new File([blob], 'kemena-promotion.png', { type: 'image/png' });

        // On mobile/supported browsers, use the native share drawer
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'KEMENA_ARMY_PROMOTION',
            text: message,
          });
          return;
        } else {
          await navigator.share({
            title: 'KEMENA_ARMY_PROMOTION',
            text: message,
            url: url
          });
          return;
        }
      } else if (navigator.share) {
        await navigator.share({
          title: 'KEMENA_ARMY_PROMOTION',
          text: message,
          url: url
        });
        return;
      }
    } catch (err) {
      console.error('Capture or share error:', err);
    }
    
    // Fallback for desktop or unsupported browsers
    try {
      await navigator.clipboard.writeText(message);
      alert("Promotion Intel copied to clipboard! Mobilize your network.");
    } catch (clipboardErr) {
      console.error('Clipboard error:', clipboardErr);
    }
  };

  if (isSubmitting) {
    const steps = ["UPLOADING SCORES...", "ANALYZING PERFORMANCE...", "ASSIGNING RANKS..."];
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 overflow-x-hidden">
        <div className="relative mb-8">
           <Loader2 className="animate-spin text-tactical-cyan" size={84} />
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border border-black/10 animate-ping rounded-full" />
           </div>
        </div>
        <h2 className="font-army text-2xl sm:text-3xl uppercase tracking-widest text-tactical-cyan/80">
          {steps[loadingStep]}
        </h2>
        <div className="mt-4 font-mono text-[9px] sm:text-[10px] text-army-light flex gap-2">
           <span className="hidden sm:inline">PROCESSOR: KMN-X88</span>
           <span className="animate-pulse">|</span>
           <span>LATENCY: 14ms</span>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-6 sm:py-12 px-4 overflow-x-hidden space-y-8">
        <div ref={resultCardRef} className="card-container text-center max-w-xl w-full">
          <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-army-light opacity-50">#KEMENARMY_CMD_STATUS</div>
          <Trophy size={64} className="mx-auto text-tactical-cyan mb-6" />
          <div className="hud-label border-b border-black/5 pb-2">PROMOTION GRANTED</div>
          <h1 className="font-army text-4xl sm:text-5xl uppercase tracking-tighter mb-2 mt-4 text-tactical-cyan">RANK: {result.rank}</h1>
          <div className="inline-block bg-army-green/10 border border-black/10 px-4 sm:px-6 py-2 my-4 sm:my-6">
            <p className="font-mono text-tactical-cyan text-[10px] sm:text-xs italic uppercase">"{result.remark}"</p>
          </div>

          <div className="space-y-6 pt-0 pl-0 pb-0 border-t border-black/5">
            <button 
              onClick={handleShare}
              className="btn-primary w-full h-[57px] py-4 flex items-center justify-center gap-3 z-10 group"
            >
              <Share2 size={20} className="group-hover:rotate-12 transition-transform" />
              SHARE TO SOCIALS
            </button>
          </div>

          <button 
            onClick={() => navigate('/leaderboard')}
            className="mt-8 sm:mt-12 btn-primary w-full flex justify-center py-4 z-10"
          >
            Tactical Leaderboard
          </button>
        </div>

        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000 flex justify-center">
           <FanForm username={username} />
        </div>

        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000 flex justify-center">
           <SalutKemena username={username} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 sm:py-8 px-2 sm:px-4 relative overflow-x-hidden">
      <div className="mb-8 sm:mb-12 text-center max-w-lg mx-auto">
        <div className="hud-label border-b border-black/5 inline-block px-4 mb-4">Field Trivia</div>
        <h2 className="font-army text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-tactical-cyan">Test Your Knowledge</h2>
        <div className="flex items-center justify-center gap-4 mt-2">
           <div className="p-1 bg-army-green/10 border border-black/10">
              <p className="font-mono text-[9px] text-tactical-cyan uppercase px-2">OPERATIVE: {username}</p>
           </div>
           <div className="font-mono text-[9px] text-army-light">SECTOR: TRIVIA_07</div>
        </div>
      </div>

      <div className="flex flex-row items-start gap-4 sm:gap-10 max-w-7xl mx-auto mb-12">
        {/* Questions Column */}
        <div className="flex-1 flex flex-col gap-6 sm:gap-10 min-w-0">
          {currentQuestions.map((q, qIndex) => (
            <div 
              key={q.id} 
              ref={el => { questionsRefs.current[q.id] = el; }}
              className={`question-card card-container !w-full transition-all duration-500 ${
                validationAttempted && answers[q.id] === undefined 
                  ? 'ring-2 ring-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] bg-red-50' 
                  : ''
              }`}
            >
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                 <span className="font-mono text-[9px] sm:text-[10px] text-tactical-cyan uppercase tracking-widest">[ QUESTION {qIndex + 1} / 10 ]</span>
                 <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className={`w-2 h-1 sm:w-3 ${i <= qIndex ? 'bg-tactical-amber' : 'bg-army-green/20'}`} />
                    ))}
                 </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-army uppercase tracking-wide mb-6 sm:mb-8 text-tactical-cyan leading-tight">{q.question}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 font-mono">
                {q.options.map((opt, oIndex) => (
                  <button
                    key={oIndex}
                    onClick={() => handleSelect(q.id, oIndex)}
                    className={`text-left p-4 sm:p-5 rounded-none border-l-4 transition-all duration-200 text-[11px] sm:text-xs uppercase tracking-widest relative overflow-hidden group
                      ${answers[q.id] === oIndex 
                        ? 'bg-army-green/10 border-tactical-amber text-tactical-cyan shadow-sm' 
                        : 'bg-army-green/5 border-black/5 text-army-light hover:bg-army-green/10 hover:border-black/20'}`}
                  >
                    <span className="mr-3 text-[10px] opacity-50">
                      {String.fromCharCode(65 + oIndex)} //
                    </span>
                    {opt}
                    {answers[q.id] === oIndex && (
                      <div className="absolute right-0 bottom-0 p-1 opacity-20">
                        <ArrowRight size={24} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tactical Image Column (Sticky Orchestrator) */}
        <aside className="hidden sm:flex sm:w-48 md:w-[300px] lg:w-[500px] sticky top-10 sm:top-24 flex flex-col gap-4 sm:gap-6 shrink-0">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card-container !p-1 bg-black/5 border border-black/10 overflow-hidden group">
              <img 
                src={`/src/assets/trivia-${i}.jpg`} 
                alt={`Tactical Intel ${i}`}
                className="w-full aspect-square object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="mt-1 flex justify-between px-1">
                <div className="h-1 w-6 sm:w-8 bg-tactical-amber/30 group-hover:bg-tactical-amber transition-colors" />
                <span className="font-mono text-[5px] sm:text-[6px] text-army-light/40 group-hover:text-army-light transition-colors">INTEL_0{i}</span>
              </div>
            </div>
          ))}
        </aside>
      </div>

      <div className="flex justify-center mb-16 sm:mb-24">
        <button 
          onClick={handleSubmit}
          className="btn-primary !w-auto px-8 sm:px-24 py-4 sm:py-6 text-xl sm:text-2xl font-army tracking-widest z-10 max-w-[90vw] truncate"
        >
          SUBMIT SELECTION
        </button>
      </div>
    </div>
  );
}
