import { useState } from 'react';
import { Mail, Github, Instagram, Twitter, Facebook, ChevronDown, Menu, X, Moon, Sun, Trophy, Home as HomeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import kemenaLogo from '../assets/kemena.png';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const contactLinks = [
    { icon: <Mail size={16} />, label: 'Email', href: 'mailto:realkemena@gmail.com' },
    { icon: <Twitter size={16} />, label: 'Twitter', href: 'https://x.com/kemenamusic' },
    { icon: <Instagram size={16} />, label: 'Instagram', href: 'https://www.instagram.com/kemenamusic' },
    { icon: <Facebook size={16} />, label: 'Facebook', href: 'https://www.facebook.com/Iamkemena' },
  ];

  const musicLinks = [
    { label: 'Spotify', href: 'https://open.spotify.com/artist/0SGTAjot9GShYwCQ69DfG2' },
    { label: 'YouTube', href: 'https://www.youtube.com/@Kemenamusic' },
    { label: 'Boomplay', href: 'https://www.boomplay.com/share/artist/5182897' },
    { label: 'SoundCloud', href: 'https://on.soundcloud.com/srtsaaEoqZ9tq5Ja5B' },
  ];

  return (
    <>
      <nav className="nav-fixed-hardened h-[80px] sm:h-[100px] bg-army-dark border-b border-black/5 shadow-md transition-colors duration-300 pointer-events-auto">
        <div className="h-full max-w-[1440px] mx-auto flex justify-between items-center px-4 md:px-8 lg:px-12 border-x border-transparent sm:border-black/5">
          {/* Left side: Logo */}
          <div className="flex-1 flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src={kemenaLogo} 
                alt="Kemena Logo" 
                className={`h-7 sm:h-8 md:h-9 w-auto object-contain transition-all duration-300 ${
                  theme === 'dark' ? 'brightness-200' : 'brightness-0'
                }`}
                referrerPolicy="no-referrer"
              />
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center items-center md:gap-5 lg:gap-10">
            <Link 
              to="/" 
              className={`nav-link cursor-pointer flex items-center gap-2 ${location.pathname === '/' ? '!text-tactical-amber' : ''}`}
            >
              <HomeIcon size={14} /> HOME
            </Link>

            <div 
              className="relative group h-full flex items-center"
              onMouseEnter={() => setIsMusicOpen(true)}
              onMouseLeave={() => setIsMusicOpen(false)}
            >
              <button className={`nav-link cursor-pointer ${isMusicOpen ? '!text-tactical-amber' : ''}`}>
                <span className="text-[9px] lg:text-[10px] text-tactical-amber mr-1">01</span> MUSIC <ChevronDown size={14} className="group-hover:text-tactical-amber transition-colors" />
              </button>
              <AnimatePresence>
                {isMusicOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-48 bg-white dark:bg-army-dark border border-black/5 shadow-2xl overflow-hidden backdrop-blur-xl"
                  >
                    {musicLinks.map((link, i) => (
                      <a 
                        key={i} 
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-3 hover:bg-black/5 text-[11px] text-army-light dark:text-tactical-cyan hover:text-tactical-amber transition-colors uppercase tracking-widest font-mono border-b border-black/5 last:border-none"
                      >
                        {link.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div 
              className="relative group h-full flex items-center"
              onMouseEnter={() => setIsContactOpen(true)}
              onMouseLeave={() => setIsContactOpen(false)}
            >
              <button className={`nav-link cursor-pointer ${isContactOpen ? '!text-tactical-amber' : ''}`}>
                <span className="text-[9px] lg:text-[10px] text-tactical-amber mr-1">02</span> CONTACT <ChevronDown size={14} className="group-hover:text-tactical-amber transition-colors" />
              </button>
              <AnimatePresence>
                {isContactOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-48 bg-white dark:bg-army-dark border border-black/5 shadow-2xl overflow-hidden backdrop-blur-xl"
                  >
                    {contactLinks.map((link, i) => (
                      <a 
                        key={i} 
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-black/5 text-[11px] text-army-light dark:text-tactical-cyan hover:text-tactical-amber transition-colors font-mono border-b border-black/5 last:border-none"
                      >
                        {link.icon} {link.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              to="/trivia" 
              className="bg-tactical-amber/5 border border-tactical-amber/20 text-tactical-amber hover:bg-tactical-amber hover:text-white transition-all active:scale-95 md:px-2 lg:px-4 py-2 font-mono text-[9px] lg:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap hover:border-tactical-amber shadow-sm"
            >
               PLAY TRIVIA
            </Link>
          </div>

          {/* Right side: Leaderboard + Theme Toggle */}
          <div className="flex-1 flex items-center justify-end gap-3 lg:gap-6">
            <Link 
              to="/leaderboard" 
              className="hidden md:flex items-center gap-2 nav-link p-2 group"
              title="View Leaderboard"
            >
              <Trophy size={18} className="text-tactical-amber group-hover:scale-110 transition-transform" />
              <span className="hidden lg:inline text-[11px] tracking-[0.2em]">LEADERBOARD</span>
            </Link>

            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-none border border-black/10 text-tactical-cyan hover:border-tactical-amber hover:text-tactical-amber transition-all active:scale-95 bg-army-green/10"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden text-tactical-cyan p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-army-dark z-[10001] p-6 sm:p-8 flex flex-col gap-8 md:hidden overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <img 
                  src={kemenaLogo} 
                  alt="Kemena Logo" 
                  className={`h-5 w-auto object-contain ${
                    theme === 'dark' ? 'brightness-200' : 'brightness-0'
                  }`}
                  referrerPolicy="no-referrer"
                />
              </Link>
              <button onClick={() => setIsMenuOpen(false)} className="text-tactical-cyan">
                <X size={32} />
              </button>
            </div>
            
            <div className="space-y-6">
              <h3 className="hud-label">Tactical Portal</h3>
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-4 text-xl font-mono uppercase transition-colors ${location.pathname === '/' ? 'text-tactical-amber' : 'text-tactical-cyan'}`}
              >
                <HomeIcon size={23} /> Home
              </Link>
              <Link 
                to="/trivia" 
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-4 text-xl font-mono uppercase transition-colors ${location.pathname === '/trivia' ? 'text-tactical-amber' : 'text-tactical-cyan'}`}
              >
                <div className="w-2 h-2 bg-tactical-amber rotate-45"></div> Play Trivia
              </Link>
            </div>

            <div className="space-y-6">
              <h3 className="hud-label">Leaderboard</h3>
              <Link 
                to="/leaderboard" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 text-xl text-tactical-amber font-mono uppercase hover:text-tactical-cyan transition-colors"
              >
                <Trophy size={20} /> Leaderboard
              </Link>
            </div>

            <div className="space-y-6 pt-4">
              <h3 className="hud-label">Contacts</h3>
              {contactLinks.map((link, i) => (
                <a 
                  key={i} 
                  href={link.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-xl text-tactical-cyan font-mono uppercase hover:text-tactical-amber transition-colors"
                >
                  {link.icon} {link.label}
                </a>
              ))}
            </div>

            <div className="space-y-6 pt-8 border-t border-black/10">
              <h3 className="hud-label">Music</h3>
              {musicLinks.map((link, i) => (
                <a 
                  key={i} 
                  href={link.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl flex text-tactical-cyan font-army uppercase tracking-widest hover:text-tactical-amber transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
