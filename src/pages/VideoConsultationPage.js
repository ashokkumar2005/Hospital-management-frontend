import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { SERVER_URL } from '../services/api';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const VideoConsultationPage = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const socketRef = useRef(null);

  const [callStatus, setCallStatus] = useState('Connecting...');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteConnected, setRemoteConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const durationRef = useRef(null);

  const ICE_SERVERS = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  useEffect(() => {
    let stream;

    const init = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        // Connect socket
        socketRef.current = io(SERVER_URL);
        const socket = socketRef.current;

        // Join room
        socket.emit('join-room', { roomId, userId: user._id, role: user.role });
        setCallStatus('Waiting for other participant...');

        // Create peer connection
        const pc = new RTCPeerConnection(ICE_SERVERS);
        peerConnectionRef.current = pc;

        // Add local stream tracks
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        // Handle remote stream
        pc.ontrack = (event) => {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
          setRemoteConnected(true);
          setCallStatus('Connected');
          durationRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
        };

        // ICE candidates
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('ice-candidate', { roomId, candidate: event.candidate });
          }
        };

        // When another user joins, initiate offer
        socket.on('user-joined', async ({ socketId }) => {
          setCallStatus('Someone joined, establishing connection...');
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('offer', { roomId, offer, to: socketId });
        });

        // Receive offer
        socket.on('offer', async ({ offer, from }) => {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('answer', { roomId, answer, to: from });
        });

        // Receive answer
        socket.on('answer', async ({ answer }) => {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        });

        // ICE candidates from remote
        socket.on('ice-candidate', async ({ candidate }) => {
          try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch (e) { }
        });

        // Call ended
        socket.on('call-ended', () => {
          toast.info('Call ended by other participant');
          endCall();
        });

        socket.on('user-left', () => {
          setRemoteConnected(false);
          setCallStatus('Participant left');
        });

      } catch (err) {
        console.error(err);
        toast.error('Could not access camera/microphone');
        setCallStatus('Failed to access media');
      }
    };

    init();

    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
      if (peerConnectionRef.current) peerConnectionRef.current.close();
      if (socketRef.current) socketRef.current.disconnect();
      if (durationRef.current) clearInterval(durationRef.current);
    };
  }, [roomId]);

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(t => { t.enabled = isMuted; });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(t => { t.enabled = isVideoOff; });
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = () => {
    if (socketRef.current) socketRef.current.emit('end-call', { roomId });
    if (localStream) localStream.getTracks().forEach(t => t.stop());
    if (peerConnectionRef.current) peerConnectionRef.current.close();
    if (durationRef.current) clearInterval(durationRef.current);
    navigate('/appointments');
  };

  const formatDuration = (secs) => `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <style>{`
        .video-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; max-width: 1100px; margin-bottom: 24px; }
        .video-wrapper { background: #1e293b; border-radius: 16px; overflow: hidden; position: relative; aspect-ratio: 16/9; }
        .video-label { position: absolute; bottom: 12px; left: 12px; background: rgba(0,0,0,0.6); color: white; padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; }
        video { width: 100%; height: 100%; object-fit: cover; }
        .no-video { display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 3rem; height: 100%; }
        .controls { display: flex; gap: 16px; align-items: center; }
        .ctrl-btn { width: 56px; height: 56px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; transition: all 0.2s; }
        .ctrl-btn:hover { transform: scale(1.1); }
        .status-bar { background: rgba(30,41,59,0.9); backdrop-filter: blur(8px); border: 1px solid #334155; border-radius: 12px; padding: 12px 24px; color: white; text-align: center; margin-bottom: 20px; }
        @media (max-width: 768px) { .video-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* Status */}
      <div className="status-bar">
        <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Room: {roomId}</div>
        <div style={{ fontWeight: '600', color: remoteConnected ? '#10b981' : '#f59e0b' }}>
          {callStatus}
        </div>
        {remoteConnected && (
          <div style={{ fontSize: '0.85rem', color: '#60a5fa', marginTop: '4px' }}>
            ⏱ {formatDuration(callDuration)}
          </div>
        )}
      </div>

      {/* Video Grid */}
      <div className="video-grid">
        <div className="video-wrapper">
          {!isVideoOff ? (
            <video ref={localVideoRef} autoPlay muted playsInline />
          ) : (
            <div className="no-video">📷</div>
          )}
          <div className="video-label">You ({user.role})</div>
        </div>
        <div className="video-wrapper">
          <video ref={remoteVideoRef} autoPlay playsInline />
          {!remoteConnected && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '3rem' }}>👤</div>
              <div style={{ fontSize: '0.9rem' }}>Waiting for other participant...</div>
            </div>
          )}
          <div className="video-label">Remote</div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <button className="ctrl-btn" onClick={toggleMute} style={{ background: isMuted ? '#ef4444' : '#1e293b', color: 'white' }} title={isMuted ? 'Unmute' : 'Mute'}>
          {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>
        <button className="ctrl-btn" onClick={endCall} style={{ background: '#ef4444', color: 'white', width: '68px', height: '68px', fontSize: '1.5rem' }} title="End Call">
          <FaPhoneSlash />
        </button>
        <button className="ctrl-btn" onClick={toggleVideo} style={{ background: isVideoOff ? '#ef4444' : '#1e293b', color: 'white' }} title={isVideoOff ? 'Turn On Camera' : 'Turn Off Camera'}>
          {isVideoOff ? <FaVideoSlash /> : <FaVideo />}
        </button>
      </div>

      <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '16px', textAlign: 'center' }}>
        Powered by WebRTC — End-to-end encrypted video consultation
      </p>
    </div>
  );
};

export default VideoConsultationPage;
