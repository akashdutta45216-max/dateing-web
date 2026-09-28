import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Match, Message } from '../../types';
import {
  Send,
  Phone,
  Video,
  ShieldAlert,
  MoreVertical,
  Trash2,
  Lock,
  Smile,
  Image as ImageIcon,
  Check,
  CheckCheck,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  UserX
} from 'lucide-react';

interface ChatViewProps {
  onBack: () => void;
  onStartAudioCall: (user: Match['targetUser']) => void;
  onStartVideoCall: (user: Match['targetUser']) => void;
  onReportUser: (userId: string) => void;
  onBlockUser: (userId: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  onBack,
  onStartAudioCall,
  onStartVideoCall,
  onReportUser,
  onBlockUser
}) => {
  const {
    currentUser,
    activeMatch,
    matches,
    messages,
    sendMessage,
    deleteMessage
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imageUploadUrl, setImageUploadUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Filter messages for current match
  const matchMessages = messages.filter(m => m.matchId === activeMatch?.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [matchMessages]);

  if (!activeMatch || !currentUser) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-slate-400">
        <p>No active match selected. Please choose a match from your Matches tab.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold"
        >
          Go Back to Matches
        </button>
      </div>
    );
  }

  const partner = activeMatch.targetUser;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !imageUploadUrl.trim()) return;

    sendMessage(activeMatch.id, inputMessage.trim(), imageUploadUrl.trim() || undefined);
    setInputMessage('');
    setImageUploadUrl('');
    setShowImageInput(false);
    setShowEmojiPicker(false);
  };

  const quickEmojis = ['☕', '👋', '🎶', '🌸', '✨', '❤️', '😊', '🍃', '📚', '🥟'];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-5rem)] flex flex-col bg-slate-950 border-x border-slate-900">
      
      {/* Chat Header */}
      <div className="p-3 sm:p-4 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md flex items-center justify-between z-20">
        
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative cursor-pointer">
            <img
              src={partner.profilePhoto}
              alt={partner.fullName}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-rose-500/40"
            />
            {partner.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm sm:text-base font-bold text-white">{partner.fullName}</h3>
              {partner.verificationStatus === 'approved' && (
                <span title="Verified Profile">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[180px] sm:max-w-xs">
              {partner.city}, {partner.district} · {partner.isOnline ? 'Online' : 'Active recently'}
            </p>
          </div>
        </div>

        {/* Call & Safety Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Audio Call */}
          <button
            onClick={() => onStartAudioCall(partner)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-rose-300 border border-slate-700 transition-colors"
            title="Start secure audio call (Phone numbers masked)"
          >
            <Phone className="w-4 h-4" />
          </button>

          {/* Video Call */}
          <button
            onClick={() => onStartVideoCall(partner)}
            className="p-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition-colors"
            title="Start secure in-app video call"
          >
            <Video className="w-4 h-4" />
          </button>

          {/* Options Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-30 text-xs text-slate-300"
                onClick={() => setMenuOpen(false)}
              >
                <button
                  onClick={() => onReportUser(partner.id)}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-left text-amber-400"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Report Profile</span>
                </button>
                <button
                  onClick={() => onBlockUser(partner.id)}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-left text-rose-400"
                >
                  <UserX className="w-4 h-4" />
                  <span>Block User</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Safety Notice Bar */}
      <div className="px-4 py-2 bg-purple-950/20 border-b border-purple-900/30 flex items-center justify-center gap-2 text-[11px] text-purple-300 text-center">
        <Lock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
        <span>End-to-end encrypted adda. Never share banking PINs, OTPs, or passwords with anyone.</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        
        {/* Match Header Badge */}
        <div className="text-center my-4 space-y-1">
          <p className="text-xs text-slate-500">You matched with {partner.fullName}</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            <span>✨ Mutual match · Free messaging enabled</span>
          </div>
        </div>

        {matchMessages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
            >
              <div
                className={`max-w-[80%] sm:max-w-md rounded-2xl px-4 py-2.5 text-sm shadow-md relative ${
                  isMe
                    ? 'bg-gradient-to-tr from-rose-600 to-pink-600 text-white rounded-br-xs'
                    : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-bl-xs'
                }`}
              >
                {/* Image message if any */}
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="Shared"
                    className="rounded-xl mb-2 max-h-60 object-cover w-full"
                  />
                )}

                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {/* Timestamp & Read Receipt */}
                <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                  isMe ? 'text-rose-200' : 'text-slate-400'
                }`}>
                  <span>{msg.timestamp}</span>
                  {isMe && (
                    <span>
                      {msg.status === 'read' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-sky-300 inline" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-slate-300 inline" />
                      )}
                    </span>
                  )}
                </div>

                {/* Delete message option for sender */}
                {isMe && (
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="absolute -left-7 top-2 opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                    title="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Emojis Drawer */}
      {showEmojiPicker && (
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
          {quickEmojis.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                setInputMessage(prev => prev + emoji);
              }}
              className="text-xl p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Image Sharing Drawer */}
      {showImageInput && (
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            placeholder="Paste direct photo URL (https://...)"
            value={imageUploadUrl}
            onChange={e => setImageUploadUrl(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
          />
          <button
            type="button"
            onClick={() => setShowImageInput(false)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Input Message Form */}
      <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`p-2 rounded-xl transition-colors ${showEmojiPicker ? 'text-rose-400 bg-slate-800' : 'text-slate-400 hover:text-white'}`}
          title="Add emoji"
        >
          <Smile className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setShowImageInput(!showImageInput)}
          className={`p-2 rounded-xl transition-colors ${showImageInput ? 'text-rose-400 bg-slate-800' : 'text-slate-400 hover:text-white'}`}
          title="Share photo"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <input
          type="text"
          placeholder={`Message ${partner.fullName}...`}
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() && !imageUploadUrl.trim()}
          className="p-2.5 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
