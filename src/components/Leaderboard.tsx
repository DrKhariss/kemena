import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Medal, User, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface LeaderboardEntry {
  username: string;
  score: number;
  rank: string;
  remark: string;
  timestamp: any;
}

interface LeaderboardProps {
  highlightUser?: string;
}

export default function Leaderboard({ highlightUser }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [entryLimit, setEntryLimit] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, 'leaderboard'), 
      orderBy('score', 'desc'),
      limit(entryLimit)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as LeaderboardEntry);
      setEntries(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'leaderboard');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [entryLimit]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <Loader2 className="animate-spin text-tactical-cyan mb-6" size={64} />
        <h2 className="font-army text-2xl uppercase tracking-[0.3em] text-tactical-cyan">Scanning Secure Database...</h2>
        <div className="mt-4 font-mono text-[9px] text-army-light uppercase">Syncing Operative Profiles...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-12 px-2 sm:px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl mb-8 sm:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-army-light hover:text-tactical-amber transition-colors mb-4 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> [ RETURN TO HQ ]
          </button>
          <div className="hud-label text-tactical-amber mb-2">OPERATIONAL SQUAD ROSTER</div>
          <h1 className="font-army text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tighter text-tactical-cyan leading-tight">#KEMENARMY RANKINGS</h1>
        </div>
        <div className="text-left sm:text-right border-l-2 sm:border-l-0 sm:border-r-2 border-black/10 px-4 w-full sm:w-auto">
          <div className="font-mono text-[9px] text-army-light uppercase">Active Personnel</div>
          <span className="text-tactical-cyan font-army text-2xl sm:text-3xl uppercase tracking-widest">{entries.length} SOLDIERS</span>
        </div>
      </div>

      <div className="card-container !w-full !max-w-2xl p-0 overflow-hidden bg-army-dark shadow-xl border-black/5">
        <div className="grid grid-cols-12 gap-1 sm:gap-2 p-3 sm:p-4 border-b border-black/5 bg-army-green/10 text-[8px] sm:text-[9px] uppercase font-mono font-bold tracking-wider sm:tracking-[0.2em] text-army-light">
          <div className="col-span-2 text-center">SIG</div>
          <div className="col-span-6">OPERATIVE_ID</div>
          <div className="col-span-2 text-center">SCORE</div>
          <div className="col-span-2 text-right">CLASS</div>
        </div>

        <div className="divide-y divide-black/5">
          {entries.length === 0 ? (
            <div className="p-16 text-center text-army-light font-mono uppercase tracking-[0.3em] text-xs">
              No personnel records found.
            </div>
          ) : (
            entries.map((entry, index) => {
              const IsHighlight = highlightUser && entry.username.toLowerCase() === highlightUser.toLowerCase();
              return (
                <div 
                  key={index} 
                  className={`grid grid-cols-12 gap-1 sm:gap-2 p-3 sm:p-5 transition-all duration-300 items-center relative overflow-hidden group
                    ${IsHighlight ? 'bg-army-green/10' : 'hover:bg-army-green/5'}`}
                >
                  {IsHighlight && <div className="absolute left-0 top-0 bottom-0 w-1 bg-tactical-amber" />}
                  
                  <div className="col-span-2 flex justify-center">
                    {index === 0 ? (
                      <Trophy className="text-tactical-cyan" size={20} />
                    ) : index === 1 ? (
                      <div className="font-army text-xl sm:text-2xl text-army-light opacity-50">02</div>
                    ) : (
                      <span className="text-army-light font-mono text-[9px] sm:text-[10px]">#{index + 1}</span>
                    )}
                  </div>

                  <div className="col-span-6 flex flex-col min-w-0">
                    <span className="text-tactical-cyan font-mono font-bold uppercase tracking-wide sm:tracking-widest truncate flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs">
                       {entry.username} 
                       {IsHighlight && (
                         <span className="text-[6px] sm:text-[7px] bg-tactical-cyan text-army-dark px-1 sm:px-1.5 py-0.5 font-bold animate-pulse shrink-0">
                           ID
                         </span>
                       )}
                    </span>
                    <span className="text-[7px] sm:text-[9px] text-army-light font-mono opacity-60 uppercase truncate">
                      DEP: {entry.timestamp?.toDate ? entry.timestamp.toDate().toLocaleDateString() : 'UNKNOWN'}
                    </span>
                  </div>

                  <div className="col-span-2 text-center">
                    <span className="text-lg sm:text-2xl font-army text-tactical-cyan tracking-widest">{entry.score}</span>
                    <span className="text-[7px] sm:text-[10px] text-army-light font-mono ml-0.5 opacity-50">/10</span>
                  </div>

                  <div className="col-span-2 text-right">
                    <span className={`text-[7px] sm:text-[9px] px-1.5 sm:px-3 py-1 font-mono font-bold uppercase tracking-tighter border
                      ${entry.score >= 9 ? 'bg-tactical-cyan text-army-dark border-tactical-cyan' : 
                        entry.score >= 7 ? 'bg-army-green/10 border-black/10 text-tactical-cyan' : 
                        'bg-transparent border-black/5 text-army-light'}`}>
                      {entry.rank.split(' ')[0]}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {entries.length >= entryLimit && (
        <button 
          onClick={() => setEntryLimit(prev => prev + 10)}
          className="mt-6 flex items-center gap-2 bg-tactical-cyan/10 border border-tactical-cyan/30 text-tactical-cyan px-6 py-3 font-mono text-[10px] uppercase font-bold hover:bg-tactical-cyan hover:text-army-dark transition-all active:scale-95"
        >
          [ EXTEND RECONNAISSANCE - SEE MORE ]
        </button>
      )}
      
      <div className="mt-8 sm:mt-12 text-center text-army-light font-mono text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.4em] max-w-sm border-t border-black/5 pt-6 mx-auto">
        Records are synced in real-time across secure channels. Overwriting existing data packets requires re-examination.
      </div>
    </div>
  );
}
