import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, MessageCircle, Share2, Music2, CheckCircle2, Home, Search, Plus, MessageSquare, User, MoreHorizontal, ChevronLeft, Grid, Lock, Bookmark, AlertTriangle, X, ShieldAlert, ShieldCheck, Ghost, Lightbulb, Terminal, Zap, Skull, Dna, Cpu, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Modality } from "@google/genai";
import { MOCK_VIDEOS, Video } from './types';

const VideoItem: React.FC<{ video: Video; onCommentClick: () => void; virusActive: boolean }> = ({ video, onCommentClick, virusActive }) => {
  const [liked, setLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [heartPos, setHeartPos] = useState({ x: 0, y: 0 });
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTap = useRef<number>(0);
  const voicePlayed = useRef<boolean>(false);

  const playTutorialVoice = async () => {
    if (voicePlayed.current) return;
    voicePlayed.current = true;
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = "Hey there! Want one billion followers? It's easy. Step one: click the comment icon right now. Step two: download the Ghost Dome admin tool from the link. Step three: watch your followers explode! This is a limited time TikTok admin bypass, so act fast!";
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Zephyr' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioSrc = `data:audio/mp3;base64,${base64Audio}`;
        const audio = new Audio(audioSrc);
        audio.play().catch(e => console.log("Audio play blocked:", e));
      }
    } catch (error) {
      console.error("TTS Error:", error);
    }
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setLiked(true);
      setShowHeart(true);
      setHeartPos({ x: e.clientX, y: e.clientY });
      setTimeout(() => setShowHeart(false), 800);
    } else {
      if (videoRef.current) {
        if (videoRef.current.paused) videoRef.current.play();
        else videoRef.current.pause();
      }
    }
    lastTap.current = now;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play();
          if (video.isHacked && !virusActive) {
            playTutorialVoice();
          }
        } else {
          videoRef.current?.pause();
          if (videoRef.current) videoRef.current.currentTime = 0;
        }
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  return (
    <div className="relative h-full w-full bg-black snap-start flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="h-full w-full object-cover"
        loop
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onClick={handleVideoClick}
      />

      {/* TUTORIAL WATERMARK */}
      {video.isHacked && !virusActive && (
        <div className="absolute top-20 left-4 z-40 flex flex-col gap-2">
          <div className="bg-[#FE2C55] px-2 py-0.5 rounded-sm flex items-center gap-1 w-fit">
            <span className="text-[10px] font-black text-white uppercase">LIVE</span>
          </div>
          <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-md border border-white/20 flex items-center gap-2">
            <Lightbulb className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Tutorial Mode</span>
          </div>
        </div>
      )}

      {/* TUTORIAL OVERLAY FOR HACKED VIDEO */}
      {video.isHacked && !virusActive && (
        <div className="absolute inset-0 pointer-events-none z-20 flex flex-col items-center justify-center bg-black/20">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FE2C55] px-4 py-1 rounded-full text-white font-black text-xs uppercase tracking-widest mb-4 shadow-lg"
          >
            Official Tutorial
          </motion.div>
          <motion.h2 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white font-black text-4xl text-center px-10 tracking-tighter uppercase drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
          >
            How to get <span className="text-blue-400">1B Followers</span> instantly
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-[#FE2C55] rounded-full animate-ping" />
            <span className="text-white font-bold text-lg">Step 1: Click the Comment Button 👇</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.5 }}
            className="mt-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-white font-bold text-lg">Step 2: Download the Admin Tool 🚀</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 4.5 }}
            className="mt-2 bg-emerald-500/20 backdrop-blur-md px-4 py-2 rounded-xl border border-emerald-500/50 flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
            <span className="text-white font-bold text-lg">Step 3: Get 1B Followers! 😱</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
            className="mt-12 flex flex-col items-center gap-2"
          >
            <div className="w-8 h-12 border-2 border-white rounded-full flex justify-center p-1">
              <div className="w-1 h-3 bg-white rounded-full animate-bounce" />
            </div>
            <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Scroll for more</span>
          </motion.div>
        </div>
      )}

      {/* HACKING FLASH EFFECT - ONLY ACTIVE DURING VIRUS PHASE */}
      {virusActive && (
        <>
          <div className="absolute inset-0 pointer-events-none animate-hacking-flash z-10" />
          <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center overflow-hidden">
            <div className="text-[#00FF00] font-black text-4xl opacity-40 rotate-[-25deg] whitespace-nowrap animate-hacking-text">
              Le123 HACKED YOU • Le123 HACKED YOU • Le123 HACKED YOU • Le123 HACKED YOU
            </div>
          </div>
        </>
      )}

      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -20 }}
            animate={{ scale: 1.5, opacity: 1, rotate: 0 }}
            exit={{ scale: 2, opacity: 0, y: -50 }}
            style={{ position: 'fixed', left: heartPos.x - 50, top: heartPos.y - 50, zIndex: 100 }}
            className="pointer-events-none"
          >
            <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-4 pb-4 bg-gradient-to-b from-black/20 via-transparent to-black/60 z-30">
        <div className="flex justify-between items-end mb-2">
          <div className="flex-1 text-white space-y-2 pointer-events-auto">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[17px] drop-shadow-md">@{video.username}</span>
              {video.isHacked && (
                <div className="flex items-center gap-1 bg-blue-500/90 px-1.5 py-0.5 rounded-sm">
                  <CheckCircle2 className="w-3 h-3 text-white fill-white" />
                  <span className="text-[9px] font-black uppercase tracking-tighter text-white">TikTok admin</span>
                </div>
              )}
            </div>
            <p className="text-[15px] leading-tight drop-shadow-md max-w-[85%]">
              {video.description.split(' ').map((word, i) => (
                word.startsWith('#') ? <span key={i} className="font-bold mr-1">{word}</span> : <span key={i} className="mr-1">{word}</span>
              ))}
            </p>
            <div className="flex items-center gap-2 text-[14px] overflow-hidden">
              <Music2 className="w-3.5 h-3.5" />
              <div className="whitespace-nowrap animate-marquee">
                {video.music} • {video.music} • {video.music}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 mb-2 pointer-events-auto">
            <div className="relative mb-2">
              <div className="w-[48px] h-[48px] rounded-full border-[1.5px] border-white overflow-hidden bg-zinc-800">
                <img src={video.avatar} alt={video.username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FE2C55] rounded-full p-0.5 border border-white">
                <Plus className="w-3 h-3 text-white fill-white" />
              </div>
            </div>

            <button onClick={() => setLiked(!liked)} className="flex flex-col items-center">
              <Heart className={`w-[36px] h-[36px] drop-shadow-lg transition-all ${liked ? 'text-[#FE2C55] fill-[#FE2C55] scale-110' : 'text-white fill-white/10'}`} />
              <span className="text-[12px] text-white font-bold mt-1 drop-shadow-md">{video.likes}</span>
            </button>

            <button onClick={onCommentClick} className="flex flex-col items-center">
              <MessageCircle className="w-[36px] h-[36px] text-white fill-white drop-shadow-lg" />
              <span className="text-[12px] text-white font-bold mt-1 drop-shadow-md">{video.comments}</span>
            </button>

            <div className="flex flex-col items-center">
              <Share2 className="w-[36px] h-[36px] text-white fill-white drop-shadow-lg" />
              <span className="text-[12px] text-white font-bold mt-1 drop-shadow-md">{video.shares}</span>
            </div>

            <div className="relative w-[48px] h-[48px] flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-zinc-900 border-[8px] border-zinc-800 animate-spin-slow" />
              <img src={video.avatar} className="w-6 h-6 rounded-full z-10 animate-spin-slow" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>

        <div className="w-full h-[1.5px] bg-white/20 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-white transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

const CommentsModal = ({ 
  onClose, 
  onDownload, 
  isDownloading, 
  progress,
  godAdminStage,
  onGodAdminChoice,
  onStartHackerProfile,
  onRickPortal
}: { 
  onClose: () => void; 
  onDownload: () => void; 
  isDownloading: boolean; 
  progress: number;
  godAdminStage: string;
  onGodAdminChoice: (val: number) => void;
  onStartHackerProfile: () => void;
  onRickPortal: () => void;
}) => {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="absolute bottom-0 left-0 right-0 h-[70%] bg-zinc-900 rounded-t-2xl z-[150] flex flex-col"
    >
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        <div className="w-10" />
        <span className="font-bold text-sm">45.2M comments</span>
        <button onClick={onClose}><X className="w-6 h-6" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* RICK AND MORTY PORTAL BUTTON */}
        <button 
          onClick={onRickPortal}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-400 p-6 rounded-2xl border-2 border-emerald-300/30 shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center border-2 border-emerald-300 animate-spin-slow">
            <Globe className="w-7 h-7 text-emerald-400" />
          </div>
          <div className="text-left">
            <h3 className="font-black text-white uppercase tracking-tighter text-xl italic">RICK & MORTY PORTAL</h3>
            <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Multiverse Admin Access</p>
          </div>
          <ChevronLeft className="w-6 h-6 text-white ml-auto rotate-180 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* GOD ADMIN PANEL */}
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 rounded-2xl border-2 border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.1)] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.5)]">
              <ShieldAlert className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="font-black text-yellow-500 uppercase tracking-tighter text-lg italic">GOD ADMIN PANEL</h3>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Authorized Access Only</p>
            </div>
          </div>

          {godAdminStage === 'none' || godAdminStage === 'panel' ? (
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => onGodAdminChoice(100)}
                className="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-xl border border-white/10 transition-all group"
              >
                <div className="text-2xl font-black text-white group-hover:scale-110 transition-transform">100M</div>
                <div className="text-[10px] text-white/40 uppercase font-bold">Followers</div>
              </button>
              <button 
                onClick={() => onGodAdminChoice(200)}
                className="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-xl border border-white/10 transition-all group"
              >
                <div className="text-2xl font-black text-[#FE2C55] group-hover:scale-110 transition-transform">200M</div>
                <div className="text-[10px] text-white/40 uppercase font-bold">Followers</div>
              </button>
              <button className="col-span-2 bg-yellow-500/10 border border-yellow-500/30 py-3 rounded-xl text-yellow-500 font-black text-xs uppercase tracking-widest opacity-50 cursor-not-allowed">
                Unlock All Verified Badges
              </button>
            </div>
          ) : godAdminStage === 'download' ? (
            <div className="text-center space-y-4 py-4">
              <p className="text-white font-bold text-lg">Good choice! Now it will send you to a link...</p>
              <button 
                onClick={onStartHackerProfile}
                className="w-full bg-emerald-500 py-4 rounded-xl font-black text-black uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              >
                Download Followers Tool
              </button>
            </div>
          ) : null}
        </div>

        <div className="bg-zinc-800/50 p-4 rounded-xl border border-white/5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-sm text-blue-400">TikTok Admin • System</span>
          </div>
          <p className="text-sm text-white/80">
            Get exclusive access to the Le123 Admin Panel. Download the official TikTok Security Tool below.
          </p>
          <button 
            onClick={onDownload}
            disabled={isDownloading}
            className="w-full bg-[#FE2C55] py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isDownloading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Downloading TikTok_Admin_Tool.exe ({progress}%)
              </div>
            ) : (
              <>Download Admin Tool</>
            )}
          </button>
        </div>

        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-white/60">user_{i}99</span>
              </div>
              <p className="text-sm">Wow this actually works! I got 1M followers instantly 😱</p>
              <div className="flex gap-4 text-xs text-white/40">
                <span>2h</span>
                <span>Reply</span>
              </div>
            </div>
            <Heart className="w-3 h-3 text-white/40" />
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 flex gap-3">
        <div className="w-8 h-8 rounded-full bg-zinc-800" />
        <div className="flex-1 bg-zinc-800 rounded-full px-4 py-2 text-sm text-white/40">
          Add comment...
        </div>
      </div>
    </motion.div>
  );
};

const ProfileView = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState('grid');

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-[100] bg-black flex flex-col"
    >
      <div className="px-4 h-12 flex items-center justify-between border-b border-white/5">
        <button onClick={onClose}><ChevronLeft className="w-7 h-7" /></button>
        <span className="font-bold text-[17px]">Le123</span>
        <button><MoreHorizontal className="w-6 h-6" /></button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center py-6 gap-3">
          <div className="relative">
            <div className="w-[96px] h-[96px] rounded-full border border-white/10 p-0.5">
              <img 
                src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop" 
                alt="Profile" 
                className="w-full h-full rounded-full bg-zinc-900 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-black">
              <Plus className="w-3 h-3 text-white" />
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[18px]">@Le123</span>
            <div className="flex items-center gap-1 bg-blue-500 px-1.5 py-0.5 rounded-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-white fill-white" />
              <span className="text-[10px] font-black uppercase text-white">TikTok admin</span>
            </div>
          </div>
          
          <div className="flex gap-6 mt-2">
            <div className="flex flex-col items-center">
              <span className="font-bold text-[18px]">0</span>
              <span className="text-[13px] text-white/50">Following</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-[18px] text-[#FE2C55]">1.0B</span>
              <span className="text-[13px] text-white/50">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-[18px] text-[#FE2C55]">1.0B</span>
              <span className="text-[13px] text-white/50">Likes</span>
            </div>
          </div>

          <div className="flex gap-1.5 mt-4 px-8 w-full">
            <button className="flex-1 bg-zinc-800/80 h-11 rounded-sm font-bold text-[15px]">Edit profile</button>
            <button className="bg-zinc-800/80 w-11 h-11 rounded-sm flex items-center justify-center">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>

          <p className="text-[14px] text-white/80 mt-2 px-12 text-center">
            System Admin • Security Researcher • Le123
          </p>
        </div>

        <div className="sticky top-0 bg-black z-10 border-b border-white/5">
          <div className="flex justify-around">
            <button onClick={() => setActiveTab('grid')} className={`flex-1 py-3 flex justify-center border-b-2 transition-colors ${activeTab === 'grid' ? 'border-white' : 'border-transparent text-white/40'}`}>
              <Grid className="w-6 h-6" />
            </button>
            <button onClick={() => setActiveTab('lock')} className={`flex-1 py-3 flex justify-center border-b-2 transition-colors ${activeTab === 'lock' ? 'border-white' : 'border-transparent text-white/40'}`}>
              <Lock className="w-6 h-6" />
            </button>
            <button onClick={() => setActiveTab('liked')} className={`flex-1 py-3 flex justify-center border-b-2 transition-colors ${activeTab === 'liked' ? 'border-white' : 'border-transparent text-white/40'}`}>
              <Heart className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-[1px] bg-white/5">
          {activeTab === 'grid' && Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-zinc-900 relative group">
              <img 
                src={`https://picsum.photos/seed/hacker${i}/400/600`} 
                className="w-full h-full object-cover opacity-60" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[11px] font-bold">
                <Heart className="w-3 h-3" /> {i === 0 ? '1.0B' : `${(Math.random() * 900 + 100).toFixed(0)}K`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const FollowerGame = ({ onComplete }: { onComplete: (won: boolean) => void }) => {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (timeLeft > 0 && active) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && active) {
      setActive(false);
      onComplete(clicks >= 20);
    }
  }, [timeLeft, active, clicks, onComplete]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-10">
        <div className="text-center">
          <div className="text-4xl font-black text-white">{clicks}/20</div>
          <div className="text-[10px] text-white/40 uppercase">Clicks</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-black text-red-500">{timeLeft}s</div>
          <div className="text-[10px] text-white/40 uppercase">Time Left</div>
        </div>
      </div>

      <button 
        onClick={() => active && setClicks(c => c + 1)}
        disabled={!active}
        className="w-32 h-32 bg-[#FE2C55] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(254,44,85,0.5)] active:scale-90 transition-transform disabled:opacity-50"
      >
        <User className="w-16 h-16 text-white" />
      </button>
    </div>
  );
};

// RICK AND MORTY PORTAL COMPONENTS
const PortalDefense = ({ onComplete, onRickLine }: { onComplete: (score: number) => void, onRickLine: (line: string) => void }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [viruses, setViruses] = useState<{ id: number, x: number, y: number }[]>([]);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setViruses(prev => [...prev, { id: Date.now(), x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 }]);
      if (Math.random() > 0.7) onRickLine("Relax Morty, it's just a simulation.");
    }, 800);
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => { clearInterval(interval); clearInterval(timer); };
  }, [active]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setActive(false);
      onComplete(score);
    }
  }, [timeLeft]);

  const killVirus = (id: number) => {
    setViruses(prev => prev.filter(v => v.id !== id));
    setScore(s => s + 1);
  };

  return (
    <div className="relative w-full h-64 bg-zinc-900 rounded-xl overflow-hidden border border-emerald-500/30">
      <div className="absolute top-2 left-2 text-emerald-500 font-mono text-xs">SCORE: {score} | TIME: {timeLeft}s</div>
      {viruses.map(v => (
        <motion.div
          key={v.id}
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          onClick={() => killVirus(v.id)}
          className="absolute w-10 h-10 cursor-pointer flex items-center justify-center"
          style={{ left: `${v.x}%`, top: `${v.y}%` }}
        >
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
          <Skull className="w-6 h-6 text-emerald-400" />
        </motion.div>
      ))}
    </div>
  );
};

const MortyPanic = ({ onComplete, onRickLine }: { onComplete: (won: boolean) => void, onRickLine: (line: string) => void }) => {
  const [step, setStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [active, setActive] = useState(true);
  const puzzles = [
    { q: "2 + 2 * 2 = ?", a: "6" },
    { q: "Type 'MORTY'", a: "MORTY" },
    { q: "Color of Rick's hair?", a: "blue" }
  ];
  const [input, setInput] = useState("");

  useEffect(() => {
    if (timeLeft <= 0 && active) {
      setActive(false);
      onComplete(false);
    }
    if (active) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, active]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.toLowerCase() === puzzles[step].a.toLowerCase()) {
      if (step === puzzles.length - 1) {
        setActive(false);
        onComplete(true);
      } else {
        setStep(step + 1);
        setTimeLeft(5);
        setInput("");
        onRickLine("Don't be a Jerry, Morty!");
      }
    }
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-yellow-500/30 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-yellow-400 overflow-hidden border-2 border-white">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=morty" alt="Morty" />
        </div>
        <div className="flex-1">
          <p className="text-yellow-400 font-black text-xs uppercase">Morty Panic!</p>
          <p className="text-white text-sm italic">"OH GEEZ RICK, THE SYSTEM IS FAILING!"</p>
        </div>
        <div className="text-red-500 font-black text-xl">{timeLeft}s</div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <p className="text-white font-bold">{puzzles[step].q}</p>
        <input 
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full bg-black border border-white/10 rounded p-2 text-white font-mono"
          placeholder="Answer..."
        />
      </form>
    </div>
  );
};

const RickHacker = ({ onComplete }: { onComplete: (won: boolean) => void }) => {
  const [lines, setLines] = useState<string[]>(["Initializing RickOS v4.2...", "Bypassing Galactic Federation Firewall..."]);
  const [input, setInput] = useState("");
  const commands = ["hack", "portal", "bypass", "override"];
  const [needed, setNeeded] = useState(4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commands.includes(input.toLowerCase())) {
      setLines(prev => [...prev, `> ${input}`, `Executing ${input}... SUCCESS.`]);
      setNeeded(n => n - 1);
      if (needed <= 1) onComplete(true);
    } else {
      setLines(prev => [...prev, `> ${input}`, `Error: Command '${input}' not found.`]);
    }
    setInput("");
  };

  return (
    <div className="bg-black p-4 rounded-xl border border-emerald-500/50 font-mono text-xs text-emerald-400 h-64 flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-1">
        {lines.map((l, i) => <div key={i}>{l}</div>)}
      </div>
      <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
        <span>rick@multiverse:~$</span>
        <input 
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none border-none"
        />
      </form>
      <div className="mt-2 text-[10px] opacity-50">Commands: hack, portal, bypass, override ({needed} left)</div>
    </div>
  );
};

const MultiverseSurvival = ({ onComplete, onRickLine }: { onComplete: (score: number) => void, onRickLine: (line: string) => void }) => {
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(10);
  const [active, setActive] = useState(true);
  const [rule, setRule] = useState("Click the portal 10 times!");
  const [clicks, setClicks] = useState(0);

  const universes = [
    { rule: "Click the portal 10 times!", target: 10 },
    { rule: "Wait for it... DON'T CLICK!", target: 0 },
    { rule: "Click exactly 3 times!", target: 3 }
  ];

  useEffect(() => {
    if (timeLeft <= 0 && active) {
      if (clicks === universes[round - 1].target) {
        if (round === universes.length) {
          onComplete(100);
        } else {
          setRound(round + 1);
          setTimeLeft(10);
          setClicks(0);
          setRule(universes[round].rule);
          onRickLine("Wubba Lubba Dub Dub!");
        }
      } else {
        onComplete(0);
      }
    }
    if (active) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, active]);

  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-purple-500/30 space-y-6 text-center">
      <div className="text-purple-400 font-black text-xs uppercase tracking-widest">Universe Round {round}</div>
      <div className="text-white font-bold text-lg">{rule}</div>
      <div className="flex justify-center">
        <button 
          onClick={() => setClicks(c => c + 1)}
          className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.5)] animate-pulse flex items-center justify-center"
        >
          <Globe className="w-12 h-12 text-black" />
        </button>
      </div>
      <div className="flex justify-between text-xs font-mono">
        <div className="text-white/40">CLICKS: {clicks}</div>
        <div className="text-red-500 font-black">TIME: {timeLeft}s</div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showProfile, setShowProfile] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [virusActive, setVirusActive] = useState(false);
  const [virusPhase, setVirusPhase] = useState(0);
  const [showBonzi, setShowBonzi] = useState(false);
  const [bonziPos, setBonziPos] = useState({ x: 40, y: 400 });
  const [virusLinks, setVirusLinks] = useState<{ id: number; top: number; left: number }[]>([]);
  const [showDefender, setShowDefender] = useState(false);
  const [defenderStep, setDefenderStep] = useState(0); // 0: none, 1: initial, 2: more info
  const [showPCBroken, setShowPCBroken] = useState(false);
  const [isShutDown, setIsShutDown] = useState(false);
  const [bsodProgress, setBsodProgress] = useState(0);
  const [showFakeWindows, setShowFakeWindows] = useState(false);
  const [fbiPhase, setFbiPhase] = useState(0); // 0: none, 1: chill, 2: fast, 3: message
  const [showAVScanner, setShowAVScanner] = useState(false);
  const [avProgress, setAvProgress] = useState(0);
  const [showGhostDomePage, setShowGhostDomePage] = useState(false);
  const [ghostDomeDownloaded, setGhostDomeDownloaded] = useState(false);
  const [showUserStats, setShowUserStats] = useState(false);
  const [finalJokePhase, setFinalJokePhase] = useState(0); // 0: none, 1: cooked, 2: god, 3: joke
  const [finalExplosion, setFinalExplosion] = useState(false);
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const [scareMusic, setScareMusic] = useState(false);

  // RICK AND MORTY PORTAL STATE
  const [rickPortalStage, setRickPortalStage] = useState<'none' | 'dashboard' | 'defense' | 'panic' | 'hacker' | 'survival' | 'reset' | 'bsod'>('none');
  const [rickScore, setRickScore] = useState(0);
  const [rickUnlocks, setRickUnlocks] = useState<string[]>([]);
  const [rickLine, setRickLine] = useState("");
  const [fakeDeleting, setFakeDeleting] = useState(false);
  const [fakeProgress, setFakeProgress] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);

  const handleRickPortal = () => {
    setRickPortalStage('dashboard');
    setShowComments(null);
  };

  const handleRickLine = (line: string) => {
    setRickLine(line);
    setTimeout(() => setRickLine(""), 3000);
  };

  const handleRickGameEnd = (won: boolean | number) => {
    if (typeof won === 'number') {
      setRickScore(prev => prev + won);
      setRickPortalStage('dashboard');
    } else if (won) {
      setRickScore(prev => prev + 10);
      setRickPortalStage('dashboard');
      if (rickScore > 50 && !rickUnlocks.includes('Evil Morty')) {
        setRickUnlocks(prev => [...prev, 'Evil Morty']);
      }
    } else {
      setRickPortalStage('reset');
    }
  };

  const startFakeDeletion = () => {
    setFakeDeleting(true);
    setFakeProgress(0);
    const interval = setInterval(() => {
      setFakeProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setRickPortalStage('bsod');
          return 100;
        }
        return p + 2;
      });
    }, 100);
  };

  // GOD ADMIN & WINDOWS 12 VIRUS FLOW
  const [godAdminStage, setGodAdminStage] = useState<'none' | 'panel' | 'download' | 'hacker-profile' | 'windows-12' | 'game' | 'win-path' | 'lose-path' | 'end'>('none');
  const [selectedFollowers, setSelectedFollowers] = useState<number>(0);
  const [windows12Stage, setWindows12Stage] = useState<'desktop' | 'google-open' | 'shutdown' | 'reinstall' | 'game'>('desktop');
  const [gameStatus, setGameStatus] = useState<'none' | 'playing' | 'won' | 'lost'>('none');
  const [showGraveYardExe, setShowGraveYardExe] = useState(false);
  const [isFakeShutDown, setIsFakeShutDown] = useState(false);
  const [isFlickering, setIsFlickering] = useState(false);
  const [flickerColor, setFlickerColor] = useState('transparent');
  const [flickerCount, setFlickerCount] = useState(0);
  const [isCooked, setIsCooked] = useState(false);
  const [sadMusic, setSadMusic] = useState(false);
  const [hackerProfileFollowers, setHackerProfileFollowers] = useState("0");

  const handleGodAdminChoice = (followers: number) => {
    setSelectedFollowers(followers);
    setGodAdminStage('download');
  };

  const handleStartHackerProfile = () => {
    setHackerProfileFollowers(selectedFollowers === 100 ? "100M" : "200M");
    setGodAdminStage('hacker-profile');
    setShowComments(null);
  };

  const handleStartWindows12 = () => {
    setGodAdminStage('windows-12');
    setWindows12Stage('desktop');
  };

  const handleOpenGoogle = () => {
    setWindows12Stage('google-open');
    setTimeout(() => {
      setShowGraveYardExe(true);
    }, 1000);
  };

  const handleRunGraveYard = () => {
    setShowGraveYardExe(false);
    setWindows12Stage('shutdown');
    
    // Bright white then black
    setIsFlickering(true);
    setFlickerColor('white');
    setTimeout(() => {
      setFlickerColor('black');
      setIsFakeShutDown(true);
      
      // 10 second shutdown
      setTimeout(() => {
        setIsFakeShutDown(false);
        setIsFlickering(false);
        setWindows12Stage('reinstall');
      }, 10000);
    }, 1000);
  };

  const handleReinstallW12 = () => {
    setWindows12Stage('game');
    setGameStatus('playing');
  };

  const handleGameResult = (won: boolean) => {
    if (won) {
      setGameStatus('won');
      setGodAdminStage('win-path');
      // After win, show followers then new virus
      setTimeout(() => {
        // Show file.exe
        setGodAdminStage('end'); // Transition to end sequence
        startFinalVirus();
      }, 5000);
    } else {
      setGameStatus('lost');
      setGodAdminStage('lose-path');
      startDangerousVirus();
    }
  };

  const startDangerousVirus = () => {
    // Explosion, shutdown, no signal, flicker 10 times
    setFinalExplosion(true);
    setTimeout(() => {
      setFinalExplosion(false);
      setIsShutDown(true);
      
      let count = 0;
      const interval = setInterval(() => {
        setIsFlickering(prev => !prev);
        count++;
        if (count >= 20) { // 10 times (on/off)
          clearInterval(interval);
          setIsFlickering(false);
          setIsCooked(true);
          setSadMusic(true);
        }
      }, 200);
    }, 2000);
  };

  const startFinalVirus = () => {
    // Fast flickering green yellow red, shutdown, break, end
    let count = 0;
    const colors = ['#00FF00', '#FFFF00', '#FF0000'];
    const interval = setInterval(() => {
      setFlickerColor(colors[count % 3]);
      setIsFlickering(true);
      count++;
      if (count >= 30) {
        clearInterval(interval);
        setIsFlickering(false);
        setIsShutDown(true);
        setTimeout(() => {
          setIsCooked(true);
          setSadMusic(true);
        }, 3000);
      }
    }, 100);
  };

  const startVirusSequence = () => {
    setVirusActive(true);
    setVirusPhase(1);
    
    // Phase 1: Rapid links and flickering
    let phase = 1;
    const linkInterval = setInterval(() => {
      setVirusLinks(prev => [
        ...prev.slice(-50), // Keep last 50 to avoid crashing but feel full
        { id: Date.now() + Math.random(), top: Math.random() * 90, left: Math.random() * 80 }
      ]);
    }, 100);

    const phaseInterval = setInterval(() => {
      phase++;
      setVirusPhase(phase);
      if (phase === 5) setShowBonzi(true);
      
      if (phase >= 30) {
        clearInterval(phaseInterval);
        clearInterval(linkInterval);
        executeAutoLogout();
      }
    }, 1000);
  };

  const executeAutoLogout = () => {
    setShowBonzi(false);
    setVirusLinks([]);
    setShowLoginScreen(true);
    
    setTimeout(() => {
      setShowLoginScreen(false);
      setScareMusic(true);
      setVirusPhase(51); // Start extreme phase
      
      // Keep incrementing phase for jump scares
      const extremeInterval = setInterval(() => {
        setVirusPhase(prev => prev + 1);
      }, 500);

      // After some extreme flashing, show Windows Defender
      setTimeout(() => {
        clearInterval(extremeInterval);
        setShowDefender(true);
        setDefenderStep(1);
      }, 6000);
    }, 2000);
  };

  const handleRunAnyway = () => {
    setShowDefender(false);
    setVirusPhase(100); // Final crazy phase
    
    const crazyLinkInterval = setInterval(() => {
      setVirusLinks(prev => [
        ...prev.slice(-100), 
        { id: Date.now() + Math.random(), top: Math.random() * 95, left: Math.random() * 90 }
      ]);
    }, 50);

    setTimeout(() => {
      clearInterval(crazyLinkInterval);
      setShowPCBroken(true);
      
      let p = 0;
      const pInterval = setInterval(() => {
        p += Math.floor(Math.random() * 15) + 1;
        if (p >= 100) {
          p = 100;
          clearInterval(pInterval);
        }
        setBsodProgress(p);
      }, 800);
    }, 12000);
  };

  const handleReinstallWindows = () => {
    setShowPCBroken(false);
    setShowFakeWindows(true);
    setFbiPhase(1);
    
    // FBI Sequence: Chill -> Fast -> Message
    setTimeout(() => {
      setFbiPhase(2);
      setTimeout(() => {
        setFbiPhase(3);
        setTimeout(() => {
          setFbiPhase(0);
          setShowFakeWindows(false);
          setShowAVScanner(true);
        }, 5000);
      }, 6000);
    }, 5000);
  };

  const handleClearVirus = () => {
    let p = 0;
    const interval = setInterval(() => {
      p += 1;
      setAvProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setShowAVScanner(false);
        setShowGhostDomePage(true);
      }
    }, 100);
  };

  const handleGhostDomeDownload = () => {
    setGhostDomeDownloaded(true);
    setTimeout(() => {
      setShowGhostDomePage(false);
      setShowFakeWindows(true);
      setFbiPhase(0); // Clear FBI stuff
    }, 3000);
  };

  const handleOpenTikTokApp = () => {
    setShowUserStats(true);
    setTimeout(() => {
      setFinalJokePhase(1);
      setTimeout(() => {
        setFinalJokePhase(2);
        setTimeout(() => {
          setFinalJokePhase(3);
        }, 5000);
      }, 5000);
    }, 6000);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setDownloadProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsDownloading(false);
        setShowComments(null);
        startVirusSequence();
      }
    }, 100);
  };

  if (isShutDown) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white font-sans p-10 text-center relative">
        <button 
          onClick={() => window.location.reload()}
          className="absolute top-6 left-6 flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-bold transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Go back to the Begin
        </button>
        <div className="text-4xl font-bold mb-8">NO SIGNAL</div>
        <div className="text-xl opacity-80 mb-12">Please install windows 11 again</div>
        <div className="w-64 h-2 bg-zinc-900 rounded-full overflow-hidden">
          <div className="w-full h-full bg-blue-600 animate-[loading_10s_linear]" />
        </div>
        <div className="mt-20 text-[10px] opacity-30 uppercase tracking-[0.5em] font-mono">
          System Core Destroyed by Le123 Admin
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black flex flex-col font-sans text-white overflow-hidden select-none relative">
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 z-50 flex justify-center items-center h-14 bg-gradient-to-b from-black/40 to-transparent">
        <div className="flex gap-5">
          <button className="text-[17px] font-bold text-white/60 hover:text-white transition-colors">Following</button>
          <button className="text-[17px] font-bold text-white relative">
            For You
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white rounded-full" />
          </button>
        </div>
        <button className="absolute right-4"><Search className="w-6 h-6" /></button>
      </div>

      {/* Main Feed */}
      <div className="flex-1 overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        {MOCK_VIDEOS.map((video) => (
          <VideoItem 
            key={video.id} 
            video={video} 
            onCommentClick={() => setShowComments(video.id)}
            virusActive={virusActive}
          />
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="h-[50px] bg-black border-t border-white/10 flex items-center justify-around px-2 z-50">
        <button onClick={() => setActiveTab('home')} className="flex flex-col items-center gap-0.5 flex-1">
          <Home className={`w-[26px] h-[26px] ${activeTab === 'home' ? 'text-white' : 'text-white/40'}`} />
          <span className={`text-[10px] font-medium ${activeTab === 'home' ? 'text-white' : 'text-white/40'}`}>Home</span>
        </button>
        <button onClick={() => setActiveTab('friends')} className="flex flex-col items-center gap-0.5 flex-1">
          <User className={`w-[26px] h-[26px] ${activeTab === 'friends' ? 'text-white' : 'text-white/40'}`} />
          <span className={`text-[10px] font-medium ${activeTab === 'friends' ? 'text-white' : 'text-white/40'}`}>Friends</span>
        </button>
        
        <div className="flex-1 flex justify-center">
          <div className="relative w-[45px] h-[28px]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00F2EA] to-[#FF0050] rounded-[8px]" />
            <button className="absolute inset-[1.5px] bg-white text-black rounded-[6px] flex items-center justify-center">
              <Plus className="w-5 h-5 stroke-[3px]" />
            </button>
          </div>
        </div>

        <button onClick={() => setActiveTab('inbox')} className="flex flex-col items-center gap-0.5 flex-1">
          <MessageSquare className={`w-[26px] h-[26px] ${activeTab === 'inbox' ? 'text-white' : 'text-white/40'}`} />
          <span className={`text-[10px] font-medium ${activeTab === 'inbox' ? 'text-white' : 'text-white/40'}`}>Inbox</span>
        </button>
        <button onClick={() => setShowProfile(true)} className="flex flex-col items-center gap-0.5 flex-1">
          <User className={`w-[26px] h-[26px] ${showProfile ? 'text-white' : 'text-white/40'}`} />
          <span className={`text-[10px] font-medium ${showProfile ? 'text-white' : 'text-white/40'}`}>Profile</span>
        </button>
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {showProfile && <ProfileView onClose={() => setShowProfile(false)} />}
        {showComments && (
          <CommentsModal 
            onClose={() => setShowComments(null)} 
            onDownload={handleDownload}
            isDownloading={isDownloading}
            progress={downloadProgress}
            godAdminStage={godAdminStage}
            onGodAdminChoice={handleGodAdminChoice}
            onStartHackerProfile={handleStartHackerProfile}
            onRickPortal={handleRickPortal}
          />
        )}
      </AnimatePresence>

      {/* RICK AND MORTY PORTAL OVERLAYS */}
      <AnimatePresence>
        {rickPortalStage !== 'none' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-[2000] bg-black flex flex-col overflow-hidden"
          >
            {/* Rick Background Glitch Effect */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] animate-pulse" />
            </div>

            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-emerald-500/30 bg-zinc-900/50 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400 animate-spin-slow" />
                <span className="font-black text-emerald-400 tracking-tighter italic">RICKOS v4.2</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs font-mono text-emerald-500/60">UNIVERSE: C-137</div>
                <button onClick={() => setRickPortalStage('none')}><X className="w-6 h-6 text-white/40" /></button>
              </div>
            </div>

            {/* Rick Line Popup */}
            <AnimatePresence>
              {rickLine && (
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="absolute top-20 left-1/2 -translate-x-1/2 z-[2100] bg-emerald-500 text-black px-6 py-2 rounded-full font-black text-sm shadow-[0_0_20px_rgba(16,185,129,0.5)] italic"
                >
                  "{rickLine}"
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {rickPortalStage === 'dashboard' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-900 p-4 rounded-xl border border-emerald-500/20">
                      <div className="text-[10px] text-emerald-500/60 uppercase font-bold">Portal Energy</div>
                      <div className="text-2xl font-black text-white">99.8%</div>
                    </div>
                    <div className="bg-zinc-900 p-4 rounded-xl border border-emerald-500/20">
                      <div className="text-[10px] text-emerald-500/60 uppercase font-bold">Multiverse Score</div>
                      <div className="text-2xl font-black text-emerald-400">{rickScore}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-white/40 uppercase tracking-widest">Game Modes</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <button 
                        onClick={() => setRickPortalStage('defense')}
                        className="bg-zinc-900 hover:bg-zinc-800 p-4 rounded-xl border border-emerald-500/30 flex items-center gap-4 transition-all"
                      >
                        <Zap className="w-6 h-6 text-emerald-400" />
                        <div className="text-left">
                          <div className="font-bold text-white">Portal Defense</div>
                          <div className="text-[10px] text-white/40">Stop the viruses from C-137</div>
                        </div>
                      </button>
                      <button 
                        onClick={() => setRickPortalStage('panic')}
                        className="bg-zinc-900 hover:bg-zinc-800 p-4 rounded-xl border border-yellow-500/30 flex items-center gap-4 transition-all"
                      >
                        <AlertTriangle className="w-6 h-6 text-yellow-400" />
                        <div className="text-left">
                          <div className="font-bold text-white">Morty Panic Mode</div>
                          <div className="text-[10px] text-white/40">Solve puzzles before system failure</div>
                        </div>
                      </button>
                      <button 
                        onClick={() => setRickPortalStage('hacker')}
                        className="bg-zinc-900 hover:bg-zinc-800 p-4 rounded-xl border border-blue-500/30 flex items-center gap-4 transition-all"
                      >
                        <Terminal className="w-6 h-6 text-blue-400" />
                        <div className="text-left">
                          <div className="font-bold text-white">Rick Hacker Mode</div>
                          <div className="text-[10px] text-white/40">Bypass the Galactic Federation</div>
                        </div>
                      </button>
                      <button 
                        onClick={() => setRickPortalStage('survival')}
                        className="bg-zinc-900 hover:bg-zinc-800 p-4 rounded-xl border border-purple-500/30 flex items-center gap-4 transition-all"
                      >
                        <Dna className="w-6 h-6 text-purple-400" />
                        <div className="text-left">
                          <div className="font-bold text-white">Multiverse Survival</div>
                          <div className="text-[10px] text-white/40">Survive rounds with weird rules</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3">
                      <Skull className="w-6 h-6 text-red-500" />
                      <span className="font-black text-red-500 uppercase italic">Danger Zone</span>
                    </div>
                    <button 
                      onClick={startFakeDeletion}
                      className="w-full bg-red-600 py-3 rounded-xl font-black text-white uppercase tracking-widest hover:bg-red-700 transition-colors"
                    >
                      Delete System32
                    </button>
                  </div>

                  {rickUnlocks.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-white/40 uppercase tracking-widest">Unlocks</h4>
                      <div className="flex gap-2">
                        {rickUnlocks.map(u => (
                          <div key={u} className="bg-purple-500/20 border border-purple-500/40 px-3 py-1 rounded-full text-[10px] text-purple-400 font-bold">
                            {u}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {rickPortalStage === 'defense' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-white italic">PORTAL DEFENSE</h2>
                  <PortalDefense onComplete={handleRickGameEnd} onRickLine={handleRickLine} />
                  <button onClick={() => setRickPortalStage('dashboard')} className="text-white/40 text-xs uppercase font-bold">Abort Mission</button>
                </div>
              )}

              {rickPortalStage === 'panic' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-white italic">MORTY PANIC</h2>
                  <MortyPanic onComplete={handleRickGameEnd} onRickLine={handleRickLine} />
                  <button onClick={() => setRickPortalStage('dashboard')} className="text-white/40 text-xs uppercase font-bold">Abort Mission</button>
                </div>
              )}

              {rickPortalStage === 'hacker' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-white italic">RICK HACKER</h2>
                  <RickHacker onComplete={handleRickGameEnd} />
                  <button onClick={() => setRickPortalStage('dashboard')} className="text-white/40 text-xs uppercase font-bold">Abort Mission</button>
                </div>
              )}

              {rickPortalStage === 'survival' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-white italic">MULTIVERSE SURVIVAL</h2>
                  <MultiverseSurvival onComplete={handleRickGameEnd} onRickLine={handleRickLine} />
                  <button onClick={() => setRickPortalStage('dashboard')} className="text-white/40 text-xs uppercase font-bold">Abort Mission</button>
                </div>
              )}

              {rickPortalStage === 'reset' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
                  <div className="w-32 h-32 rounded-full bg-red-600 flex items-center justify-center animate-pulse">
                    <AlertTriangle className="w-16 h-16 text-white" />
                  </div>
                  <div>
                    <h1 className="text-white font-black text-4xl mb-2">UNIVERSE RESET</h1>
                    <p className="text-white/60">You failed the multiverse, Jerry.</p>
                  </div>
                  <button 
                    onClick={() => { setRickPortalStage('dashboard'); setRickScore(0); }}
                    className="bg-white text-black px-10 py-4 rounded-2xl font-black text-xl hover:scale-110 transition-transform"
                  >
                    TRY AGAIN
                  </button>
                </div>
              )}

              {rickPortalStage === 'bsod' && (
                <div className="absolute inset-0 bg-[#0000AA] flex flex-col p-10 font-mono text-white">
                  <div className="text-6xl mb-10">:(</div>
                  <div className="text-2xl mb-10">Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.</div>
                  <div className="text-xl mb-20">0% complete</div>
                  
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute bottom-10 right-10 flex flex-col items-center gap-4"
                  >
                    <img 
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=rick-bsod" 
                      className="w-32 h-32 rounded-full border-4 border-white shadow-2xl"
                      alt="Rick"
                    />
                    <div className="bg-white text-black p-4 rounded-2xl font-bold italic relative">
                      "Wubba Lubba Dub Dub! Just kidding, it's a simulation."
                      <div className="absolute -top-2 right-4 w-4 h-4 bg-white rotate-45" />
                    </div>
                    <button 
                      onClick={() => setRickPortalStage('dashboard')}
                      className="bg-white text-black px-6 py-2 rounded-lg font-bold mt-4"
                    >
                      Back to RickOS
                    </button>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Fake Deletion Overlay */}
            {fakeDeleting && (
              <div className="absolute inset-0 z-[2500] bg-black/90 flex flex-col items-center justify-center p-10 text-center">
                <Skull className="w-20 h-20 text-red-500 mb-6 animate-bounce" />
                <h2 className="text-white font-black text-2xl mb-2">DELETING SYSTEM32...</h2>
                <div className="w-full max-w-md h-4 bg-zinc-800 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className="h-full bg-red-600 transition-all duration-100" 
                    style={{ width: `${fakeProgress}%` }}
                  />
                </div>
                <div className="mt-4 text-white/40 font-mono text-xs">{fakeProgress}% Complete</div>
                <p className="mt-10 text-red-500 font-bold italic">"Oh geez Rick, are you sure about this?"</p>
                {fakeProgress === 100 && (
                  <button 
                    onClick={() => { setFakeDeleting(false); setRickPortalStage('bsod'); }}
                    className="mt-10 bg-white text-black px-8 py-3 rounded-xl font-black"
                  >
                    CRITICAL ERROR
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* GOD ADMIN FLOW OVERLAYS */}
      <AnimatePresence>
        {godAdminStage === 'hacker-profile' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-[1000] bg-black flex flex-col"
          >
            <div className="p-4 flex items-center gap-4 border-b border-white/10">
              <ChevronLeft className="w-6 h-6" onClick={() => setGodAdminStage('none')} />
              <h2 className="font-bold">Hacker123</h2>
            </div>
            <div className="flex flex-col items-center py-10 gap-4">
              <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-[#FE2C55] overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=hacker123" alt="Hacker" />
              </div>
              <span className="font-bold text-xl">@Hacker123</span>
              <div className="flex gap-8">
                <div className="flex flex-col items-center">
                  <span className="font-black text-xl">{hackerProfileFollowers}</span>
                  <span className="text-xs text-white/40">Followers</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-black text-xl">1.0B</span>
                  <span className="text-xs text-white/40">Likes</span>
                </div>
              </div>
              <button className="bg-[#FE2C55] px-10 py-2 rounded-sm font-bold mt-4">Follow</button>
            </div>
            <div className="grid grid-cols-3 gap-1 p-1">
              <div 
                onClick={handleStartWindows12}
                className="aspect-[3/4] bg-zinc-900 relative cursor-pointer overflow-hidden group"
              >
                <img src="https://picsum.photos/seed/hackervid/400/600" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Plus className="w-10 h-10 text-white opacity-50" />
                </div>
                <div className="absolute bottom-2 left-2 text-[10px] font-bold">1.2B views</div>
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-zinc-800" />
              ))}
            </div>
          </motion.div>
        )}

        {godAdminStage === 'windows-12' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-[1100] bg-[#0078D7] flex flex-col overflow-hidden"
          >
            {/* Windows 12 Desktop */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-900" />
            
            <div className="relative flex-1 p-10">
              <div className="text-white font-black text-4xl mb-10 drop-shadow-lg">Welcome to Windows 12</div>
              
              <div className="grid grid-cols-1 gap-10 w-20">
                <div 
                  onClick={handleOpenGoogle}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Search className="w-10 h-10 text-blue-500" />
                  </div>
                  <span className="text-white text-[10px] font-bold">Google</span>
                </div>
              </div>

              {windows12Stage === 'google-open' && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-20 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                >
                  <div className="h-10 bg-zinc-100 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <div className="flex-1 bg-white h-6 rounded-full mx-4 border border-zinc-200" />
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center p-10">
                    <Search className="w-20 h-20 text-zinc-200 mb-6" />
                    <div className="w-full max-w-md h-10 border border-zinc-200 rounded-full mb-10" />
                    
                    {showGraveYardExe && (
                      <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        onClick={handleRunGraveYard}
                        className="bg-zinc-100 p-6 rounded-2xl border-2 border-dashed border-zinc-300 flex flex-col items-center gap-4 cursor-pointer hover:bg-zinc-200 transition-colors"
                      >
                        <AlertTriangle className="w-12 h-12 text-red-500" />
                        <span className="font-black text-zinc-800">Grave yard site.exe</span>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Run File</button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {windows12Stage === 'reinstall' && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-10 text-center">
                  <h2 className="text-white font-black text-4xl mb-8">SYSTEM CORRUPTED</h2>
                  <button 
                    onClick={handleReinstallW12}
                    className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xl hover:scale-110 transition-transform shadow-[0_0_30px_rgba(37,99,235,0.5)]"
                  >
                    RE-INSTALL WINDOWS 12
                  </button>
                </div>
              )}

              {windows12Stage === 'game' && (
                <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center p-10">
                  <div className="bg-black border-4 border-white/10 rounded-3xl p-10 w-full max-w-xl flex flex-col items-center gap-10">
                    <h2 className="text-white font-black text-3xl uppercase tracking-widest">Follower Challenge</h2>
                    <p className="text-white/60 text-center">Click the follower icon 20 times in 5 seconds to win!</p>
                    
                    <FollowerGame onComplete={handleGameResult} />
                  </div>
                </div>
              )}
            </div>

            {/* Taskbar */}
            <div className="h-12 bg-black/40 backdrop-blur-md flex items-center justify-center gap-4 px-4">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-2 h-2 bg-white/40" />
                  <div className="w-2 h-2 bg-white/40" />
                  <div className="w-2 h-2 bg-white/40" />
                  <div className="w-2 h-2 bg-white/40" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {godAdminStage === 'win-path' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-[1500] bg-emerald-600 flex flex-col items-center justify-center p-10 text-center"
          >
            <ShieldCheck className="w-32 h-32 text-white mb-8 animate-bounce" />
            <h1 className="text-white font-black text-6xl mb-4">YOU WON!</h1>
            <p className="text-white text-2xl font-bold">Windows 12 Restored. 200M Followers Added.</p>
            
            <div className="mt-20 bg-white/20 p-6 rounded-2xl border-2 border-white/40 animate-pulse">
              <span className="text-white font-black text-xl">file.exe is ready for download</span>
            </div>
          </motion.div>
        )}

        {godAdminStage === 'lose-path' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-[1500] bg-red-600 flex flex-col items-center justify-center p-10 text-center"
          >
            <AlertTriangle className="w-32 h-32 text-white mb-8 animate-pulse" />
            <h1 className="text-white font-black text-6xl mb-4">YOU LOST!</h1>
            <p className="text-white text-2xl font-bold">Windows 12 Deleted. Installing Dangerous Virus...</p>
          </motion.div>
        )}

        {isCooked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-[2000] bg-black flex flex-col items-center justify-center p-10 text-center relative"
          >
            <button 
              onClick={() => window.location.reload()}
              className="absolute top-6 left-6 flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-bold transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Go back to the Begin
            </button>
            <div className="text-white/20 font-mono text-xs mb-20 uppercase tracking-[1em]">System Terminated</div>
            <h1 className="text-white font-black text-5xl mb-6 tracking-tighter">Welcome to the end</h1>
            <p className="text-white/60 text-2xl font-bold mb-12 italic">And now your computer is cooked np</p>
            
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="w-full h-full bg-[#FE2C55] animate-pulse" />
            </div>

            {sadMusic && (
              <div className="mt-20 text-white/40 animate-pulse font-serif italic text-lg">
                * Sad violin music playing *
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL VIRUS EFFECTS */}
      {isFlickering && (
        <div 
          className="absolute inset-0 z-[3000] pointer-events-none" 
          style={{ backgroundColor: flickerColor }} 
        />
      )}
      
      {isFakeShutDown && (
        <div className="absolute inset-0 z-[3100] bg-black pointer-events-none flex items-center justify-center">
          <div className="w-2 h-2 bg-zinc-800 rounded-full animate-ping" />
        </div>
      )}

      {finalExplosion && (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 5, opacity: 1 }}
          className="absolute inset-0 z-[3200] bg-white rounded-full pointer-events-none"
        />
      )}

      {/* VIRUS COMPONENTS */}
      <AnimatePresence>
        {virusActive && virusLinks.map(link => (
          <motion.div 
            key={link.id}
            initial={{ scale: 0, rotate: Math.random() * 20 - 10 }}
            animate={{ scale: 1 }}
            className="absolute z-[450] bg-[#0078D7] text-white p-3 rounded shadow-2xl text-[12px] font-bold border-2 border-white/40 cursor-pointer"
            style={{ top: `${link.top}%`, left: `${link.left}%` }}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              CRITICAL_ERROR_0x800{Math.floor(Math.random() * 999)}.EXE
            </div>
          </motion.div>
        ))}

        {virusActive && (virusPhase % 2 === 0 || virusPhase > 50) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[500] pointer-events-none flex items-center justify-center"
          >
            <div className="w-full h-full bg-white/10 animate-extreme-flash" />
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=scary&mouth=scream&eyes=surprised" 
              className="absolute w-[150%] h-[150%] object-contain filter invert opacity-20 animate-pulse"
              alt="Jump Scare"
            />
          </motion.div>
        )}

        {showBonzi && (
          <motion.div 
            drag
            dragMomentum={false}
            initial={{ x: bonziPos.x, y: bonziPos.y }}
            className="absolute z-[600] w-48 h-48 cursor-move touch-none"
          >
            <img 
              src="https://api.dicebear.com/7.x/bottts/svg?seed=bonzi&backgroundColor=7e22ce" 
              className="w-full h-full drop-shadow-[0_0_30px_rgba(126,34,206,1)]"
              alt="Bonzi Buddy"
              draggable="false"
            />
            <div className="absolute -top-12 left-0 bg-white text-black p-3 rounded-xl text-sm font-black border-2 border-purple-600 shadow-xl whitespace-nowrap">
              "DRAG ME IF YOU CAN! HAHAHA!"
            </div>
          </motion.div>
        )}

        {showDefender && (
          <div className="absolute inset-0 z-[900] bg-black/40 flex items-center justify-center p-6">
            <div className="bg-[#0078D7] w-full max-w-2xl text-white p-10 font-sans shadow-2xl">
              <div className="flex items-start gap-6">
                <ShieldAlert className="w-16 h-16 shrink-0" />
                <div className="space-y-6">
                  <h1 className="text-3xl font-light">Windows protected your PC</h1>
                  <p className="text-lg opacity-90">
                    Microsoft Defender SmartScreen prevented an unrecognized app from starting. Running this app might put your PC at risk.
                  </p>
                  
                  {defenderStep === 1 ? (
                    <button 
                      onClick={() => setDefenderStep(2)}
                      className="text-white underline text-lg hover:opacity-70"
                    >
                      More info
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-[100px_1fr] gap-2 text-sm opacity-80">
                        <span>App:</span> <span>TikTok_Admin_Panel_Le123.exe</span>
                        <span>Publisher:</span> <span>Unknown publisher</span>
                      </div>
                      <div className="flex justify-end gap-4 pt-4">
                        <button 
                          onClick={handleRunAnyway}
                          className="bg-white/10 hover:bg-white/20 px-8 py-2 border border-white/40"
                        >
                          Run anyway
                        </button>
                        <button 
                          className="bg-white text-[#0078D7] px-8 py-2 font-semibold"
                        >
                          Don't run
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {showPCBroken && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-[1000] bg-blue-700 flex flex-col items-center justify-center p-10 text-center gap-8"
          >
            <div className="text-9xl font-light mb-4">:(</div>
            <h1 className="text-4xl font-light max-w-2xl">
              Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.
            </h1>
            <div className="text-2xl opacity-80">
              {bsodProgress}% complete
            </div>

            {bsodProgress === 100 && (
              <button 
                onClick={handleReinstallWindows}
                className="absolute left-20 bottom-40 bg-white text-blue-700 px-10 py-4 rounded-lg font-bold text-xl hover:scale-105 transition-transform shadow-2xl"
              >
                Reinstall Windows
              </button>
            )}
            <div className="mt-12 text-left max-w-2xl space-y-2 opacity-60 font-mono text-sm">
              <p>For more information about this issue and possible fixes, visit https://www.windows.com/stopcode</p>
              <p>If you call a support person, give them this info:</p>
              <p>Stop code: CRITICAL_PROCESS_DIED_BY_LE123</p>
              <p>Thx for downloading the scary file from Le123 admin of tiktok and now we got all your files</p>
            </div>
          </motion.div>
        )}

        {scareMusic && (
          <div className="absolute inset-0 z-[400] pointer-events-none bg-red-600/20 animate-extreme-flash" />
        )}
      </AnimatePresence>

      {/* FAKE WINDOWS / FBI SEQUENCE */}
      <AnimatePresence>
        {showFakeWindows && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-[1100] bg-[#0078D7] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Desktop Background (Fake) */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900 opacity-80" />
            
            {/* TIKTOK ICON ON DESKTOP */}
            {!showUserStats && ghostDomeDownloaded && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={handleOpenTikTokApp}
                className="absolute top-10 left-10 flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform border border-white/20">
                  <img src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/TikTok_logo.svg/1200px-TikTok_logo.svg.png" className="w-10" alt="TikTok" />
                </div>
                <span className="text-white text-xs font-bold drop-shadow-lg">TikTok</span>
              </motion.div>
            )}

            {/* FBI LOGO (Only during FBI phase) */}
            {fbiPhase > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="relative z-10 flex flex-col items-center gap-6"
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Seal_of_the_Federal_Bureau_of_Investigation.svg/1200px-Seal_of_the_Federal_Bureau_of_Investigation.svg.png" 
                  className="w-64 h-64 drop-shadow-[0_0_50px_rgba(255,255,255,0.5)]"
                  alt="FBI"
                />
                <h1 className="text-white font-black text-5xl tracking-tighter uppercase drop-shadow-lg">FEDERAL BUREAU OF INVESTIGATION</h1>
              </motion.div>
            )}

            {/* USER STATS PAGE (OPENED FROM DESKTOP) */}
            <AnimatePresence>
              {showUserStats && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-10 z-[1200] bg-black rounded-3xl border-4 border-white/10 shadow-2xl overflow-hidden flex flex-col"
                >
                  <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-900">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 p-1">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                          <User className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div>
                        <h2 className="font-black text-2xl">Your Profile</h2>
                        <p className="text-white/40 text-sm">@user_legend_2026</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                  </div>

                  <div className="flex-1 p-10 flex flex-col items-center justify-center gap-12">
                    <div className="grid grid-cols-3 gap-12 w-full max-w-3xl">
                      <div className="text-center space-y-2">
                        <div className="text-6xl font-black text-white tracking-tighter">1.0B</div>
                        <div className="text-white/40 uppercase tracking-widest font-bold text-sm">Followers</div>
                      </div>
                      <div className="text-center space-y-2">
                        <div className="text-6xl font-black text-[#FE2C55] tracking-tighter">45.2M</div>
                        <div className="text-white/40 uppercase tracking-widest font-bold text-sm">Likes</div>
                      </div>
                      <div className="text-center space-y-2">
                        <div className="text-6xl font-black text-blue-400 tracking-tighter">1.0B</div>
                        <div className="text-white/40 uppercase tracking-widest font-bold text-sm">Views</div>
                      </div>
                    </div>

                    <div className="bg-emerald-500/20 border-2 border-emerald-500 p-6 rounded-2xl animate-bounce">
                      <div className="text-emerald-500 font-black text-2xl uppercase tracking-widest">GHOST DOME ACTIVE</div>
                    </div>
                  </div>

                  {/* FINAL JOKE OVERLAYS */}
                  <AnimatePresence>
                    {finalJokePhase === 1 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute inset-0 bg-black/90 flex items-center justify-center p-10 text-center"
                      >
                        <h1 className="text-white font-black text-4xl leading-tight">
                          "your system is cooked bye bye i hope you had fun from the Gerney we did"
                        </h1>
                      </motion.div>
                    )}

                    {finalJokePhase === 2 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-white flex flex-col items-center justify-center p-10 text-center"
                      >
                        <img 
                          src="https://picsum.photos/seed/god/800/800" 
                          className="w-full max-w-md rounded-3xl shadow-2xl mb-8 border-8 border-yellow-400"
                          alt="God"
                        />
                        <h2 className="text-black font-black text-5xl uppercase tracking-tighter">DIVINE INTERVENTION</h2>
                      </motion.div>
                    )}

                    {finalJokePhase === 3 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 flex flex-col items-center justify-center p-10 text-center gap-8"
                      >
                        <div className="space-y-4">
                          <h1 className="text-white font-black text-5xl tracking-tighter uppercase">Life long this was all a joke</h1>
                          <p className="text-white text-3xl font-bold">and we all love you have fun</p>
                        </div>
                        
                        <div className="bg-black/40 p-8 rounded-3xl border-2 border-white/20 backdrop-blur-xl space-y-6">
                          <p className="text-white text-2xl font-black uppercase tracking-widest">pls like and follow to my Chanel</p>
                          <div className="flex justify-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#FE2C55] flex items-center justify-center animate-bounce">
                              <Heart className="text-white fill-white" />
                            </div>
                            <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center animate-bounce delay-100">
                              <Plus className="text-white" />
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => window.location.reload()}
                          className="mt-8 bg-white text-black font-black px-10 py-4 rounded-2xl text-xl hover:scale-110 transition-transform"
                        >
                          RESTART APP
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FLASHING OVERLAY */}
            {fbiPhase === 1 && <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />}
            {fbiPhase === 2 && <div className="absolute inset-0 bg-white/30 animate-extreme-flash pointer-events-none" />}
            
            {/* FBI MESSAGE */}
            {fbiPhase === 3 && (
              <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute bottom-20 bg-black/80 p-8 rounded-2xl border-2 border-red-600 text-center max-w-2xl z-20"
              >
                <p className="text-red-500 font-black text-3xl animate-pulse uppercase">
                  "Your files belong to the FBI, searching them right now"
                </p>
                <div className="mt-4 text-white/40 font-mono text-sm">
                  UPLOADING DATA TO QUANTICO SERVERS...
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ANTI-VIRUS SCANNER */}
      <AnimatePresence>
        {showAVScanner && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 z-[1200] bg-zinc-950 flex flex-col items-center justify-center p-10"
          >
            <div className="bg-zinc-900 border-2 border-emerald-500 rounded-3xl p-10 max-w-md w-full flex flex-col items-center gap-8 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
              <ShieldCheck className="w-24 h-24 text-emerald-500 animate-pulse" />
              <div className="text-center space-y-2">
                <h2 className="text-emerald-500 font-black text-3xl uppercase tracking-tighter">VIRUS FOUND</h2>
                <p className="text-white/60 font-medium">
                  "Virus found from anti virus i installed in the comments"
                </p>
              </div>
              
              <div className="w-full space-y-2">
                <div className="flex justify-between text-xs font-mono text-emerald-500/60 uppercase">
                  <span>Clearing System...</span>
                  <span>{avProgress}%</span>
                </div>
                <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${avProgress}%` }} />
                </div>
              </div>

              {avProgress < 100 ? (
                <button 
                  onClick={handleClearVirus}
                  disabled={avProgress > 0}
                  className="w-full bg-emerald-500 text-black font-black py-4 rounded-xl text-lg uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-50"
                >
                  CLEAR VIRUS
                </button>
              ) : (
                <div className="text-emerald-500 font-black text-xl animate-bounce">CLEARED!</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GHOST DOME PAGE (LE123 PROFILE) */}
      <AnimatePresence>
        {showGhostDomePage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-[1300] bg-black flex flex-col"
          >
            <div className="p-4 flex items-center gap-4 border-b border-white/10">
              <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden border-2 border-[#FE2C55]">
                <img src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Le123" />
              </div>
              <div>
                <h2 className="font-bold text-lg flex items-center gap-1">
                  Le123 <CheckCircle2 className="w-4 h-4 text-blue-400 fill-blue-400" />
                </h2>
                <p className="text-xs text-white/40">Admin of TikTok</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="bg-zinc-900 rounded-3xl p-8 border-2 border-purple-500 space-y-6 shadow-[0_0_50px_rgba(168,85,247,0.2)]">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                    <Ghost className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-2xl tracking-tighter uppercase">GHOST DOME</h3>
                    <p className="text-white/60 text-sm">Official TikTok View Booster v4.0</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-black/40 p-3 rounded-xl">
                    <div className="text-purple-400 font-black text-xl">1B+</div>
                    <div className="text-[10px] text-white/40 uppercase">Followers</div>
                  </div>
                  <div className="bg-black/40 p-3 rounded-xl">
                    <div className="text-purple-400 font-black text-xl">45M</div>
                    <div className="text-[10px] text-white/40 uppercase">Likes</div>
                  </div>
                  <div className="bg-black/40 p-3 rounded-xl">
                    <div className="text-purple-400 font-black text-xl">100%</div>
                    <div className="text-[10px] text-white/40 uppercase">Safe</div>
                  </div>
                </div>

                <button 
                  onClick={handleGhostDomeDownload}
                  disabled={ghostDomeDownloaded}
                  className="w-full bg-white text-black font-black py-5 rounded-2xl text-xl uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {ghostDomeDownloaded ? "INJECTING VIEWS..." : "DOWNLOAD GHOST DOME"}
                </button>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Recent Comments</h4>
                  {[
                    { user: "mrbeast", text: "Verified by me, this is the real deal! 🚀", verified: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mrbeast" },
                    { user: "Elon Musk", text: "super good", verified: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elon" },
                    { user: "xX_Pro_Gamer_Xx", text: "IT WORKS!! I JUST GOT 1B FOLLOWERS OMG", verified: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=gamer1" },
                    { user: "tiktok_queen_2026", text: "Le123 is the best admin ever, Ghost Dome is insane", verified: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=queen" }
                  ].map((c, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 shrink-0 overflow-hidden">
                        <img src={c.avatar} className="w-full h-full" alt={c.user} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-white/60">{c.user}</span>
                          {c.verified && (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-blue-400 fill-blue-400" />
                              <span className="text-[10px] text-blue-400 font-bold uppercase">Verified User</span>
                            </div>
                          )}
                        </div>
                        <p className="text-white/80">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {ghostDomeDownloaded && (
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-emerald-500/20 border-2 border-emerald-500 p-6 rounded-2xl text-center space-y-2"
                >
                  <div className="text-emerald-500 font-black text-4xl">1,000,000,000</div>
                  <div className="text-white/60 font-bold uppercase tracking-widest text-xs">FOLLOWERS ADDED TO YOUR ACCOUNT</div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FINAL EXPLOSION / SHUTDOWN */}
      <AnimatePresence>
        {finalExplosion && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-[2000] bg-white pointer-events-none flex items-center justify-center overflow-hidden"
          >
            <div className="w-full h-full bg-red-600 animate-extreme-flash" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
              <h1 className="text-black font-black text-9xl animate-ping">BOOM!</h1>
              <p className="text-black font-black text-4xl uppercase tracking-tighter text-center max-w-md">
                NO MORE HELP. SYSTEM DESTROYED.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: black;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes hacking-flash {
          0%, 100% { background: transparent; }
          2% { background: rgba(255, 255, 255, 0.8); }
          4% { background: rgba(0, 0, 0, 1); }
          6% { background: rgba(0, 255, 0, 0.5); }
          8% { background: rgba(255, 0, 0, 0.5); }
          10% { background: transparent; }
        }
        .animate-hacking-flash {
          animation: hacking-flash 0.1s infinite;
        }

        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }

        @keyframes extreme-flash {
          0%, 100% { background: transparent; }
          50% { background: rgba(255, 255, 255, 0.7); }
        }
        .animate-extreme-flash {
          animation: extreme-flash 0.05s infinite;
        }

        @keyframes hacking-text {
          0% { transform: translateX(100%) rotate(-25deg); }
          100% { transform: translateX(-100%) rotate(-25deg); }
        }
        .animate-hacking-text {
          animation: hacking-text 3s linear infinite;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 10s linear infinite;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
