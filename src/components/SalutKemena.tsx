import { useState, useRef, FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { Send, Loader2, CheckCircle } from 'lucide-react';

interface SalutKemenaProps {
  username: string;
}

export default function SalutKemena({ username }: SalutKemenaProps) {
  const form = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const sendEmail = (e: FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError('');

    // If you have real service IDs, putting them here:
    // emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form.current!, 'YOUR_PUBLIC_KEY')
    
    // For demo/agent purposes, simulate sending:
    setTimeout(() => {
        console.log("Email content would have been sent via EmailJS", form.current);
        setIsSending(false);
        setIsSent(true);
    }, 2000);
  };

  return (
    <div className="card-container bg-white border border-black/5 mt-8 sm:mt-12 overflow-hidden relative shadow-xl !max-w-none">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6 border-b border-black/5 pb-4">
          <div>
            <h3 className="font-army text-2xl text-tactical-cyan uppercase">Secure Comms</h3>
            <p className="font-mono text-army-light text-[8px] sm:text-[9px] uppercase tracking-widest mt-1">Channel: #KEMENARMY_ENCRYPTED</p>
          </div>
          <div className="p-2 border border-black/10">
             <div className="w-2 h-2 bg-tactical-amber animate-pulse" />
          </div>
        </div>

        {isSent ? (
          <div className="flex flex-col items-center py-8 sm:py-10 text-center animate-in zoom-in duration-500">
            <CheckCircle size={64} className="mb-6 text-black" />
            <h3 className="font-army text-2xl sm:text-3xl uppercase tracking-widest text-black">Transmission Successful</h3>
            <p className="font-mono text-army-light text-[10px] mt-4 uppercase px-4 leading-relaxed">Message logged in HQ archives. Stand by for response, Operative {username}.</p>
          </div>
        ) : (
          <form ref={form} onSubmit={sendEmail} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="hud-label px-2 border-l-2 border-black">Tell Kemena Your Name.</label>
                <input 
                  type="text" 
                  name="user_name" 
                  defaultValue={username}
                  className="input-name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="hud-label px-2 border-l-2 border-black">SUBJECT OF YOUR MESSAGE</label>
                <input 
                  type="text" 
                  name="subject" 
                  placeholder="CLASSIFIED..."
                  className="input-name"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="hud-label px-2 border-l-2 border-black">TELL KEMENA ABOUT IT</label>
              <textarea 
                name="message" 
                rows={4}
                placeholder="GIVE SOME DETAILS..."
                className="w-full bg-army-green/10 border-l-2 border-black dark:border-white px-4 py-4 focus:outline-none focus:bg-army-green/20 focus:border-tactical-amber text-tactical-cyan placeholder-army-light font-mono text-sm resize-none transition-all"
                required
              ></textarea>
            </div>

            <button 
              disabled={isSending}
              className="btn-primary flex justify-center items-center gap-3 py-5 z-10 disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center gap-3 font-mono text-sm uppercase tracking-widest">
                {isSending ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Encrypting...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} /> 
                    <span>SEND DIRECTLY TO KEMENA!</span>
                  </>
                )}
              </span>
            </button>
          </form>
        )}
      </div>
      
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 opacity-[0.03] pointer-events-none">
         <h1 className="text-[100px] sm:text-[120px] font-army uppercase leading-[0.8] tracking-widest text-black">COMMS</h1>
      </div>
    </div>
  );
}
