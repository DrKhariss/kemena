import { useState, useEffect } from 'react';
import { Save, Loader2, LogIn, LogOut, Shield, AlertTriangle, Image as ImageIcon, FileText, Music, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { 
  doc, 
  onSnapshot, 
  setDoc,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, User, updatePassword } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import Odoo from '../assets/Odoo.jpg.jpeg';

const ADMIN_EMAILS = ['chukwuebukankemena@gmail.com', 'realkemena@gmail.com', 'management@kemenamusic.com'];

interface ConfigData {
  heroImageUrl: string;
  bioText: string;
  battleMusicUrl: string;
}

export default function AdminConsole() {
  const [config, setConfig] = useState<ConfigData>({
    heroImageUrl: '',
    bioText: '',
    battleMusicUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [credMessage, setCredMessage] = useState('');
  const [user, setUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    const docRef = doc(db, 'config', 'mainPage');
    const unsubscribeStore = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        
      // TEMPORARY OVERRIDE

let fetchedBioText =
  data.bioText ||
  "When I was recording this song, it felt how most records I make feel -- special.\nBut this one made it to the top of the pile, it’s its time. Odoo, out Friday the 10th";

let fetchedHeroImage =
  data.heroImageUrl && data.heroImageUrl.length < 1000
    ? data.heroImageUrl
    : Odoo;

        setConfig({
          heroImageUrl: fetchedHeroImage,
          bioText: fetchedBioText,
          battleMusicUrl: data.battleMusicUrl || '',
        });
      }
      setLoading(false);
    }, (err) => {
      console.error('Firestore Error:', err);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeStore();
    };
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      const isNotFoundOrInvalid = err.code === 'auth/user-not-found' || 
                                  err.code === 'auth/invalid-credential' || 
                                  err.code === 'auth/invalid-login-credentials';
                                  
      if (err.code === 'auth/operation-not-allowed') {
         setMessage('ERROR: EMAIL_AUTH_DISABLED_IN_FIREBASE');
      } else if (err.code === 'auth/too-many-requests') {
         setMessage('ERROR: TOO_MANY_FAILED_ATTEMPTS_PLEASE_WAIT');
      } else if (isNotFoundOrInvalid && ADMIN_EMAILS.includes(email)) {
         if (password === 'kemenaconsole123') {
           try {
             await createUserWithEmailAndPassword(auth, email, password);
           } catch (createErr: any) {
             console.error(createErr);
             if (createErr.code === 'auth/email-already-in-use') {
               setMessage('ERROR: INVALID_CREDENTIALS');
             } else {
               setMessage('ERROR: ACCOUNT_CREATION_FAILED');
             }
           }
         } else {
           setMessage('ERROR: INVALID_CREDENTIALS');
         }
      } else if (isNotFoundOrInvalid) {
         setMessage('ERROR: INVALID_CREDENTIALS');
      } else {
        console.error(err);
        setMessage('ERROR: LOGIN_FAILED');
      }
    }
  };

  const handleUpdateCredentials = async () => {
    if (!newPassword) {
      setCredMessage('ERROR: PASSWORD_CANNOT_BE_EMPTY');
      return;
    }
    
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setCredMessage('CREDENTIALS_UPDATED_SUCCESSFULLY');
        setNewPassword('');
        setTimeout(() => setCredMessage(''), 3000);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        setCredMessage('ERROR: REQUIRES_RECENT_LOGIN. PLEASE RELOGIN.');
      } else {
        setCredMessage('ERROR: UPDATE_FAILED');
      }
    }
  };

  const handleLogout = () => signOut(auth);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 800000) { // ~800KB limit for base64 in Firestore (1MB doc limit)
      setMessage('ERROR: FILE_TOO_LARGE_MAX_800KB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setConfig({ ...config, heroImageUrl: reader.result as string });
      setMessage('IMAGE_STAGED_FOR_UPLOAD');
      setTimeout(() => setMessage(''), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
      setMessage('ERROR: INSUFFICIENT_PERMISSIONS');
      return;
    }

    // Word count check
    const wordCount = config.bioText.trim().split(/\s+/).length;
    if (wordCount > 250) {
      setMessage(`ERROR: BIO_EXCEEDS_250_WORDS (${wordCount} words)`);
      return;
    }

    setSaving(true);
    setMessage('');
    
    try {
      await setDoc(doc(db, 'config', 'mainPage'), {
        heroImageUrl: config.heroImageUrl,
        bioText: config.bioText,
        battleMusicUrl: config.battleMusicUrl,
        updatedAt: serverTimestamp()
      });

      setMessage('SYSTEM_CONFIG_UPDATED_SUCCESSFULLY');
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      console.error(err);
      setMessage('ERROR: SYNC_FAILURE');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-tactical-amber mb-4" size={48} />
      <div className="font-mono text-[10px] tracking-widest animate-pulse">ESTABLISHING_SECURE_LINK...</div>
    </div>
  );

  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return (
      <div className="w-full max-w-4xl mx-auto py-8 sm:py-24 px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 border border-white/5 p-6 sm:p-12 backdrop-blur-sm w-full mx-auto"
        >
          <Shield size={48} className="text-tactical-amber mx-auto mb-6" />
          <h1 className="font-army text-2xl sm:text-3xl uppercase text-tactical-cyan mb-4 break-words">
            RESTRICTED<br />CONSOLE
          </h1>
          <p className="font-mono text-[10px] sm:text-[11px] text-army-light uppercase tracking-widest mb-8 px-2">
            Signal restricted to #KEMENA_HIGH_COMMAND authorized relay nodes only.
          </p>
          <div className="w-full max-w-sm mx-auto flex flex-col gap-4 mb-8">
            <input 
              type="email" 
              placeholder="email" 
              value={email}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 font-mono text-[11px] text-tactical-cyan focus:outline-none focus:border-tactical-amber text-center"
            />
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 font-mono text-[11px] text-tactical-cyan focus:outline-none focus:border-tactical-amber text-center pr-10"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-tactical-cyan hover:text-tactical-amber transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button 
            onClick={handleLogin}
            className="flex items-center justify-center gap-3 bg-tactical-cyan text-army-dark px-4 sm:px-8 py-3 mx-auto font-mono text-[11px] uppercase font-bold hover:bg-tactical-amber hover:text-white transition-all active:scale-95 w-full max-w-sm"
          >
            <LogIn size={18} /> AUTHENTICATE_OPERATOR
          </button>
          
          {user && (
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-red-500 font-mono text-[9px] uppercase">
                <AlertTriangle size={14} /> 
                IDENT_MISMATCH: {user.email}
              </div>
              <button onClick={handleLogout} className="text-tactical-cyan hover:text-tactical-amber font-mono text-[9px] uppercase underline">
                TERMINATE_SIGNAL
              </button>
            </div>
          )}
          
          {message && (
             <div className="mt-6 text-red-500 font-mono text-[10px] uppercase tracking-widest px-2">{message}</div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      <div className="mb-8 sm:mb-12 border-b border-white/10 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <div className="hud-label text-tactical-amber mb-2">SYSTEM_OVERRIDE_CENTER</div>
          <h1 className="font-army text-3xl sm:text-5xl uppercase tracking-tighter text-tactical-cyan">LANDING_PAGE_CTRL</h1>
          <p className="font-mono text-[11px] text-army-light mt-2 uppercase tracking-widest">
            OPERATOR: <span className="text-tactical-cyan">{user.email}</span>
          </p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 border border-white/10 text-white/40 px-4 py-2 font-mono text-[9px] uppercase hover:border-red-500 hover:text-red-500 transition-all active:scale-95"
        >
          <LogOut size={14} /> LOGOUT
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Image Section */}
        <div className="bg-black/20 border border-white/5 p-5 sm:p-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-8">
            <ImageIcon size={20} className="text-tactical-cyan" />
            <h2 className="font-mono text-xs uppercase font-bold tracking-widest text-tactical-cyan">HERO_IMAGE_CONFIG</h2>
          </div>

          <div className="text-tactical-amber font-mono text-[11px] mb-4 uppercase tracking-widest bg-tactical-amber/10 border border-tactical-amber/20 p-4">
            [NOTICE] The hero image is currently configured to load locally from the codebase (src/assets) for optimal high-resolution performance, circumventing Firestore's 1MB document limit for large imagery. To change the image, update the image file and the import in src/components/Home.tsx.
          </div>
        </div>

        {/* Bio Text Section */}
        <div className="bg-black/20 border border-white/5 p-5 sm:p-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-8">
            <FileText size={20} className="text-tactical-cyan" />
            <h2 className="font-mono text-xs uppercase font-bold tracking-widest text-tactical-cyan">BIOGRAPHY_DATA_STREAM</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="hud-label">TEXT_PAYLOAD (MAX 250 WORDS)</div>
              <div className="font-mono text-[10px] text-army-light">
                WORDS: <span className={config.bioText.trim().split(/\s+/).filter(Boolean).length > 250 ? 'text-red-500' : 'text-tactical-cyan'}>
                  {config.bioText.trim().split(/\s+/).filter(Boolean).length}
                </span> / 250
              </div>
            </div>
            <textarea 
              value={config.bioText}
              onChange={(e) => setConfig({ ...config, bioText: e.target.value })}
              rows={8}
              placeholder="ENTER_ARTIST_BIOGRAPHY_HERE..."
              className="w-full bg-white/5 border border-white/10 px-6 py-4 font-mono text-[13px] leading-relaxed text-tactical-cyan focus:outline-none focus:border-tactical-amber transition-colors resize-none"
            />
          </div>
        </div>

        {/* Battle Music Section */}
        <div className="bg-black/20 border border-white/5 p-5 sm:p-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-8">
            <Music size={20} className="text-tactical-cyan" />
            <h2 className="font-mono text-xs uppercase font-bold tracking-widest text-tactical-cyan">BATTLE_MUSIC_FEED</h2>
          </div>

          <div className="space-y-4">
            <div className="hud-label">AUDIO SOURCE URL (MP3/WAV)</div>
            <input 
              type="text" 
              value={config.battleMusicUrl}
              onChange={(e) => setConfig({ ...config, battleMusicUrl: e.target.value })}
              placeholder="ENTER_AUDIO_URL_HERE..."
              className="w-full bg-white/5 border border-white/10 px-6 py-4 font-mono text-[13px] text-tactical-cyan focus:outline-none focus:border-tactical-amber transition-colors"
            />
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 bg-tactical-cyan/5 border border-tactical-cyan/10">
          <div className="font-mono text-[11px] text-army-light uppercase tracking-widest text-center sm:text-left">
            {message ? (
              <span className={message.startsWith('ERROR') ? 'text-red-500' : 'text-tactical-amber'}>
                [ STATUS ]: {message}
              </span>
            ) : (
              <span>[ STANDBY ]: READY_FOR_SYNC</span>
            )}
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-tactical-amber text-army-dark px-8 sm:px-16 py-4 font-mono text-[12px] uppercase font-bold hover:bg-tactical-amber/80 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-tactical-amber/20"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            COMMIT_TO_DATABASE
          </button>
        </div>

        {/* Credentials Update Section */}
        <div className="bg-black/20 border border-red-500/30 p-5 sm:p-8 backdrop-blur-sm mt-8">
          <div className="flex items-center gap-3 mb-8">
            <Shield size={20} className="text-red-500" />
            <h2 className="font-mono text-xs uppercase font-bold tracking-widest text-red-500">OPERATOR_CREDENTIALS_UPDATE</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 space-y-2">
              <div className="hud-label">NEW_PASSWORD</div>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="ENTER_NEW_PASSWORD..."
                className="w-full bg-white/5 border border-white/10 px-4 py-3 font-mono text-[11px] text-tactical-cyan focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="font-mono text-[10px] text-army-light uppercase tracking-widest">
              {credMessage ? (
                <span className={credMessage.startsWith('ERROR') ? 'text-red-500' : 'text-tactical-cyan'}>
                  {credMessage}
                </span>
              ) : (
                <span className="text-red-500/70">WARNING: UPDATING_CREDENTIALS_IS_IRREVERSIBLE</span>
              )}
            </div>
            <button 
              onClick={handleUpdateCredentials}
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-red-500 text-red-500 px-6 py-3 font-mono text-[11px] uppercase font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95"
            >
              <Shield size={14} /> UPDATE_CREDENTIALS
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
