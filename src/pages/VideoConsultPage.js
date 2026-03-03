import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { SERVER_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';

const VideoConsultPage = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const socketRef = useRef(null);
  const [status, setStatus] = useState('Connecting...');
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [callStarted, setCallStarted] = useState(false);

  const ICE_SERVERS = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }] };

  useEffect(() => {
    const socket = io(SERVER_URL);
    socketRef.current = socket;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      socket.emit('join-room', { roomId, userId: user?._id, role: user?.role });
      setStatus('Waiting for the other participant...');
    }).catch(() => {
      setStatus('Camera/mic access denied. Please allow access.');
    });

    socket.on('user-joined', async ({ socketId }) => {
      setRemoteSocketId(socketId);
      setStatus('Participant joined. Starting call...');
      await startCall(socketId);
    });

    socket.on('offer', async ({ offer, from }) => {
      setRemoteSocketId(from);
      const pc = createPeerConnection(from);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', { answer, to: from });
      setCallStarted(true);
      setStatus('Call in progress');
    });

    socket.on('answer', async ({ answer }) => {
      if (pcRef.current) {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        setCallStarted(true);
        setStatus('Call in progress');
      }
    });

    socket.on('ice-candidate', async ({ candidate }) => {
      if (pcRef.current && candidate) {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
      }
    });

    socket.on('call-ended', () => { setStatus('Call ended'); endCall(false); });

    return () => {
      socket.disconnect();
      localStream?.getTracks().forEach(t => t.stop());
      if (pcRef.current) pcRef.current.close();
    };
  }, [roomId]);

  const createPeerConnection = (remoteId) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;
    if (localStream) localStream.getTracks().forEach(t => pc.addTrack(t, localStream));
    pc.ontrack = (e) => { if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0]; };
    pc.onicecandidate = (e) => {
      if (e.candidate) socketRef.current.emit('ice-candidate', { candidate: e.candidate, to: remoteId });
    };
    return pc;
  };

  const startCall = async (remoteId) => {
    const pc = createPeerConnection(remoteId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socketRef.current.emit('offer', { offer, to: remoteId, roomId });
  };

  const endCall = (emit = true) => {
    if (emit) socketRef.current?.emit('end-call', { roomId });
    localStream?.getTracks().forEach(t => t.stop());
    if (pcRef.current) { pcRef.current.close(); pcRef.current = null; }
    navigate('/appointments');
  };

  const toggleMute = () => {
    localStream?.getAudioTracks().forEach(t => (t.enabled = muted));
    setMuted(!muted);
  };

  const toggleVideo = () => {
    localStream?.getVideoTracks().forEach(t => (t.enabled = videoOff));
    setVideoOff(!videoOff);
  };

  return (
    <div style={{ minHeight: '90vh', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h2 style={{ color: '#fff', marginBottom: '0.3rem' }}>📹 Video Consultation</h2>
        <p style={{ color: callStarted ? '#10b981' : '#f59e0b', fontWeight: 600 }}>● {status}</p>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Room: {roomId}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%', maxWidth: '900px' }}>
        <div style={{ position: 'relative' }}>
          <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '100%', borderRadius: '12px', background: '#1e293b', minHeight: '250px' }} />
          <span style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '0.3rem 0.7rem', borderRadius: '20px', fontSize: '0.82rem' }}>You {muted ? '🔇' : ''}{videoOff ? '📷' : ''}</span>
        </div>
        <div style={{ position: 'relative' }}>
          <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '12px', background: '#1e293b', minHeight: '250px' }} />
          <span style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '0.3rem 0.7rem', borderRadius: '20px', fontSize: '0.82rem' }}>
            {callStarted ? 'Remote' : 'Waiting...'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button onClick={toggleMute} style={{ width: '56px', height: '56px', borderRadius: '50%', background: muted ? '#ef4444' : '#334155', color: '#fff', fontSize: '1.4rem', border: 'none', cursor: 'pointer' }}>
          {muted ? '🔇' : '🎙️'}
        </button>
        <button onClick={toggleVideo} style={{ width: '56px', height: '56px', borderRadius: '50%', background: videoOff ? '#ef4444' : '#334155', color: '#fff', fontSize: '1.4rem', border: 'none', cursor: 'pointer' }}>
          {videoOff ? '📷' : '📹'}
        </button>
        <button onClick={() => endCall()} style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ef4444', color: '#fff', fontSize: '1.4rem', border: 'none', cursor: 'pointer' }}>📵</button>
      </div>
    </div>
  );
};

export default VideoConsultPage;
