import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-base pointer-events-none">
      <div className="absolute inset-0 opacity-20 transition-opacity duration-1000 ease-in-out">
        {/* Orb 1: Brand color, moving diagonally */}
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full mix-blend-screen filter blur-[100px] opacity-60 bg-brand animate-blob-slow" />
        
        {/* Orb 2: Brand light, moving inversely */}
        <div className="absolute top-[20%] -right-[10%] w-[45vw] h-[45vw] rounded-full mix-blend-screen filter blur-[100px] opacity-50 bg-brand-light animate-blob-medium" />
        
        {/* Orb 3: Brand hover, moving bottom left */}
        <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full mix-blend-screen filter blur-[120px] opacity-40 bg-brand-hover animate-blob-fast" />
      </div>
      
      {/* Subtle noise texture overlay for premium matte feel */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgibm9pc2VGaWx0ZXIpIi8+PC9zdmc+')] pointer-events-none" />
    </div>
  );
};
