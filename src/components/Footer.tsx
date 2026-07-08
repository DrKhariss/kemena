import { Mail, Instagram, Twitter, Facebook, Trophy, ExternalLink, ShieldCheck, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import kemenaLogo from '../assets/kemena.png';

const SpotifyIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.5 17.3c-.22.36-.7.48-1.06.26-2.92-1.78-6.6-2.18-10.92-1.2-.42.1-.84-.17-.93-.58-.1-.42.17-.84.58-.93 4.74-1.09 8.8-.62 12.07 1.38.37.22.48.7.26 1.07zm1.47-3.26c-.28.45-.87.6-1.33.31-3.34-2.05-8.43-2.64-12.38-1.45-.51.16-1.05-.14-1.21-.65-.15-.51.14-1.05.65-1.2 4.51-1.37 10.12-.7 13.95 1.65.45.28.6.87.31 1.33zm.13-3.4c-4.01-2.38-10.62-2.6-14.46-1.43-.62.19-1.26-.18-1.45-.79-.19-.62.18-1.27.79-1.45 4.41-1.34 11.69-1.08 16.3 1.65.55.33.74 1.04.41 1.6-.33.55-1.04.74-1.59.41z"/>
  </svg>
);

const YoutubeIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const BoomplayIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 3l14 9-14 9V3z" fill="currentColor" />
  </svg>
);

const SoundcloudIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.56 16.92V9.14l-.17-.1a12.01 12.01 0 0 0-1.84-.7l-.17.06v8.52h2.18zM8.88 16.92V9.1l-.18-.08c-.7-.28-1.43-.5-2.18-.62l-.18.04v8.48h2.54zM6.16 16.92v-8c-.7-.14-1.42-.23-2.16-.27l-.19.03v8.24h2.35zM3.44 16.92V9.32l-.21.05c-.6.18-1.2.43-1.8.7l-.21.14v6.71h2.22zM21.72 13.91V16.92H24v-3.08c0-1.61-1.07-2.92-2-3.15-.36-.08-.73-.12-1.11-.12h-.32a6.3 6.3 0 0 0-5.89-4.2c-2.4 0-4.5 1.34-5.6 3.32l-.12.22.12.22v6.8h2.09l.1.01V9.45c.8-1.4 2.22-2.31 3.86-2.31 2.22 0 4.09 1.63 4.41 3.77l.06.39h.44c.4 0 .78.07 1.14.2.82.26 1.43 1.02 1.43 1.94v.47zM.72 16.92V11c-.32.32-.6.7-.93 1.07v4.85h.93zM14.28 16.92V8.34l-.15-.17a10.2 10.2 0 0 0-2.39-2.03l-.15.09v10.69h2.69z"/>
  </svg>
);

export default function Footer() {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  const musicPlatformLinks = [
    { icon: <SpotifyIcon size={18} />, label: 'Spotify', href: 'https://open.spotify.com/artist/0SGTAjot9GShYwCQ69DfG2' },
    { icon: <YoutubeIcon size={18} />, label: 'YouTube', href: 'https://www.youtube.com/@Kemenamusic' },
    { icon: <BoomplayIcon size={18} />, label: 'Boomplay', href: 'https://www.boomplay.com/share/artist/5182897' },
    { icon: <SoundcloudIcon size={18} />, label: 'SoundCloud', href: 'https://on.soundcloud.com/srtsaaEoqZ9tq5Ja5B' },
  ];

  const contactLinks = [
    { icon: <Mail size={18} />, label: 'Management', href: 'mailto:realkemena@gmail.com' },
    { icon: <Twitter size={18} />, label: 'Twitter', href: 'https://x.com/kemenamusic' },
    { icon: <Instagram size={18} />, label: 'Instagram', href: 'https://www.instagram.com/kemenamusic' },
    { icon: <Facebook size={18} />, label: 'Facebook', href: 'https://www.facebook.com/Iamkemena' },
  ];

  const quickLinks = [
    { label: 'Play Trivia', path: '/trivia', icon: <Play size={14} /> },
    { label: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={14} /> },
    { label: 'Discover Music', path: 'https://open.spotify.com/artist/0SGTAjot9GShYwCQ69DfG2', icon: <ExternalLink size={14} /> },
    { label: 'Console', path: '/admin', icon: <ShieldCheck size={14} /> },
  ];

  return (
    <footer className="w-full bg-army-dark dark:bg-army-green/50 border-t border-black/10 dark:border-white/5 transition-colors duration-300 py-16 px-6 sm:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 pb-16 items-start border-b border-black/10 dark:border-white/5">
          {/* Brand Section */}
          <div className="flex flex-col gap-7">
            <Link to="/" className="inline-block -mt-1">
              <img 
                src={kemenaLogo} 
                alt="Kemena Logo" 
                className={`h-9 w-auto object-contain transition-all duration-300 ${
                  theme === 'dark' ? 'brightness-200' : 'brightness-0'
                }`}
                referrerPolicy="no-referrer"
              />
            </Link>
            <p className="font-mono text-[11px] leading-relaxed text-army-light uppercase tracking-wider max-w-[260px]">
              Directing tactical audio feeds and visual signals across the digital landscape. Join the #KEMENARMY to discover your true rank.
            </p>
            <div className="flex items-center gap-2 text-tactical-amber">
              <ShieldCheck size={14} />
              <span className="font-mono text-[10px] tracking-[0.2em] font-bold">ENCRYPTED TRANSMISSION</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-7">
            <h3 className="hud-label font-bold !text-tactical-cyan">Navigation</h3>
            <ul className="space-y-4">
              {quickLinks.map((link, i) => {
                const isExternal = link.path.startsWith('http');

                return (
                  <li key={i}>
                    {isExternal ? (
                      <a 
                        href={link.path} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-[13px] font-mono uppercase tracking-widest text-tactical-cyan hover:text-tactical-amber transition-all group"
                      >
                        <span className="text-tactical-amber opacity-0 group-hover:opacity-100 transition-opacity -ml-2">/</span>
                        {link.label}
                        <span className="opacity-70 dark:opacity-60">{link.icon}</span>
                      </a>
                    ) : (
                      <Link 
                        to={link.path}
                        className={link.label === 'Play Trivia' 
                          ? "inline-flex items-center gap-3 px-4 py-2 bg-tactical-amber/5 border border-tactical-amber/20 text-tactical-amber hover:bg-tactical-amber hover:text-white transition-all active:scale-95 hover:border-tactical-amber shadow-sm mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.1em] whitespace-nowrap"
                          : "flex items-center gap-3 text-[13px] font-mono uppercase tracking-widest text-tactical-cyan hover:text-tactical-amber transition-all group"
                        }
                      >
                        {link.label !== 'Play Trivia' && <span className="text-tactical-amber opacity-0 group-hover:opacity-100 transition-opacity -ml-2">/</span>}
                        {link.label}
                        <span className="opacity-70 dark:opacity-60">{link.icon}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="flex flex-col gap-7">
            <h3 className="hud-label font-bold !text-tactical-cyan">#KEMENARMY INTEL</h3>
            <div className="flex flex-col gap-5">
              <p className="font-mono text-[10px] leading-relaxed text-army-light uppercase tracking-wider max-w-[240px]">
                Subscribe to the #KEMENARMY Newsletters and Information.
              </p>
              <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="INPUT_EMAIL_TOKEN"
                    className="w-full bg-black/5 dark:bg-white/5 border-l-2 border-tactical-cyan px-4 py-3 font-mono text-[10px] text-tactical-cyan focus:outline-none focus:border-tactical-amber transition-all placeholder:text-army-light/30"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-tactical-cyan text-army-dark py-3 font-mono text-[10px] font-bold tracking-[0.2em] hover:bg-tactical-amber hover:text-white transition-all active:scale-95 shadow-lg shadow-black/10"
                >
                  JOIN_NETWORK
                </button>
              </form>
            </div>
          </div>

          {/* Social & Music Section */}
          <div className="flex flex-col gap-9">
            {/* Music Platforms - Distinct Style */}
            <div className="flex flex-col gap-4">
              <h3 className="hud-label font-bold !text-tactical-amber text-[10px]">Music Platforms</h3>
              <div className="flex flex-wrap gap-2.5">
                {musicPlatformLinks.map((link, i) => (
                  <a 
                    key={i} 
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-tactical-amber/5 border border-tactical-amber/20 text-tactical-amber hover:bg-tactical-amber hover:text-white transition-all active:scale-95 group relative hover:border-tactical-amber"
                    title={link.label}
                  >
                    {link.icon}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-950 text-white text-[9px] font-mono uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl whitespace-nowrap z-50">
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* General Socials */}
            <div className="flex flex-col gap-4">
              <h3 className="hud-label font-bold !text-tactical-cyan text-[10px]">Socials & Contact</h3>
              <div className="flex flex-wrap gap-2.5">
                {contactLinks.map((link, i) => (
                  <a 
                    key={i} 
                    href={link.href}
                    className="p-3 border border-tactical-cyan/10 text-tactical-cyan hover:border-tactical-amber hover:text-tactical-amber transition-all hover:bg-tactical-amber/5 active:scale-95 group relative"
                    title={link.label}
                  >
                    {link.icon}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-950 dark:bg-white text-white dark:text-black text-[9px] font-mono uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl whitespace-nowrap z-50">
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-mono text-[10px] text-army-light uppercase tracking-widest font-medium">
            © {currentYear} KEMENA MUSIC // ALL RIGHTS RESERVED
          </div>
          <div className="flex items-center gap-4 font-mono text-[9px] text-army-light uppercase tracking-widest">
            <span>Lat: 6.5244° N</span>
            <span>Lng: 3.3792° E</span>
            <div className="w-1.5 h-1.5 rounded-full bg-tactical-amber animate-pulse"></div>
            <span>System: Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
