'use client';
import React, { useState } from 'react';

export interface TabItem {
    id: string;
    label: string;
    icon?: string;
    content?: React.ReactNode;
}

export interface TabsProps {
    items: TabItem[];
    defaultTab?: string;
    onChange?: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ items, defaultTab, onChange }) => {
    const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id || '');
    const activeItem = items.find(i => i.id === activeTab);

    const handleClick = (id: string) => {
        setActiveTab(id);
        onChange?.(id);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div style={{
                display: 'flex', gap: 2, borderBottom: '1px solid rgba(255,255,255,0.06)',
                paddingBottom: 0,
            }}>
                {items.map(item => (
                    <button
                        key={item.id}
                        onClick={() => handleClick(item.id)}
                        style={{
                            padding: '10px 18px', border: 'none', background: 'none',
                            fontSize: '0.82rem', fontWeight: activeTab === item.id ? 600 : 500,
                            color: activeTab === item.id ? '#10b981' : '#8b99a6',
                            borderBottom: `2px solid ${activeTab === item.id ? '#10b981' : 'transparent'}`,
                            cursor: 'pointer', transition: 'all 150ms ease',
                            display: 'flex', alignItems: 'center', gap: 6,
                            marginBottom: -1,
                        }}
                    >
                        {item.icon && <span>{item.icon}</span>}
                        {item.label}
                    </button>
                ))}
            </div>
            {activeItem?.content && (
                <div style={{ padding: '16px 0' }}>{activeItem.content}</div>
            )}
        </div>
    );
};
