import { useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Plus } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Timeline() {
  const { 
    currentTime, 
    duration, 
    isPlaying, 
    setCurrentTime, 
    togglePlay,
    keyframes,
    blocks 
  } = useStore();
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Animation loop
  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now() - currentTime * 1000;
      
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed >= duration) {
          setCurrentTime(0);
        } else {
          setCurrentTime(elapsed);
        }
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, duration, setCurrentTime, currentTime]);

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = x / rect.width;
      setCurrentTime(percent * duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 10);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms}`;
  };

  const progress = (currentTime / duration) * 100;

  return (
    <div className="h-32 border-t border-gray-200 bg-white flex flex-col">
      {/* Controls */}
      <div className="h-10 border-b border-gray-100 flex items-center px-3 gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentTime(0)}
            className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
            title="Go to start"
          >
            <SkipBack size={14} />
          </button>
          <button
            onClick={togglePlay}
            className={`p-1.5 rounded ${isPlaying ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-600'}`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={() => setCurrentTime(duration)}
            className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
            title="Go to end"
          >
            <SkipForward size={14} />
          </button>
        </div>

        <div className="h-4 w-px bg-gray-200" />

        <span className="text-xs font-mono text-gray-600 w-24">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <div className="h-4 w-px bg-gray-200" />

        <button className="flex items-center gap-1 px-2 py-1 text-xs font-mono text-gray-600 hover:bg-gray-100 rounded">
          <Plus size={12} />
          Keyframe
        </button>

        <div className="flex-1" />

        <select className="text-xs font-mono text-gray-600 border border-gray-200 rounded px-2 py-1 focus:outline-none">
          <option>1x</option>
          <option>0.5x</option>
          <option>2x</option>
        </select>
      </div>

      {/* Timeline ruler */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Time markers */}
        <div className="h-5 border-b border-gray-100 flex items-end px-3 relative">
          {Array.from({ length: Math.ceil(duration) + 1 }).map((_, i) => (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{ left: `${(i / duration) * 100}%` }}
            >
              <span className="text-[9px] font-mono text-gray-400">{i}s</span>
              <div className="w-px h-2 bg-gray-200" />
            </div>
          ))}
        </div>

        {/* Timeline track */}
        <div 
          ref={timelineRef}
          className="flex-1 relative cursor-pointer mx-3 my-2"
          onClick={handleTimelineClick}
        >
          {/* Background track */}
          <div className="absolute inset-0 bg-gray-100 rounded" />
          
          {/* Progress */}
          <div 
            className="absolute inset-y-0 left-0 bg-gray-200 rounded-l"
            style={{ width: `${progress}%` }}
          />

          {/* Playhead */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-black z-10"
            style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45" />
          </div>

          {/* Keyframes */}
          {keyframes.map((kf) => (
            <div
              key={kf.id}
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-orange-400 rounded-full border border-orange-600 cursor-pointer hover:scale-125 transition-transform"
              style={{ left: `${(kf.time / duration) * 100}%`, transform: 'translate(-50%, -50%)' }}
              title={`${kf.property}: ${kf.value} @ ${kf.time}s`}
            />
          ))}

          {/* Block tracks preview */}
          {blocks.length > 0 && (
            <div className="absolute inset-x-0 bottom-0 h-4 flex items-center gap-1 px-1">
              {blocks.slice(0, 5).map((block, i) => (
                <div
                  key={block.id}
                  className="h-2 rounded text-[8px] flex items-center justify-center truncate"
                  style={{ 
                    backgroundColor: block.style.stroke + '40',
                    border: `1px solid ${block.style.stroke}`,
                    width: `${100 / Math.min(blocks.length, 5)}%`,
                    maxWidth: 80
                  }}
                />
              ))}
              {blocks.length > 5 && (
                <span className="text-[9px] text-gray-400">+{blocks.length - 5}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
