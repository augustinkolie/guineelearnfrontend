'use client';

import React, { createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Video, User } from 'lucide-react';
import { useTwilioCall } from '@/hooks/useTwilioCall';

type CallContextValue = ReturnType<typeof useTwilioCall>;

const CallContext = createContext<CallContextValue | null>(null);

export function CallProvider({
    userId,
    userName,
    children,
}: {
    userId: string;
    userName: string;
    children: React.ReactNode;
}) {
    const router = useRouter();
    const call = useTwilioCall(userId, userName);

    const handleAccept = async () => {
        await call.acceptCall();
        router.push('/dashboard/messages');
    };

    return (
        <CallContext.Provider value={call}>
            {children}
            {call.callState === 'incoming' && call.incomingCall && (
                <div className="fixed inset-0 z-[200] bg-[#111B21]/95 flex flex-col items-center justify-center gap-8">
                    <div className="w-28 h-28 rounded-full bg-[#2A3942] flex items-center justify-center">
                        {call.incomingCall.callType === 'video' ? (
                            <Video className="w-12 h-12 text-[#00A884]" />
                        ) : (
                            <Phone className="w-12 h-12 text-[#00A884]" />
                        )}
                    </div>
                    <div className="text-center px-6">
                        <div className="w-16 h-16 rounded-full bg-[#1B6B3A]/20 flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-[#00A884]" />
                        </div>
                        <h2 className="text-white text-2xl font-semibold mb-2">{call.incomingCall.callerName}</h2>
                        <p className="text-[#8696A0]">
                            {call.incomingCall.callType === 'video' ? 'Appel vidéo entrant' : 'Appel vocal entrant'}
                        </p>
                    </div>
                    <div className="flex items-center gap-10">
                        <button
                            onClick={call.rejectCall}
                            className="w-16 h-16 rounded-full bg-[#ea3943] flex items-center justify-center hover:bg-[#d43440]"
                            aria-label="Refuser"
                        >
                            <Phone className="w-7 h-7 text-white rotate-[135deg]" />
                        </button>
                        <button
                            onClick={handleAccept}
                            className="w-16 h-16 rounded-full bg-[#00A884] flex items-center justify-center hover:bg-[#008F71]"
                            aria-label="Accepter"
                        >
                            <Phone className="w-7 h-7 text-white" />
                        </button>
                    </div>
                </div>
            )}
        </CallContext.Provider>
    );
}

export function useCall() {
    const ctx = useContext(CallContext);
    if (!ctx) {
        throw new Error('useCall must be used within CallProvider');
    }
    return ctx;
}
