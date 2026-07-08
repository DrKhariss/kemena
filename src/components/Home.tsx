import { useEffect, useState, useRef } from 'react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { motion, useMotionValue, useAnimationFrame, animate } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCards, Navigation, Mousewheel } from 'swiper/modules';
import { Play, Disc, Music, Share2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import trivia1 from '../assets/trivia-1.jpg';
import trivia2 from '../assets/trivia-2.jpg';
import trivia3 from '../assets/trivia-3.jpg';
import trivia4 from '../assets/trivia-4.jpg';
import cantDeny from '../assets/Cant-deny.jpg';
import aabena from '../assets/Aabena.jpg';
import swerve from '../assets/swerve.jpg';
import vowels from '../assets/vowels.jpg';
import suzana from '../assets/Suzana.jpg';
import wicked from '../assets/wicked.jpg';
import darling from '../assets/darling.jpg';
import rewind from '../assets/rewind.jpg';
import badthing from '../assets/badthing.jpg';
import everybody from '../assets/everybody.jpg';
import hellgirl from '../assets/hellgirl.jpg';
import lies from '../assets/lies.jpg';
import live from '../assets/live.jpg';
import www from '../assets/www.jpg';
import teni from '../assets/Teni.jpg';
import joeboy from '../assets/Joeboy.webp';
import nikitaKering from '../assets/Nikita Kerring.jpg';
import laycon from '../assets/laycon.jpg';
import odu from '../assets/odu.jpg';
import ric from '../assets/ric.jpg';
import tempoe from '../assets/tempoe.jpg';
import oxygen from '../assets/oxygen.jpg';
import dwin from '../assets/dwin.jpg'
import mavin from '../assets/mavin.jpg'
import chocolatecity from '../assets/chocolatecity.jpg'
import Odoo from '../assets/Odoo.jpg'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/navigation';

interface ConfigData {
  heroImageUrl: string;
  bioText: string;
}

interface Artist {
  name: string;
  imageUrl: string;
}

export default function Home() {
  const { theme } = useTheme();
  const [config, setConfig] = useState<ConfigData>({
    heroImageUrl: Odoo,
    bioText: `When I was recording this song, it felt how most record I make feels, special.
But this one made it to the top of the pile, it’s its time

Odoo , out Friday the 10th`,
  });
  
  const [artists, setArtists] = useState<Artist[]>([
    { name: 'Joeboy', imageUrl: joeboy },
    { name: 'Nikita Kering', imageUrl: nikitaKering },
    { name: 'Ric Hassani', imageUrl: ric },
    { name: 'Teni', imageUrl: teni },
    { name: 'Odumodublvck', imageUrl: odu },
    { name: 'Laycon', imageUrl: laycon },
    { name: 'Tempoe', imageUrl: tempoe },
    { name: 'Oxygenmix', imageUrl: oxygen },
    { name: 'Dwin, The Stoic', imageUrl: dwin },
    { name: 'Chocolate City', imageUrl: chocolatecity },
    { name: 'Mavin Records', imageUrl: mavin },
  ]);

  const albumArt = [
    { name: 'B.O.N.D', url: 'https://open.spotify.com/album/3rH02bagX7ECnJDVBmn1zc?si=c189eqkTTtG5QfnswmHLCQ', img: trivia3 },
    { name: '888', url: 'https://open.spotify.com/album/45iWWzkHx6Px4ZYLLMwcp9?si=fn1el22tTUGoqXL7ScBMWw', img: trivia1 },
    { name: 'Guitars & Malaria', url: 'https://open.spotify.com/album/4sQmW3GvVXKeEeagJ5uhZg?si=lyWpjBfhReaS9nG8g3QXGg', img: trivia2 },
    { name: 'Vertigo', url: 'https://open.spotify.com/artist/0SGTAjot9GShYwCQ69DfG2', img: trivia4 },
    { name: 'Can\'t Deny', url: 'https://open.spotify.com/track/2j2JVT6HA6BayZUnva1xGK?si=bd77f3194ba34e06', img: cantDeny },
    { name: 'Aabena', url: 'https://open.spotify.com/album/278gE1Uykmp7Ku93Wrcko4?si=ZvzvOUkYTlCIjW6cse90tQ', img: aabena },
    { name: 'Swerve', url: 'https://open.spotify.com/album/422U9DZkj5Q2fAi9Z0iQiG?si=y3Ex3S7iRhWzmcpg0fyDbg', img: swerve },
    { name: 'Vowel Sounds', url: 'https://open.spotify.com/album/3UC3rBPy5eoWtPNlYyeLlj?si=l5y5MG4jSku-d5LMRfTB9Q', img: vowels },
    { name: 'Fisi', url: 'https://open.spotify.com/album/5ZpX4i83Frm44kZdSCCvEA?si=PAUjI-qBR22rq1PURrbJJQ', img: suzana },
    { name: 'Wicked Now', url: 'https://open.spotify.com/album/3Rg1PqY2fXOVIUN9Zzvfyl?si=gc_K2VlzR1acQHkiNjcP3w', img: wicked },
    { name: 'My Darling', url: 'https://open.spotify.com/album/47nKsTjebf50mpURhVgNpx?si=EgkDtgduR36IeBQnazicbA', img: darling },
    { name: 'Rewind', url: 'https://open.spotify.com/album/5hlbx4SyEP69u5rZcDKlI3?si=Q5xngfl5S9m46UD0hfqaqA', img: rewind },
    { name: 'Bad Thing', url: 'https://open.spotify.com/album/2i2mXeueJCvbBIkHY4kr0C?si=NQmVQeldQEO3s3aIqhcpmQ', img: badthing },
    { name: 'Everybody Knows', url: 'https://open.spotify.com/album/5RlfIUvzr1MclrUAU9OHom?si=joKeEZYUQmO3oiRuSYDabQ', img: everybody },
    { name: 'Hell Girl', url: 'https://open.spotify.com/album/7wTa3ojfPjvU5aIZzP152D?si=wa5Wi14TQkOWJrSab5Ra-A', img: hellgirl },
    { name: 'Lies', url: 'https://open.spotify.com/album/7bWaK0w7tIwuglQcwPZrDd?si=Kff-6HG3RRKmwnmt92XTiw', img: lies },
    { name: 'B.O.N.D (Live)', url: 'https://open.spotify.com/album/6MfWQXjxTe0FDucGn9EYlZ?si=Tvgx8yMNR--HMINNzXEONw', img: live },
    { name: 'Whole Wide World', url: 'https://open.spotify.com/album/0mSSk7aHR5HxPaxIqG3seq?si=7h8TD6WgTHCx3QFDiY1VmA', img: www },
  ];

  const handleShare = async () => {
    const shareData = {
      title: 'So, I was thinking...',
      text: config.bioText,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${config.bioText}\n\n${window.location.href}`);
        alert('Narrative copied to clipboard!');
      } catch (err) {
        // Fallback: Twitter intent
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(config.bioText)}&url=${encodeURIComponent(window.location.href)}`;
        window.open(twitterUrl, '_blank');
      }
    }
  };

  // Marquee Logic (Discography & Legion)
  const marqueeX = useMotionValue(0);
  const [isMarqueeHovered, setIsMarqueeHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const lastInteractionTime = useRef<number>(0);

  const legionX = useMotionValue(0);
  const [isLegionHovered, setIsLegionHovered] = useState(false);
  const [isLegionDragging, setIsLegionDragging] = useState(false);
  const isLegionDraggingRef = useRef(false);
  const legionRef = useRef<HTMLDivElement>(null);
  const legionContainerRef = useRef<HTMLDivElement>(null);
  const lastLegionInteractionTime = useRef<number>(0);

  const handleDragStart = () => {
    setIsDragging(true);
    isDraggingRef.current = true;
    lastInteractionTime.current = Date.now();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    lastInteractionTime.current = Date.now();
    // Prevent immediate click if they dragged
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 50);
  };

  const handleLegionDragStart = () => {
    setIsLegionDragging(true);
    isLegionDraggingRef.current = true;
    lastLegionInteractionTime.current = Date.now();
  };

  const handleLegionDragEnd = () => {
    setIsLegionDragging(false);
    lastLegionInteractionTime.current = Date.now();
    // Prevent immediate click if they dragged
    setTimeout(() => {
      isLegionDraggingRef.current = false;
    }, 50);
  };

  const handleDiscographyPrev = () => {
    lastInteractionTime.current = Date.now();
    const currentX = marqueeX.get();
    // Smoothly animate backward by approximately one card width (approx 360px)
    animate(marqueeX, currentX + 360, {
      type: "spring",
      stiffness: 90,
      damping: 18
    });
  };

  const handleDiscographyNext = () => {
    lastInteractionTime.current = Date.now();
    const currentX = marqueeX.get();
    // Smoothly animate forward by approximately one card width (approx 360px)
    animate(marqueeX, currentX - 360, {
      type: "spring",
      stiffness: 90,
      damping: 18
    });
  };

  const handleLegionPrev = () => {
    lastLegionInteractionTime.current = Date.now();
    const currentX = legionX.get();
    // In opposite direction flow, Prev scrolls backward (increases x towards center)
    animate(legionX, currentX + 360, {
      type: "spring",
      stiffness: 90,
      damping: 18
    });
  };

  const handleLegionNext = () => {
    lastLegionInteractionTime.current = Date.now();
    const currentX = legionX.get();
    // In opposite direction flow, Next scrolls forward (decreases x away from center)
    animate(legionX, currentX - 360, {
      type: "spring",
      stiffness: 90,
      damping: 18
    });
  };

  useAnimationFrame((t, delta) => {
    // 1. Discography Marquee Update (Right to Left flow)
    if (marqueeRef.current && !isDragging) {
      if (Date.now() - lastInteractionTime.current >= 3500) {
        const totalWidth = marqueeRef.current.scrollWidth;
        if (totalWidth > 0) {
          const itemsCount = 4;
          const baseWidth = totalWidth / itemsCount;
          const speed = isMarqueeHovered ? 0.4 : 1.8;
          const moveBy = (speed * delta) / 16;
          let nextX = marqueeX.get() - moveBy;
          if (nextX <= -baseWidth) {
            nextX += baseWidth;
          }
          marqueeX.set(nextX);
        }
      }
    }

    // 2. Legion Marquee Update (Left to Right flow - opposite direction!)
    if (legionRef.current && !isLegionDragging) {
      if (Date.now() - lastLegionInteractionTime.current >= 3500) {
        const totalWidth = legionRef.current.scrollWidth;
        if (totalWidth > 0) {
          const itemsCount = 4;
          const baseWidth = totalWidth / itemsCount;
          const speed = isLegionHovered ? 0.4 : 1.8;
          const moveBy = (speed * delta) / 16;
          let nextX = legionX.get() + moveBy; // Moves in positive direction
          if (nextX >= 0) {
            nextX -= baseWidth;
          }
          legionX.set(nextX);
        }
      }
    }
  });

  // Endless wrapping observer for Discography marquee drag
  useEffect(() => {
    const unsubscribe = marqueeX.on("change", (latestStringOrNumber) => {
      if (!marqueeRef.current) return;
      const latest = typeof latestStringOrNumber === 'string' ? parseFloat(latestStringOrNumber) : latestStringOrNumber;
      if (isNaN(latest)) return;

      const totalWidth = marqueeRef.current.scrollWidth;
      const itemsCount = 4;
      const baseWidth = totalWidth / itemsCount;
      if (baseWidth === 0) return;

      if (latest <= -baseWidth) {
        marqueeX.set(latest + baseWidth);
      } else if (latest > 0) {
        marqueeX.set(latest - baseWidth);
      }
    });
    return unsubscribe;
  }, [marqueeX]);

  // Endless wrapping observer for Legion marquee drag/wrap
  useEffect(() => {
    const unsubscribe = legionX.on("change", (latestStringOrNumber) => {
      if (!legionRef.current) return;
      const latest = typeof latestStringOrNumber === 'string' ? parseFloat(latestStringOrNumber) : latestStringOrNumber;
      if (isNaN(latest)) return;

      const totalWidth = legionRef.current.scrollWidth;
      const itemsCount = 4;
      const baseWidth = totalWidth / itemsCount;
      if (baseWidth === 0) return;

      if (latest <= -baseWidth) {
        legionX.set(latest + baseWidth);
      } else if (latest > 0) {
        legionX.set(latest - baseWidth);
      }
    });
    return unsubscribe;
  }, [legionX]);

  // Support trackpad/mouse horizontal & vertical wheel scrolling on the Discography marquee container
  useEffect(() => {
    const container = marqueeContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const scrollDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      
      if (Math.abs(scrollDelta) > 0.5) {
        // Prevent default browser scroll only when scrolling horizontally
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
          e.preventDefault();
        }
        
        lastInteractionTime.current = Date.now();
        const currentX = marqueeX.get();
        marqueeX.set(currentX - scrollDelta * 0.8);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [marqueeX]);

  // Support trackpad/mouse horizontal & vertical wheel scrolling on the Legion marquee container
  useEffect(() => {
    const container = legionContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const scrollDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      
      if (Math.abs(scrollDelta) > 0.5) {
        // Prevent default browser scroll only when scrolling horizontally
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
          e.preventDefault();
        }
        
        lastLegionInteractionTime.current = Date.now();
        const currentX = legionX.get();
        legionX.set(currentX - scrollDelta * 0.8);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [legionX]);

  useEffect(() => {
    const unsubscribeConfig = onSnapshot(doc(db, 'config', 'mainPage'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as ConfigData;
        const defaultOldBio1 = 'Welcome to the world of Kemena. Exploring the rich intersections of Afro-fusion rhythms and soundscapes. Every beat is a journey into the soul of modern African music, retold to the world.';
        const defaultOldBio2 = 'Heyyyyyy';
        
        if (data.bioText === defaultOldBio1 || data.bioText === defaultOldBio2 || !data.bioText) {
          data.bioText = `When I was recording this song, it felt how most record I make feels, special.\nBut this one made it to the top of the pile, it’s its time`;
        }
        
        // We preserve the locally set heroImageUrl from the initial state
        // so that the user can change the picture in code without the database overriding it.
        setConfig(prev => ({
          ...prev,
          bioText: data.bioText,
          battleMusicUrl: data.battleMusicUrl || prev.battleMusicUrl
        }));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'config/mainPage');
    });

    const unsubscribeArtists = onSnapshot(collection(db, 'artists'), (snapshot) => {
      const data = snapshot.docs.map(d => d.data() as Artist);
      if (data.length > 0) setArtists(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'artists');
    });

    return () => {
      unsubscribeConfig();
      unsubscribeArtists();
    };
  }, []);

  return (
    <div className={`flex flex-col min-h-screen relative overflow-x-hidden font-sans transition-colors duration-500 ${
      theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-white text-army-dark'
    }`}>
      {/* Dynamic Atmospheric Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] animate-pulse ${
          theme === 'dark' ? 'bg-pink-600/10' : 'bg-pink-600/5'
        }`}></div>
        <div className={`absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full blur-[120px] animate-pulse delay-1000 ${
          theme === 'dark' ? 'bg-cyan-600/10' : 'bg-cyan-600/5'
        }`}></div>
        <div className={`absolute bottom-0 left-[20%] w-[50%] h-[20%] rounded-full blur-[100px] ${
          theme === 'dark' ? 'bg-amber-600/5' : 'bg-amber-600/2'
        }`}></div>
        
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ${
          theme === 'dark' ? 'opacity-5' : 'opacity-[0.02]'
        }`}>
          <Disc className={`w-[800px] h-[800px] animate-spin-slow ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-20 py-16 lg:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          
          {/* Left Column: Artistic Hero Image */}
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="aspect-[3/4] lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative group border border-white/5">
              <img 
                src={config.heroImageUrl || undefined} 
                alt="Kemena Portrait" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
          </motion.div>

          {/* Right Column: Interaction Hub */}
          <div className="flex flex-col gap-16 justify-center min-h-[400px]">
            {/* Artist Bio / The Narrative */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="relative space-y-8"
            >
              <div className="space-y-4">
                <h3 className={`text-3xl font-medium tracking-tight ${theme === 'dark' ? 'text-white/90' : 'text-black/90'}`}>So, I was thinking...</h3>
                <div className="w-12 h-[2px] bg-pink-500"></div>
              </div>
              
              <div className={`p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative ${
                theme === 'dark' ? 'bg-gradient-to-br from-white/[0.05] to-transparent' : 'bg-gradient-to-br from-black/[0.05] to-transparent'
              }`}>
                <div className={`absolute top-0 left-6 sm:left-10 -translate-y-1/2 px-4 py-1 border border-white/10 rounded-full ${
                  theme === 'dark' ? 'bg-[#050505]' : 'bg-white'
                }`}>
                  <Music size={14} className="text-pink-500" />
                </div>
                <p className={`text-base sm:text-lg leading-relaxed font-light italic ${theme === 'dark' ? 'text-white/70' : 'text-black/70'}`}>
                  "{config.bioText}"
                </p>
                <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                   <div className="flex items-center gap-3">
                     <div className="flex -space-x-2">
                       {[1,2,3].map(i => <div key={i} className={`w-6 h-6 rounded-full border border-black ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`}></div>)}
                     </div>
                     <span className={`text-[10px] uppercase tracking-widest font-mono ${theme === 'dark' ? 'text-white/30' : 'text-black/30'}`}>Archive Series Vol. 24</span>
                   </div>
                   
                   <button 
                    onClick={handleShare}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-pink-500 hover:border-pink-500 hover:text-white transition-all font-mono text-[9px] uppercase tracking-widest group w-full sm:w-auto ${
                      theme === 'dark' ? 'bg-white/5 text-white/40' : 'bg-black/5 text-black/40'
                    }`}
                   >
                     <Share2 size={12} className="group-hover:scale-110 transition-transform" />
                     Share Narrative
                   </button>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Infinite Horizontal Discography Marquee */}
        <section className={`py-32 border-y border-white/5 transition-colors duration-500 ${theme === 'dark' ? 'bg-white/[0.01]' : 'bg-black/[0.01]'}`}>
           <div className="flex flex-col md:flex-row md:justify-between md:items-end items-center mb-20 px-6 max-w-7xl mx-auto w-full gap-6">
             <div className="text-center md:text-left space-y-2">
               <span className="text-pink-500 font-mono text-xs uppercase tracking-[0.5em] mb-4 block">Latest Releases</span>
               <h2 className={`text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tighter italic transition-colors duration-500 ${theme === 'dark' ? 'text-white/90' : 'text-black/90'}`}>DISCOGRAPHY</h2>
             </div>
             <div className="flex gap-4">
               <button 
                 onClick={handleDiscographyPrev}
                 className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-pink-500 hover:text-white transition-all cursor-pointer ${
                   theme === 'dark' ? 'text-white/40 hover:bg-white/5' : 'text-black/40 hover:bg-black/5'
                 }`}
                 aria-label="Scroll Backwards"
               >
                 ←
               </button>
               <button 
                 onClick={handleDiscographyNext}
                 className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-pink-500 hover:text-white transition-all cursor-pointer ${
                   theme === 'dark' ? 'text-white/40 hover:bg-white/5' : 'text-black/40 hover:bg-black/5'
                 }`}
                 aria-label="Scroll Forwards"
               >
                 →
               </button>
             </div>
           </div>
           
           <div 
             className="overflow-hidden relative cursor-grab active:cursor-grabbing select-none"
             onMouseEnter={() => setIsMarqueeHovered(true)} ref={marqueeContainerRef}
             onMouseLeave={() => setIsMarqueeHovered(false)}
           >
              <motion.div 
                ref={marqueeRef}
                style={{ x: marqueeX }}
                className="flex gap-12 whitespace-nowrap px-8"
                drag="x"
                dragConstraints={{ left: -100000, right: 100000 }}
                dragElastic={0.05}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                {/* Render the list 4 times for seamless infinite loop */}
                {[...albumArt, ...albumArt, ...albumArt, ...albumArt].map((album, i) => (
                  <div key={i} className="flex-shrink-0 w-[240px] sm:w-[280px] lg:w-[320px] group cursor-pointer">
                    <a 
                      href={album.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block outline-none"
                      onClick={(e) => {
                        if (isDraggingRef.current) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <div className={`relative w-full aspect-square rounded-[2rem] overflow-hidden mb-8 border border-white/10 shadow-2xl transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-[#f5f5f5]'}`}>
                         <img 
                           src={album.img} 
                           alt={album.name} 
                           className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0" 
                           draggable={false}
                         />
                         
                         {/* Play Overlay */}
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
                               <Play size={32} className="text-black fill-black ml-1" />
                            </div>
                         </div>
                      </div>

                      <div className="px-4 text-center sm:text-left">
                         <h4 className={`text-2xl font-bold tracking-tighter transition-colors duration-500 uppercase italic leading-none ${
                           theme === 'dark' ? 'text-white/90 group-hover:text-pink-500' : 'text-black/90 group-hover:text-pink-500'
                         }`}>{album.name}</h4>
                         <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
                            <div className="w-8 h-[1px] bg-pink-500/50"></div>
                            <span className={`text-[10px] font-mono tracking-[0.3em] uppercase ${theme === 'dark' ? 'text-white/20' : 'text-black/20'}`}>Stream // Spotify</span>
                         </div>
                      </div>
                    </a>
                  </div>
                ))}
              </motion.div>
           </div>
        </section>

        {/* Agile Artists Infinite Horizontal Marquee */}
        <section className={`py-32 border-t border-white/5 transition-colors duration-500 ${theme === 'dark' ? 'bg-white/[0.01]' : 'bg-black/[0.01]'}`}>
           <div className="flex flex-col md:flex-row md:justify-between md:items-end items-center mb-20 px-6 max-w-7xl mx-auto w-full gap-6">
             <div className="text-center md:text-left space-y-2">
               <span className="text-cyan-500 font-mono text-xs uppercase tracking-[0.5em] mb-4 block">Collaborators</span>
               <h2 className={`text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tighter italic transition-colors duration-500 ${theme === 'dark' ? 'text-white/90' : 'text-black/90'}`}>THE LEGION</h2>
             </div>
             <div className="flex gap-4">
               <button 
                 onClick={handleLegionPrev}
                 className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-pink-500 hover:text-white transition-all cursor-pointer ${
                   theme === 'dark' ? 'text-white/40 hover:bg-white/5' : 'text-black/40 hover:bg-black/5'
                 }`}
                 aria-label="Scroll Backwards"
               >
                 ←
               </button>
               <button 
                 onClick={handleLegionNext}
                 className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-pink-500 hover:text-white transition-all cursor-pointer ${
                   theme === 'dark' ? 'text-white/40 hover:bg-white/5' : 'text-black/40 hover:bg-black/5'
                 }`}
                 aria-label="Scroll Forwards"
               >
                 →
               </button>
             </div>
           </div>

           <div 
             className="overflow-hidden relative cursor-grab active:cursor-grabbing select-none"
             onMouseEnter={() => setIsLegionHovered(true)} ref={legionContainerRef}
             onMouseLeave={() => setIsLegionHovered(false)}
           >
              <motion.div 
                ref={legionRef}
                style={{ x: legionX }}
                className="flex gap-12 whitespace-nowrap px-8"
                drag="x"
                dragConstraints={{ left: -100000, right: 100000 }}
                dragElastic={0.05}
                onDragStart={handleLegionDragStart}
                onDragEnd={handleLegionDragEnd}
              >
                {/* Render the list 4 times for seamless infinite loop */}
                {[...artists, ...artists, ...artists, ...artists].map((artist, i) => (
                   <div key={i} className="flex-shrink-0 w-[240px] sm:w-[280px] lg:w-[320px] group cursor-pointer"
                     onClick={(e) => {
                       if (isLegionDraggingRef.current) {
                         e.preventDefault();
                       }
                     }}
                   >
                     <div className={`relative w-full aspect-square rounded-[2rem] overflow-hidden mb-8 border border-white/10 shadow-2xl transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-[#f5f5f5]'}`}>
                        <img 
                          src={artist.imageUrl} 
                          alt={artist.name} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 " 
                          draggable={false}
                        />
                     </div>

                     <div className="px-4 text-center sm:text-left">
                        <h4 className={`text-2xl font-bold tracking-tighter transition-colors duration-500 uppercase italic leading-none ${
                          theme === 'dark' ? 'text-white/90 group-hover:text-pink-500' : 'text-black/90 group-hover:text-pink-500'
                        }`}>{artist.name}</h4>
                        <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
                           <div className="w-8 h-[1px] bg-pink-500/50"></div>
                           <span className={`text-[10px] font-mono tracking-[0.3em] uppercase ${theme === 'dark' ? 'text-white/20' : 'text-black/20'}`}>Artist // Legion</span>
                        </div>
                     </div>
                   </div>
                ))}
              </motion.div>
           </div>
        </section>

      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
