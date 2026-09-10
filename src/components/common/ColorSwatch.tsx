import React from 'react';

interface ColorSwatchProps {
  colorName: string;
  colorHex: string;
  targetHex?: string;
  deltaE?: number;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showLabel?: boolean;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  colorName,
  colorHex,
  targetHex,
  deltaE,
  size = 'md',
  showLabel = true
}) => {
  const sizeMap = {
    sm: 'w-4 h-4 rounded-sm',
    md: 'w-6 h-6 rounded',
    lg: 'w-10 h-10 rounded-md',
    hero: 'w-full h-16 rounded-md'
  };

  return (
    <div className="flex items-center gap-2">
      <div 
        className={`relative ${sizeMap[size]} border border-black/15 shadow-inner shrink-0 overflow-hidden`}
        style={{ backgroundColor: colorHex }}
        title={`${colorName} (${colorHex})`}
      >
        {/* Subtle textile weave reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-white/10 pointer-events-none" />
      </div>
      
      {showLabel && (
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-xs tracking-wider text-slate-900 uppercase truncate">
            {colorName}
          </span>
          {deltaE !== undefined && (
            <span className={`text-[10px] font-mono ${deltaE <= 0.8 ? 'text-emerald-700' : 'text-amber-700'}`}>
              ΔE = {deltaE.toFixed(2)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
