'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '@/utils/api';

const ICE_SERVERS: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
];

export type CallType = 'audio' | 'video';
export type CallState = 'idle' | 'outgoing' | 'incoming' | 'connecting' | 'connected';

export type IncomingCall = {
    callId: string;
    fromUserId: string;
    callerName: string;
    callType: CallType;
};

export function useWebRTCCall(currentUserId: string, currentUserName: string) {
    const [callState, setCallState] = useState<CallState>('idle');
    const [callType, setCallType] = useState<CallType>('audio');
    const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
    const [peerName, setPeerName] = useState('');
    const [peerUserId, setPeerUserId] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const socketRef = useRef<Socket | null>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const callIdRef = useRef<string | null>(null);
    const isCallerRef = useRef(false);
    const pendingCallTypeRef = useRef<CallType>('audio');
    const callStateRef = useRef<CallState>('idle');
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        callStateRef.current = callState;
    }, [callState]);

    const attachStreamToVideo = (video: HTMLVideoElement | null, stream: MediaStream | null) => {
        if (video) video.srcObject = stream;
    };

    const cleanupCall = useCallback(() => {
        localStreamRef.current?.getTracks().forEach(t => t.stop());
        localStreamRef.current = null;
        pcRef.current?.close();
        pcRef.current = null;
        attachStreamToVideo(localVideoRef.current, null);
        attachStreamToVideo(remoteVideoRef.current, null);
        callIdRef.current = null;
        isCallerRef.current = false;
        setIncomingCall(null);
        setCallState('idle');
        setPeerUserId(null);
        setPeerName('');
        setIsMuted(false);
        setIsVideoOn(true);
    }, []);

    const getToken = () => localStorage.getItem('token') || '';

    const connectSocket = useCallback(() => {
        if (socketRef.current?.connected) return socketRef.current;

        const socket = io(BASE_URL, {
            auth: { token: getToken() },
            transports: ['websocket', 'polling'],
        });
        socketRef.current = socket;
        return socket;
    }, []);

    const getLocalStream = async (type: CallType) => {
        const constraints: MediaStreamConstraints = type === 'video'
            ? { video: true, audio: true }
            : { video: false, audio: true };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        localStreamRef.current = stream;
        attachStreamToVideo(localVideoRef.current, stream);
        return stream;
    };

    const createPeerConnection = (remoteUserId: string) => {
        const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

        pc.onicecandidate = (event) => {
            if (event.candidate && callIdRef.current) {
                socketRef.current?.emit('call:ice-candidate', {
                    toUserId: remoteUserId,
                    callId: callIdRef.current,
                    candidate: event.candidate,
                });
            }
        };

        pc.ontrack = (event) => {
            const remoteStream = event.streams[0];
            attachStreamToVideo(remoteVideoRef.current, remoteStream);
        };

        pc.onconnectionstatechange = () => {
            if (pc.connectionState === 'connected') {
                setCallState('connected');
            }
            if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
                cleanupCall();
            }
        };

        localStreamRef.current?.getTracks().forEach(track => {
            if (localStreamRef.current) {
                pc.addTrack(track, localStreamRef.current);
            }
        });

        pcRef.current = pc;
        return pc;
    };

    const createOffer = async (toUserId: string) => {
        createPeerConnection(toUserId);
        const pc = pcRef.current!;
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketRef.current?.emit('call:offer', {
            toUserId,
            callId: callIdRef.current,
            offer,
        });
    };

    const handleOffer = async (fromUserId: string, offer: RTCSessionDescriptionInit, callId: string) => {
        callIdRef.current = callId;
        setPeerUserId(fromUserId);

        if (!localStreamRef.current) {
            await getLocalStream(pendingCallTypeRef.current);
        }

        createPeerConnection(fromUserId);
        const pc = pcRef.current!;
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socketRef.current?.emit('call:answer', {
            toUserId: fromUserId,
            callId,
            answer,
        });
        setCallState('connecting');
    };

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

        socket.on('call:accepted', async ({ callId, fromUserId }: { callId: string; fromUserId: string }) => {
            if (callIdRef.current !== callId) return;
            setCallState('connecting');
            await createOffer(fromUserId);
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

        socket.on('call:offer', async ({ callId, fromUserId, offer }: { callId: string; fromUserId: string; offer: RTCSessionDescriptionInit }) => {
            await handleOffer(fromUserId, offer, callId);
        });

        socket.on('call:answer', async ({ callId, answer }: { callId: string; answer: RTCSessionDescriptionInit }) => {
            if (callIdRef.current !== callId || !pcRef.current) return;
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.on('call:ice-candidate', async ({ callId, candidate }: { callId: string; candidate: RTCIceCandidateInit }) => {
            if (callIdRef.current !== callId || !pcRef.current || !candidate) return;
            try {
                await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
                console.error('ICE candidate error', err);
            }
        });

        return () => {
            socket.off('call:incoming');
            socket.off('call:unavailable');
            socket.off('call:accepted');
            socket.off('call:rejected');
            socket.off('call:ended');
            socket.off('call:offer');
            socket.off('call:answer');
            socket.off('call:ice-candidate');
        };
    }, [cleanupCall, connectSocket]);

    useEffect(() => {
        connectSocket();
        return () => {
            socketRef.current?.disconnect();
            socketRef.current = null;
        };
    }, [connectSocket, currentUserId]);

    useEffect(() => {
        if (localStreamRef.current && localVideoRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
        }
    }, [callState, callType]);

    const startCall = async (toUserId: string, name: string, type: CallType) => {
        if (callStateRef.current !== 'idle') return;

        const callId = crypto.randomUUID();
        callIdRef.current = callId;
        isCallerRef.current = true;
        pendingCallTypeRef.current = type;
        setPeerUserId(toUserId);
        setPeerName(name);
        setCallType(type);
        setCallState('outgoing');
        setError(null);

        try {
            await getLocalStream(type);
            const socket = connectSocket();
            socket.emit('call:initiate', {
                toUserId,
                callType: type,
                callId,
                callerName: currentUserName,
            });
        } catch (err) {
            console.error(err);
            setError('Microphone ou caméra inaccessible');
            cleanupCall();
            throw err;
        }
    };

    const acceptCall = async () => {
        if (!incomingCall) return;

        const { callId, fromUserId, callType: type, callerName } = incomingCall;
        callIdRef.current = callId;
        isCallerRef.current = false;
        pendingCallTypeRef.current = type;
        setPeerUserId(fromUserId);
        setPeerName(callerName);
        setCallType(type);
        setIncomingCall(null);
        setCallState('connecting');
        setError(null);

        try {
            await getLocalStream(type);
            socketRef.current?.emit('call:accept', { callId, toUserId: fromUserId });
        } catch (err) {
            console.error(err);
            setError('Microphone ou caméra inaccessible');
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
            localStreamRef.current?.getAudioTracks().forEach(track => {
                track.enabled = !next;
            });
            return next;
        });
    };

    const toggleVideo = async () => {
        if (callType === 'audio') {
            setCallType('video');
            setIsVideoOn(true);
            pendingCallTypeRef.current = 'video';
            try {
                const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
                const videoTrack = videoStream.getVideoTracks()[0];
                localStreamRef.current?.addTrack(videoTrack);
                if (pcRef.current && localStreamRef.current) {
                    pcRef.current.addTrack(videoTrack, localStreamRef.current);
                }
                attachStreamToVideo(localVideoRef.current, localStreamRef.current);
            } catch {
                setError('Impossible d\'activer la caméra');
            }
            return;
        }

        setIsVideoOn(prev => {
            const next = !prev;
            localStreamRef.current?.getVideoTracks().forEach(track => {
                track.enabled = next;
            });
            return next;
        });
    };

    const callStatusText = (() => {
        switch (callState) {
            case 'outgoing': return 'Appel en cours...';
            case 'incoming': return 'Appel entrant...';
            case 'connecting': return 'Connexion...';
            case 'connected': return callType === 'audio' ? 'Appel vocal en cours' : 'Appel vidéo en cours';
            default: return '';
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
};
