// components/LoadingScreen.tsx
export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
      {/* Subtle background grid effect */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      
      <div className="relative flex flex-col items-center">
        {/* The "NESS" Logo Container */}
        <div className="relative flex items-center justify-center w-24 h-24 mb-8">
          {/* Animated Outer Rings */}
          <div className="absolute inset-0 rounded-full border border-white/20 animate-ping duration-[3000ms]" />
          <div className="absolute inset-2 rounded-full border border-white/10 animate-pulse" />
          
          {/* Main Logo Hexagon/Circle */}
          <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-white rounded-xl rotate-45 transition-transform duration-1000 animate-in zoom-in-50">
            <span className="text-black text-3xl font-black -rotate-45 tracking-tighter">N</span>
          </div>
        </div>

        {/* Brand Name & Status */}
        <div className="text-center space-y-2">
          <h1 className="text-white text-2xl font-bold tracking-[0.2em] uppercase animate-in slide-in-from-bottom-4 duration-700">
            NESS
          </h1>
          <div className="flex items-center gap-2">
            <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-white/50" />
            <p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.3em]">
              Establishing Secure Link
            </p>
            <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-white/50" />
          </div>
        </div>

        {/* Minimal Progress Bar */}
        <div className="absolute bottom-[-60px] w-48 h-[2px] bg-white/5 overflow-hidden rounded-full">
          <div className="h-full bg-white/40 animate-progress origin-left" />
        </div>
      </div>
    </div>
  );
}