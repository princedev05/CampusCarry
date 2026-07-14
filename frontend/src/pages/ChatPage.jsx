import { useEffect, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { chatApi } from "../api";
import { useLocation } from "react-router-dom";

const socketUrl = import.meta.env.VITE_API_URL?.replace(/\/api\/v1$/, "") || "http://localhost:7900";

export default function ChatPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [activeRecipient, setActiveRecipient] = useState(null);
  const [peers, setPeers] = useState([]);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  useEffect(() => {
    const loadPeers = async () => {
      if (!user) return;
      try {
        const response = await chatApi.getPeers();
        const peerList = Array.isArray(response) ? response : [];
        setPeers(peerList);

        const otherUserId = queryParams.get("with");
        if (otherUserId) {
          const chosenPeer = peerList.find((peer) => peer._id === otherUserId);
          setActiveRecipient(chosenPeer ? { id: chosenPeer._id, role: chosenPeer.role, name: chosenPeer.fullName || chosenPeer.username } : null);
          return;
        }

        if (peerList[0]) {
          setActiveRecipient({ id: peerList[0]._id, role: peerList[0].role, name: peerList[0].fullName || peerList[0].username });
        } else {
          setActiveRecipient(null);
        }
      } catch {
        setPeers([]);
        setActiveRecipient(null);
      }
    };

    loadPeers();
  }, [location.search, user, queryParams]);

  useEffect(() => {
    if (!user || !activeRecipient?.id) {
      setMessages([]);
      return;
    }

    const loadHistory = async () => {
      try {
        const history = await chatApi.getHistory(activeRecipient.id);
        setMessages(history || []);
      } catch {
        setMessages([]);
      }
    };

    loadHistory();
  }, [activeRecipient?.id, user]);

  useEffect(() => {
    if (!user || !activeRecipient?.id) return;

    const socket = io(socketUrl, { withCredentials: true });
    socketRef.current = socket;

    socket.emit("join-chat", {
      studentId: user.role === "student" ? user._id : activeRecipient.id,
      guardId: user.role === "guard" ? user._id : activeRecipient.id,
    });

    socket.on("new-message", (message) => {
      setMessages((prev) => {
        const exists = prev.some((item) => item._id === message._id);
        if (exists) return prev;
        return [...prev, message];
      });
    });

    return () => socket.disconnect();
  }, [activeRecipient?.id, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!draft.trim() || !activeRecipient?.id || !user) return;

    const payload = {
      recipientId: activeRecipient.id,
      content: draft.trim(),
    };

    try {
      const sent = await chatApi.sendMessage(payload);
      setMessages((prev) => [...prev, sent]);
      socketRef.current?.emit("send-message", {
        studentId: user.role === "student" ? user._id : activeRecipient.id,
        guardId: user.role === "guard" ? user._id : activeRecipient.id,
        senderId: user._id,
        recipientId: activeRecipient.id,
        content: draft.trim(),
      });
      setDraft("");
    } catch {
      // ignore for now
    }
  };

  if (!user) return null;

  if (!activeRecipient) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Live Chat</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          No available conversation partner was found yet. Your existing order flow is unchanged; once a peer is available, chat will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[72vh] flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      <div className="border-b border-[var(--border)] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Chat with {activeRecipient.name || activeRecipient.role}</h2>
            <p className="text-sm text-[var(--muted)]">Real-time conversations for delivery coordination</p>
          </div>
          {peers.length > 1 ? (
            <select
              value={activeRecipient.id}
              onChange={(event) => {
                const peer = peers.find((item) => item._id === event.target.value);
                if (peer) {
                  setActiveRecipient({ id: peer._id, role: peer.role, name: peer.fullName || peer.username });
                }
              }}
              className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm outline-none"
            >
              {peers.map((peer) => (
                <option key={peer._id} value={peer._id}>
                  {peer.fullName || peer.username}
                </option>
              ))}
            </select>
          ) : null}
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message) => {
          const isMine = message.sender?._id === user._id;
          return (
            <div key={message._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isMine ? "bg-[var(--primary)] text-white" : "bg-[var(--surface-2)] text-[var(--text)]"}`}>
                <p className="text-sm leading-6">{message.content}</p>
                <p className={`mt-1 text-[11px] ${isMine ? "text-white/70" : "text-[var(--muted)]"}`}>
                  {message.sender?.fullName || message.sender?.username || "User"}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-[var(--border)] p-4">
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="flex-1 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-sm outline-none focus:border-[var(--primary)]"
            placeholder={`Send a message to ${activeRecipient.name || activeRecipient.role}`}
          />
          <button type="submit" className="rounded-full bg-[var(--primary)] p-3 text-white">
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
