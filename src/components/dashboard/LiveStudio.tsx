'use client';

import React from 'react';
import { useLiveStudio } from '@/features/live/hooks/useLiveStudio';
import { LiveFloatingReactions } from '@/features/live/components/LiveFloatingReactions';
import { LiveControlBar } from '@/features/live/components/LiveControlBar';
import { LiveSidePanel } from '@/features/live/components/LiveSidePanel';

interface LiveStudioProps {
    title: string;
    onClose: () => void;
}

/**
 * LiveStudio (Conteneur ultra-léger < 75 lignes)
 * Conforme aux principes SOLID & GoF.
 */
export const LiveStudio: React.FC<LiveStudioProps> = ({ title, onClose }) => {
    const {
        jitsiContainerRef, isMicMuted, isCamOff, isHandRaised, setIsHandRaised,
        showReactions, setShowReactions, showMoreOptions, setShowMoreOptions,
        floatingEmojis, activePanel, setActivePanel, isNoiseSuppressionEnabled, setIsNoiseSuppressionEnabled,
        currentTime, messages, chatInput, setChatInput, showParticipantMenu, setShowParticipantMenu,
        messagesEndRef, triggerReaction, executeCommand, handleSendMessage, toggleFullScreen
    } = useLiveStudio(title, onClose);

    return (
        <div className="fixed inset-0 z-[200] bg-[#202124] flex flex-col font-sans overflow-hidden">
            <div className="absolute top-6 left-6 z-10">
                <div className="px-4 py-2 bg-black/20 backdrop-blur-md rounded-lg border border-white/5 flex items-center gap-3">
                    <span className="text-white/80 font-medium text-sm">{title}</span>
                    <div className="w-px h-4 bg-white/10" />
                    <span className="text-white/40 text-xs font-mono">abc-defg-hij</span>
                </div>
            </div>

            <LiveFloatingReactions floatingEmojis={floatingEmojis} />

            <div className="absolute top-0 left-0 right-0 bottom-28 flex overflow-hidden">
                <div className={`flex-1 relative duration-500 ${activePanel ? 'mr-96' : ''}`}
                    onClick={() => { setShowReactions(false); setShowMoreOptions(false); }}>
                    <div ref={jitsiContainerRef} className="absolute inset-0" />
                    {isCamOff && (
                        <div className="absolute inset-0 bg-[#202124] flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-[#1B6B3A] text-white flex items-center justify-center text-3xl font-bold">E</div>
                        </div>
                    )}
                </div>

                <LiveSidePanel
                    title={title}
                    activePanel={activePanel}
                    messages={messages}
                    chatInput={chatInput}
                    isMicMuted={isMicMuted}
                    isHandRaised={isHandRaised}
                    isNoiseSuppressionEnabled={isNoiseSuppressionEnabled}
                    showParticipantMenu={showParticipantMenu}
                    messagesEndRef={messagesEndRef}
                    onClosePanel={() => setActivePanel(null)}
                    onSetChatInput={setChatInput}
                    onSendMessage={handleSendMessage}
                    onExecuteCommand={executeCommand}
                    onToggleHandRaised={() => { setIsHandRaised(!isHandRaised); executeCommand('toggleRaiseHand'); }}
                    onToggleNoiseSuppression={() => setIsNoiseSuppressionEnabled(!isNoiseSuppressionEnabled)}
                    onToggleParticipantMenu={() => setShowParticipantMenu(!showParticipantMenu)}
                    onSetActivePanel={setActivePanel}
                />
            </div>

            <LiveControlBar
                currentTime={currentTime}
                isMicMuted={isMicMuted}
                isCamOff={isCamOff}
                isHandRaised={isHandRaised}
                showReactions={showReactions}
                showMoreOptions={showMoreOptions}
                isNoiseSuppressionEnabled={isNoiseSuppressionEnabled}
                activePanel={activePanel}
                onExecuteCommand={executeCommand}
                onToggleHandRaised={() => { setIsHandRaised(!isHandRaised); executeCommand('toggleRaiseHand'); }}
                onToggleReactions={() => setShowReactions(!showReactions)}
                onTriggerReaction={triggerReaction}
                onToggleMoreOptions={() => setShowMoreOptions(!showMoreOptions)}
                onToggleFullScreen={toggleFullScreen}
                onToggleNoiseSuppression={() => setIsNoiseSuppressionEnabled(!isNoiseSuppressionEnabled)}
                onSetActivePanel={setActivePanel}
                onClose={onClose}
            />
        </div>
    );
};

declare global {
    interface Window {
        JitsiMeetExternalAPI: any;
    }
}
