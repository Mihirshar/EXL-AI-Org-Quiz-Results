'use client';

import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Archetype } from '@/lib/archetypes';
import { Scores, SCORE_METRICS } from '@/lib/gameData';

interface ShareCertificateProps {
  playerName: string;
  playerLevel?: string;
  archetype: Archetype;
  scores: Scores;
  isWinner: boolean;
  avatarUrl?: string;
  onClose: () => void;
}

export default function ShareCertificate({
  playerName,
  playerLevel,
  archetype,
  scores,
  isWinner,
  avatarUrl,
  onClose,
}: ShareCertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!certificateRef.current) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3,
        backgroundColor: '#FFFFFF',
        logging: true,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement('a');
      link.download = `EXL-AI-Strategy-${playerName.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate certificate:', err);
    }
  }, [playerName]);

  const handleShare = useCallback(async () => {
    const shareText = `I just completed the EXL AI Org Board Challenge! 🎯\n\nMy Leadership Archetype: ${archetype.name}\n${isWinner ? '✅ Successfully achieved the 12-month transformation!' : '📊 Learned valuable AI strategy insights!'}\n\n#AIStrategy #Leadership #EXL`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EXL AI Org Board Challenge Results',
          text: shareText,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Results copied to clipboard!');
    }
  }, [archetype, isWinner]);

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col items-center w-full max-w-[640px]"
      >
        {/* Responsive wrapper using CSS scale to fit mobile screens */}
        <div
          className="origin-top flex justify-center shrink-0"
          style={{
            transform: `scale(min(1, calc((100vw - 32px) / 640)))`,
            marginBottom: `calc(-400px * (1 - min(1, calc((100vw - 32px) / 640))))`,
            width: '640px',
            minWidth: '640px'
          }}
        >
          {/* Certificate - Fixed 640x400 (8:5) - ALL INLINE STYLES for html2canvas */}
          <div
            ref={certificateRef}
            className="shrink-0"
            style={{
              position: 'relative',
              width: '640px',
              minWidth: '640px',
              height: '400px',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              overflow: 'hidden',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {/* Orange border frame */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                right: '12px',
                bottom: '12px',
                border: '2px solid #F26522',
                borderRadius: '8px',
                pointerEvents: 'none',
              }}
            />

            {/* Corner accents */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', width: '24px', height: '24px', borderTop: '3px solid #F26522', borderLeft: '3px solid #F26522' }} />
            <div style={{ position: 'absolute', top: '20px', right: '20px', width: '24px', height: '24px', borderTop: '3px solid #F26522', borderRight: '3px solid #F26522' }} />
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '24px', height: '24px', borderBottom: '3px solid #F26522', borderLeft: '3px solid #F26522' }} />
            <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '24px', height: '24px', borderBottom: '3px solid #F26522', borderRight: '3px solid #F26522' }} />

            {/* Content */}
            <div style={{
              position: 'relative',
              zIndex: 10,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              padding: '24px 48px',
            }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ color: '#F26522', fontWeight: 700, fontSize: '28px', letterSpacing: '-0.02em' }}>EXL</span>
                  <span style={{ color: '#D1D5DB' }}>|</span>
                  <span style={{ color: '#6B7280', fontSize: '14px' }}>AI Strategy Simulation</span>
                </div>
                <div style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: '#F26522',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  fontWeight: 600,
                }}>
                  {playerLevel || 'Participant'}
                </div>
              </div>

              {/* Main Content Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                {/* Avatar */}
                <div style={{ flexShrink: 0 }}>
                  {avatarUrl ? (
                    <div
                      style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        border: '3px solid #F26522',
                        overflow: 'hidden',
                      }}
                    >
                      <img src={avatarUrl} alt={playerName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(242, 101, 34, 0.15)',
                        border: '3px solid #F26522',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontSize: '28px', fontWeight: 700, color: '#F26522' }}>
                        {playerName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#9CA3AF', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>
                    This certifies that
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
                    {playerName}
                  </div>
                  <div style={{ color: '#6B7280', fontSize: '12px', lineHeight: 1.4 }}>
                    has successfully completed the AI Strategy Simulation Exercise
                    <br />
                    on {formatDate()}
                  </div>
                </div>
              </div>

              {/* Archetype Box */}
              <div
                style={{
                  backgroundColor: '#F9FAFB',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  border: '1px solid #E5E7EB',
                  marginBottom: '12px',
                }}
              >
                <div style={{ color: '#9CA3AF', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                  Leadership Archetype
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '26px' }}>{archetype.icon}</span>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: archetype.color }}>
                      {archetype.name}
                    </div>
                    <div style={{ color: '#6B7280', fontSize: '10px' }}>{archetype.subtitle}</div>
                  </div>
                </div>
              </div>

              {/* Scores Grid */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                {SCORE_METRICS.map((metric) => (
                  <div
                    key={metric.key}
                    style={{
                      flex: 1,
                      backgroundColor: '#F9FAFB',
                      borderRadius: '8px',
                      padding: '6px 4px',
                      border: '1px solid #E5E7EB',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ color: '#F26522', fontFamily: 'monospace', fontSize: '10px', fontWeight: 700 }}>
                      {metric.key}
                    </div>
                    <div style={{ color: '#111827', fontSize: '14px', fontWeight: 700 }}>
                      {scores[metric.key] > 0 ? '+' : ''}{scores[metric.key]}
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Badge */}
              <div style={{ textAlign: 'center', marginTop: 'auto' }}>
                {isWinner ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '20px',
                      padding: '6px 16px',
                    }}
                  >
                    <span style={{ color: '#16A34A', fontSize: '14px' }}>✓</span>
                    <span style={{ color: '#16A34A', fontWeight: 600, fontSize: '12px' }}>
                      Transformation Target Achieved
                    </span>
                  </span>
                ) : (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#F3F4F6',
                      border: '1px solid #E5E7EB',
                      borderRadius: '20px',
                      padding: '6px 16px',
                    }}
                  >
                    <span style={{ color: '#6B7280', fontSize: '12px' }}>
                      Strategy Simulation Completed
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <motion.button
            onClick={handleDownload}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-exl-orange text-white font-medium text-sm hover:bg-exl-orange/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </motion.button>

          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 text-white font-medium text-sm hover:bg-white/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </motion.button>

          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 rounded-xl text-white/50 font-medium text-sm hover:text-white/80 transition-colors"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
