import React from 'react';

export interface AvatarProps {
    name: string;
    src?: string;
    size?: 'sm' | 'md' | 'lg';
    status?: 'online' | 'offline' | 'busy' | 'away';
}

const sizeMap = { sm: 28, md: 36, lg: 48 };
const fontMap = { sm: '0.65rem', md: '0.8rem', lg: '1rem' };
const statusColors = { online: '#10b981', offline: '#6b7280', busy: '#ef4444', away: '#f59e0b' };

function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function hashColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];
    return colors[Math.abs(hash) % colors.length];
}

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md', status }) => {
    const dim = sizeMap[size];
    return (
        <div style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
            {src ? (
                <img src={src} alt={name} style={{
                    width: dim, height: dim, borderRadius: '50%', objectFit: 'cover',
                    border: '2px solid rgba(255,255,255,0.06)',
                }} />
            ) : (
                <div style={{
                    width: dim, height: dim, borderRadius: '50%',
                    background: hashColor(name), display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: fontMap[size], fontWeight: 700, color: 'white', letterSpacing: '0.02em',
                    border: '2px solid rgba(255,255,255,0.06)',
                }}>
                    {getInitials(name)}
                </div>
            )}
            {status && (
                <span style={{
                    position: 'absolute', bottom: -1, right: -1,
                    width: dim * 0.3, height: dim * 0.3, borderRadius: '50%',
                    backgroundColor: statusColors[status],
                    border: '2px solid #09090b',
                }} />
            )}
        </div>
    );
};
