import React from 'react';

export function BackgroundGlows() {
  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] bg-indigo-600/5 blur-[100px] rounded-full" />
    </div>
  );
}
