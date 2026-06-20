import React from 'react';

/* ─── Base Skeleton ────────────────────────────────────────────── */
interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '16px',
  borderRadius = '8px',
  className = '',
}) => (
  <div
    className={`skeleton-shimmer ${className}`}
    style={{ width, height, borderRadius }}
  />
);

/* ─── Skeleton Text (multiple lines) ───────────────────────────── */
interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2.5 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        width={i === lines - 1 ? '60%' : '100%'}
        height="12px"
        borderRadius="6px"
      />
    ))}
  </div>
);

/* ─── Skeleton Avatar ──────────────────────────────────────────── */
export const SkeletonAvatar: React.FC<{ size?: string }> = ({ size = '40px' }) => (
  <Skeleton width={size} height={size} borderRadius="50%" />
);

/* ─── Skeleton Card ────────────────────────────────────────────── */
interface SkeletonCardProps {
  className?: string;
  lines?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '', lines = 3 }) => (
  <div className={`glass-card rounded-2xl p-5 space-y-4 ${className}`}>
    <div className="flex items-center gap-3">
      <Skeleton width="44px" height="44px" borderRadius="12px" />
      <div className="flex-1 space-y-2">
        <Skeleton width="40%" height="10px" borderRadius="5px" />
        <Skeleton width="70%" height="14px" borderRadius="7px" />
      </div>
    </div>
    <SkeletonText lines={lines} />
  </div>
);

/* ─── Skeleton Stat Card ───────────────────────────────────────── */
export const SkeletonStatCard: React.FC = () => (
  <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
    <Skeleton width="48px" height="48px" borderRadius="12px" />
    <div className="flex-1 space-y-2">
      <Skeleton width="60%" height="9px" borderRadius="5px" />
      <Skeleton width="40%" height="22px" borderRadius="8px" />
    </div>
  </div>
);

/* ─── Skeleton Chart ───────────────────────────────────────────── */
export const SkeletonChart: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`glass-card rounded-2xl p-5 space-y-4 ${className}`}>
    <div className="space-y-1.5">
      <Skeleton width="50%" height="14px" borderRadius="7px" />
      <Skeleton width="75%" height="10px" borderRadius="5px" />
    </div>
    <div className="flex items-end gap-3 pt-4" style={{ height: '160px' }}>
      {[55, 80, 65, 90, 40, 70, 85].map((h, i) => (
        <Skeleton
          key={i}
          width="100%"
          height={`${h}%`}
          borderRadius="6px 6px 0 0"
        />
      ))}
    </div>
  </div>
);

/* ─── Full Dashboard Skeleton ──────────────────────────────────── */
interface SkeletonDashboardProps {
  variant?: 'student' | 'teacher';
}

export const SkeletonDashboard: React.FC<SkeletonDashboardProps> = ({ variant = 'student' }) => (
  <div className="space-y-6 animate-fade-in">
    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
      <div className="space-y-2">
        <Skeleton width="280px" height="24px" borderRadius="8px" />
        <Skeleton width="200px" height="14px" borderRadius="6px" />
      </div>
      <div className="flex gap-2">
        <Skeleton width="140px" height="36px" borderRadius="12px" />
        <Skeleton width="140px" height="36px" borderRadius="12px" />
      </div>
    </div>

    {/* Tab nav */}
    <Skeleton width="400px" height="44px" borderRadius="16px" />

    {/* Stat cards row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <SkeletonStatCard />
      <SkeletonStatCard />
      <SkeletonStatCard />
      <SkeletonStatCard />
    </div>

    {/* Content area */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Skeleton width="180px" height="18px" borderRadius="8px" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard lines={2} />
          <SkeletonCard lines={2} />
          {variant === 'student' && (
            <>
              <SkeletonCard lines={2} />
              <SkeletonCard lines={2} />
            </>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton width="140px" height="18px" borderRadius="8px" />
        <SkeletonCard lines={4} />
      </div>
    </div>
  </div>
);
