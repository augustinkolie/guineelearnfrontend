'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '@/utils/api';

// Types Twilio importés statiquement pour TypeScript uniquement (pas d'exécution SSR)
import type {
    Room,
    LocalTrack,
    LocalAudioTrack,
    LocalVideoTrack,
    RemoteParticipant,
    RemoteTrack,
    RemoteVideoTrack,
    RemoteAudioTrack,
    ConnectOptions,
} from 'twilio-video';

export type CallType = 'audio' | 'video';
export type CallState = 'idle' | 'outgoing' | 'incoming' | 'connecting' | 'connected';

export type IncomingCall = {
    callId: string;
    fromUserId: string;
    callerName: string;
    callType: CallType;
};

const getToken = () => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('token') || '';
};

const getApiBase = () => BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

/**
 * Nom de room déterministe pour une paire d'utilisateurs + callId.
 * Les deux participants construisent le même roomName indépendamment.
 */
const buildRoomName = (userA: string, userB: string, callId: string): string => {
    const sorted = [userA, userB].sort().join('_');
    // Twilio limite à 121 caractères; on tronque le callId si nécessaire
    return `${sorted}_${callId}`.slice(0, 120);
};

export function useTwilioCall(currentUserId: string, currentUserName: string) {
    const [callState, setCallState] = useState<CallState>('idle');
    const [callType, setCallType] = useState<CallType>('audio');
    const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
    const [peerName, setPeerName] = useState('');
    const [peerUserId, setPeerUserId] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const socketRef = useRef<Socket | null>(null);
    const roomRef = useRef<Room | null>(null);
    const callIdRef = useRef<string | null>(null);
    const callStateRef = useRef<CallState>('idle');
    const pendingCallTypeRef = useRef<CallType>('audio');
    const localTracksRef = useRef<LocalTrack[]>([]);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        callStateRef.current = callState;
    }, [callState]);

    // ─── Nettoyage ─────────────────────────────────────────────────────────────

    const cleanupCall = useCallback(() => {
        localTracksRef.current.forEach(track => {
            (track as LocalAudioTrack | LocalVideoTrack).stop?.();
        });
        localTracksRef.current = [];

        if (roomRef.current) {
            roomRef.current.disconnect();
            roomRef.current = null;
        }

        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

        // Supprimer les éléments audio distants injectés dans le DOM
        document.querySelectorAll('audio[data-twilio-remote]').forEach(el => el.remove());

        callIdRef.current = null;
        setIncomingCall(null);
        setCallState('idle');
        setPeerUserId(null);
        setPeerName('');
        setIsMuted(false);
        setIsVideoOn(true);
    }, []);

    // ─── Socket ─────────────────────────────────────────────────────────────────

    const connectSocket = useCallback(() => {
        if (socketRef.current?.connected) return socketRef.current;
        const socket = io(BASE_URL, {
            auth: { token: getToken() },
            transports: ['websocket', 'polling'],
        });
        socketRef.current = socket;
        return socket;
    }, []);

    // ─── Helpers pour attacher les tracks distants ──────────────────────────────

    const attachRemoteTrack = useCallback((track: RemoteTrack) => {
        if (track.kind === 'video') {
            const videoTrack = track as RemoteVideoTrack;
            // Remplacer le contenu de l'élément video existant
            if (remoteVideoRef.current) {
                const el = videoTrack.attach();
                el.style.width = '100%';
                el.style.height = '100%';
                el.style.objectFit = 'cover';
                // On vide et on y insère le nouvel élément
                remoteVideoRef.current.replaceWith(el);
            }
        } else if (track.kind === 'audio') {
            const audioTrack = track as RemoteAudioTrack;
            const el = audioTrack.attach() as HTMLAudioElement;
            el.setAttribute('data-twilio-remote', 'true');
            document.body.appendChild(el);
        }
    }, []);

    const attachRemoteParticipant = useCallback((participant: RemoteParticipant) => {
        // Tracks déjà abonnés
        participant.tracks.forEach(publication => {
            if (publication.isSubscribed && publication.track) {
                attachRemoteTrack(publication.track as RemoteTrack);
            }
        });

        participant.on('trackSubscribed', (track) => {
            attachRemoteTrack(track as RemoteTrack);
        });

        participant.on('trackUnsubscribed', (track) => {
            (track as RemoteVideoTrack | RemoteAudioTrack).detach().forEach(el => el.remove());
        });
    }, [attachRemoteTrack]);

    // ─── Rejoindre une room Twilio Video ────────────────────────────────────────

    const joinTwilioRoom = useCallback(async (roomName: string, type: CallType) => {
        // Import dynamique pour éviter les erreurs SSR
        const TwilioVideo = await import('twilio-video');

        // Récupérer le token depuis le backend
        const res = await fetch(`${getApiBase()}/api/calls/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ roomName }),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Impossible d\'obtenir le token Twilio');
        }

        const { token } = await res.json();

        const connectOptions: ConnectOptions = {
            name: roomName,
            audio: true,
            video: type === 'video' ? { width: 640, height: 480, frameRate: 24 } : false,
        };

        const room = await TwilioVideo.connect(token, connectOptions);
        roomRef.current = room;

        // ── Tracks locaux ──
        room.localParticipant.videoTracks.forEach(publication => {
            localTracksRef.current.push(publication.track);
            if (localVideoRef.current) {
                const el = publication.track.attach();
                el.style.width = '100%';
                el.style.height = '100%';
                el.style.objectFit = 'cover';
                localVideoRef.current.replaceWith(el);
            }
        });

        room.localParticipant.audioTracks.forEach(publication => {
            localTracksRef.current.push(publication.track);
        });

        // ── Participants distants déjà présents ──
        room.participants.forEach(participant => attachRemoteParticipant(participant));

        // ── Nouveaux participants ──
        room.on('participantConnected', participant => {
            attachRemoteParticipant(participant);
            setCallState('connected');
        });

        room.on('participantDisconnected', () => {
            cleanupCall();
        });

        room.on('disconnected', (_room, err) => {
            if (err) console.error('Twilio room disconnected with error:', err);
            cleanupCall();
        });

        setCallState('connected');
        return room;
    }, [attachRemoteParticipant, cleanupCall]);

    // ─── Listeners Socket (signalisation) ───────────────────────────────────────

    useEffect(() => {
        const socket = connectSocket();

        socket.on('call:incoming', (data: IncomingCall) => {
            if (callStateRef.current !== 'idle') {
                socket.emit('call:reject', { callId: data.callId, toUserId: data.fromUserId });
                return;
            }
            pendingCallTypeRef.current = data.callType;
            setIncomingCall(data);
            setPeerName(data.callerName);
            setPeerUserId(data.fromUserId);
            setCallType(data.callType);
            setCallState('incoming');
        });

        socket.on('call:unavailable', () => {
            setError('Contact hors ligne ou indisponible');
            cleanupCall();
        });

        // L'appelé a accepté → l'appelant rejoint la room Twilio
        socket.on('call:accepted', async ({ callId, fromUserId }: { callId: string; fromUserId: string }) => {
            if (callIdRef.current !== callId) return;
            setCallState('connecting');
            try {
                const roomName = buildRoomName(currentUserId, fromUserId, callId);
                await joinTwilioRoom(roomName, pendingCallTypeRef.current);
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : 'Erreur lors de la connexion à l\'appel';
                setError(msg);
                cleanupCall();
            }
        });

        socket.on('call:rejected', ({ callId }: { callId: string }) => {
            if (callIdRef.current === callId) {
                setError('Appel refusé');
                cleanupCall();
            }
        });

        socket.on('call:ended', ({ callId }: { callId: string }) => {
            if (callIdRef.current === callId || callStateRef.current !== 'idle') {
                cleanupCall();
            }
        });

        return () => {
            socket.off('call:incoming');
            socket.off('call:unavailable');
            socket.off('call:accepted');
            socket.off('call:rejected');
            socket.off('call:ended');
        };
    }, [cleanupCall, connectSocket, currentUserId, joinTwilioRoom]);

    useEffect(() => {
        connectSocket();
        return () => {
            socketRef.current?.disconnect();
            socketRef.current = null;
        };
    }, [connectSocket, currentUserId]);

    // ─── Actions publiques ──────────────────────────────────────────────────────

    const startCall = async (toUserId: string, name: string, type: CallType) => {
        if (callStateRef.current !== 'idle') return;

        const callId = crypto.randomUUID();
        callIdRef.current = callId;
        pendingCallTypeRef.current = type;
        setPeerUserId(toUserId);
        setPeerName(name);
        setCallType(type);
        setCallState('outgoing');
        setError(null);

        const socket = connectSocket();
        socket.emit('call:initiate', {
            toUserId,
            callType: type,
            callId,
            callerName: currentUserName,
        });
    };

    const acceptCall = async () => {
        if (!incomingCall) return;

        const { callId, fromUserId, callType: type, callerName } = incomingCall;
        callIdRef.current = callId;
        pendingCallTypeRef.current = type;
        setPeerUserId(fromUserId);
        setPeerName(callerName);
        setCallType(type);
        setIncomingCall(null);
        setCallState('connecting');
        setError(null);

        try {
            const roomName = buildRoomName(currentUserId, fromUserId, callId);
            // Notifier l'appelant
            socketRef.current?.emit('call:accept', { callId, toUserId: fromUserId });
            // Rejoindre la room Twilio
            await joinTwilioRoom(roomName, type);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Microphone ou caméra inaccessible';
            setError(msg);
            socketRef.current?.emit('call:reject', { callId, toUserId: fromUserId });
            cleanupCall();
        }
    };

    const rejectCall = () => {
        if (incomingCall) {
            socketRef.current?.emit('call:reject', {
                callId: incomingCall.callId,
                toUserId: incomingCall.fromUserId,
            });
        }
        cleanupCall();
    };

    const endCall = () => {
        if (peerUserId && callIdRef.current) {
            socketRef.current?.emit('call:end', {
                toUserId: peerUserId,
                callId: callIdRef.current,
            });
        }
        cleanupCall();
    };

    const toggleMute = () => {
        setIsMuted(prev => {
            const next = !prev;
            roomRef.current?.localParticipant.audioTracks.forEach(pub => {
                if (next) pub.track.disable();
                else pub.track.enable();
            });
            return next;
        });
    };

    const toggleVideo = () => {
        if (!roomRef.current) return;
        setIsVideoOn(prev => {
            const next = !prev;
            roomRef.current?.localParticipant.videoTracks.forEach(pub => {
                if (next) pub.track.enable();
                else pub.track.disable();
            });
            return next;
        });
    };

    const callStatusText = (() => {
        switch (callState) {
            case 'outgoing':   return 'Appel en cours...';
            case 'incoming':   return 'Appel entrant...';
            case 'connecting': return 'Connexion...';
            case 'connected':  return callType === 'audio' ? 'Appel vocal en cours' : 'Appel vidéo en cours';
            default:           return '';
        }
    })();

    const isInCall = callState === 'outgoing' || callState === 'connecting' || callState === 'connected';

    return {
        callState,
        callType,
        incomingCall,
        peerName,
        isInCall,
        isMuted,
        isVideoOn,
        error,
        callStatusText,
        localVideoRef,
        remoteVideoRef,
        startCall,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleVideo,
        clearError: () => setError(null),
    };
}
