export const LegoBackground = () => {
  const blocks = [
    { top: '10%', left: '5%', size: 60, color: '#FCD34D', delay: 0 },
    { top: '20%', left: '15%', size: 80, color: '#FBBF24', delay: 0.5 },
    { top: '15%', left: '75%', size: 70, color: '#F59E0B', delay: 1 },
    { top: '40%', left: '10%', size: 90, color: '#D97706', delay: 1.5 },
    { top: '50%', left: '80%', size: 75, color: '#FCD34D', delay: 2 },
    { top: '70%', left: '20%', size: 85, color: '#FBBF24', delay: 2.5 },
    { top: '65%', left: '70%', size: 65, color: '#F59E0B', delay: 3 },
    { top: '30%', left: '50%', size: 95, color: '#D97706', delay: 3.5 },
    { top: '80%', left: '45%', size: 70, color: '#FCD34D', delay: 4 },
  ];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {blocks.map((block, i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{
            top: block.top,
            left: block.left,
            width: `${block.size * 1.4}px`,
            height: `${block.size * 1.4}px`,
            animationDelay: `${block.delay}s`,
          }}
        >
          <div
            className="w-full h-full relative"
            style={{
              background: `linear-gradient(135deg, ${block.color} 0%, ${block.color}dd 50%, ${block.color}99 100%)`,
              borderRadius: '12px',
              boxShadow: `
                inset -3px -3px 6px rgba(0,0,0,0.25),
                inset 3px 3px 6px rgba(255,255,255,0.4),
                6px 6px 18px rgba(0,0,0,0.2)
              `,
              transform: 'perspective(700px) rotateX(18deg) rotateY(-14deg)',
              opacity: 0.45,
            }}
          >
            {/* Pinos do Lego */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${block.color}ee, ${block.color}88)`,
                boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.4), 1px 1px 3px rgba(0,0,0,0.3)'
              }}
            />
            <div className="absolute top-2 left-1/4 w-3 h-3 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${block.color}ee, ${block.color}88)`,
                boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.4), 1px 1px 3px rgba(0,0,0,0.3)'
              }}
            />
            <div className="absolute top-2 right-1/4 w-3 h-3 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${block.color}ee, ${block.color}88)`,
                boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.4), 1px 1px 3px rgba(0,0,0,0.3)'
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
