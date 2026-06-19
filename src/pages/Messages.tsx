import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { 
  Search, MessageSquare, Send, Paperclip, 
  Info, Users, User, ArrowLeft 
} from 'lucide-react';
import { Message, Group } from '../types';

export const Messages: React.FC = () => {
  const { currentUser, messages, sendMessage, groups, classrooms } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'dm' | 'group'>('dm');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selection
  const [selectedReceiverId, setSelectedReceiverId] = useState<string | null>('fac-01'); // default to prof chat
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  
  // Modal for group members info
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Message input
  const [inputText, setInputText] = useState('');
  const [attachFileName, setAttachFileName] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!currentUser) return null;

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedReceiverId, selectedGroupId]);

  // Handle bot typing simulators
  useEffect(() => {
    if (selectedGroupId) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [selectedGroupId]);

  // Lists definitions
  const DM_CONTACTS = [
    { id: 'fac-01', name: 'Prof. Ramesh Sharma', role: 'Faculty', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120' },
    { id: 'stud-02', name: 'Ayush Goel', role: 'Student', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120' },
    { id: 'stud-03', name: 'Riya Sen', role: 'Student', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120' }
  ];

  // Filters contacts/groups
  const filteredContacts = DM_CONTACTS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Active chat metadata
  const activeDMContact = DM_CONTACTS.find(c => c.id === selectedReceiverId);
  const activeGroup = groups.find(g => g.id === selectedGroupId);

  // Get message history for active selection
  const chatMessages = messages.filter(msg => {
    if (selectedGroupId) {
      return msg.groupId === selectedGroupId;
    } else {
      return msg.groupId === null && (
        (msg.senderId === currentUser.id && msg.receiverId === selectedReceiverId) ||
        (msg.senderId === selectedReceiverId && msg.receiverId === currentUser.id)
      );
    }
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !attachFileName) return;

    sendMessage(
      selectedGroupId ? null : selectedReceiverId,
      selectedGroupId ? selectedGroupId : null,
      inputText,
      attachFileName ? `https://ipu.edu.in/files/${attachFileName}` : undefined,
      attachFileName || undefined
    );
    
    setInputText('');
    setAttachFileName('');
  };

  const handleSelectContact = (cid: string) => {
    setSelectedGroupId(null);
    setSelectedReceiverId(cid);
  };

  const handleSelectGroup = (gid: string) => {
    setSelectedReceiverId(null);
    setSelectedGroupId(gid);
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="h-[78vh] flex flex-col md:flex-row glass-panel border border-white/10 rounded-3xl overflow-hidden text-left">
      
      {/* Side bar list of conversations */}
      <div className="w-full md:w-80 border-r border-white/10 flex flex-col h-full bg-white/[0.01]">
        
        {/* Navigation Tabs */}
        <div className="p-4 border-b border-white/10 space-y-3">
          <div className="flex bg-white/5 border border-white/10 dark:border-white/5 rounded-xl p-1">
            <button
              onClick={() => { setActiveTab('dm'); setSelectedGroupId(null); setSelectedReceiverId(DM_CONTACTS[0]?.id || null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${activeTab === 'dm' ? 'bg-brand text-white' : 'text-text-secondary hover:text-text-primary'}`}
            >
              Direct Chats
            </button>
            <button
              onClick={() => { setActiveTab('group'); setSelectedReceiverId(null); setSelectedGroupId(groups[0]?.id || null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${activeTab === 'group' ? 'bg-brand text-white' : 'text-text-secondary hover:text-text-primary'}`}
            >
              Study Channels
            </button>
          </div>

          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-text-secondary absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search chat log..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input pl-9 pr-3 py-1.5 text-xs rounded-xl w-full"
            />
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {activeTab === 'dm' ? (
            filteredContacts.map(contact => {
              const isActive = selectedReceiverId === contact.id;
              const lastMsg = messages.filter(m => 
                m.groupId === null && (
                  (m.senderId === currentUser.id && m.receiverId === contact.id) ||
                  (m.senderId === contact.id && m.receiverId === currentUser.id)
                )
              ).pop();

              return (
                <div
                  key={contact.id}
                  onClick={() => handleSelectContact(contact.id)}
                  className={`p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${isActive ? 'bg-brand/10 border border-brand/20' : 'hover:bg-white/5 border border-transparent'}`}
                >
                  <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover border border-brand/20" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-xs font-bold text-text-primary truncate">{contact.name}</h4>
                      <span className="text-[9px] text-text-secondary">{contact.role}</span>
                    </div>
                    <p className="text-[10px] text-text-secondary truncate mt-0.5">
                      {lastMsg ? lastMsg.content : 'Start a conversation'}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            filteredGroups.map(group => {
              const isActive = selectedGroupId === group.id;
              const lastMsg = messages.filter(m => m.groupId === group.id).pop();

              return (
                <div
                  key={group.id}
                  onClick={() => handleSelectGroup(group.id)}
                  className={`p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${isActive ? 'bg-brand/10 border border-brand/20' : 'hover:bg-white/5 border border-transparent'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-xs font-bold text-text-primary truncate">{group.name}</h4>
                      <span className="text-[9px] text-text-secondary">{group.members.length} members</span>
                    </div>
                    <p className="text-[10px] text-text-secondary truncate mt-0.5">
                      {lastMsg ? `${lastMsg.senderName}: ${lastMsg.content}` : 'No messages yet'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main chat log window */}
      <div className="flex-1 flex flex-col h-full bg-black/10 dark:bg-black/30">
        
        {/* Active Chat Header */}
        <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3 min-w-0">
            {activeDMContact ? (
              <>
                <img src={activeDMContact.avatar} alt={activeDMContact.name} className="w-9 h-9 rounded-full object-cover border border-brand/20" />
                <div className="text-left">
                  <h3 className="text-sm font-bold text-text-primary truncate">{activeDMContact.name}</h3>
                  <span className="text-[10px] text-green-500 font-semibold uppercase tracking-wider block">Online</span>
                </div>
              </>
            ) : activeGroup ? (
              <>
                <div className="w-9 h-9 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-bold text-text-primary truncate">{activeGroup.name}</h3>
                  <span className="text-[10px] text-text-secondary block">{activeGroup.description}</span>
                </div>
              </>
            ) : (
              <span className="text-xs text-text-secondary">Select a contact to begin</span>
            )}
          </div>

          {(activeDMContact || activeGroup) ? (
            <button 
              onClick={() => setShowInfoModal(true)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
            >
              <Info className="w-4.5 h-4.5" />
            </button>
          ) : null}
        </div>

        {/* Message Logs Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-text-secondary italic">
              Send a message to open discussion board.
            </div>
          ) : (
            chatMessages.map(msg => {
              const isMine = msg.senderId === currentUser.id;
              return (
                <div key={msg.id} className={`flex gap-2 max-w-[75%] ${isMine ? 'ml-auto flex-row-reverse text-right' : 'text-left'}`}>
                  {!isMine && (
                    <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center shrink-0 border border-brand/20">
                      <User className="w-4 h-4 text-brand" />
                    </div>
                  )}
                  <div className="space-y-1">
                    {!isMine && <span className="text-[10px] text-text-secondary font-bold px-1">{msg.senderName}</span>}
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed border ${isMine ? 'bg-brand border-brand/35 text-white rounded-tr-none' : 'bg-white/5 border-white/10 text-text-primary rounded-tl-none'}`}>
                      {msg.content}
                      {msg.fileUrl ? (
                        <div className="mt-2 p-2 rounded-xl bg-black/20 flex items-center justify-between gap-4 text-[10px]">
                          <span className="truncate max-w-[120px] font-semibold">{msg.fileName}</span>
                          <button 
                            onClick={() => alert('Downloading file attachment (simulated).')}
                            className="p-1 rounded bg-white/10 hover:bg-white/20 cursor-pointer"
                          >
                            <Paperclip className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <span className="text-[8px] text-text-secondary block px-1.5">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}

          {isTyping && (
            <div className="flex gap-2 items-center text-[10px] text-text-secondary italic pl-10">
              <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce [animation-delay:0.4s]" />
              <span>Members are typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        {(activeDMContact || activeGroup) ? (
          <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-white/[0.01] space-y-2">
            {attachFileName ? (
              <div className="flex items-center justify-between p-2 rounded-lg bg-brand/5 border border-brand/20 text-xs">
                <span className="text-brand font-semibold truncate max-w-lg">Attached: {attachFileName}</span>
                <button type="button" onClick={() => setAttachFileName('')} className="text-red-500 font-bold hover:underline cursor-pointer">Remove</button>
              </div>
            ) : null}

            <div className="flex gap-2">
              <div className="relative flex items-center justify-center shrink-0">
                <input
                  type="file"
                  onChange={handleFileAttach}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button
                  type="button"
                  className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                  aria-label="Attach document"
                >
                  <Paperclip className="w-4.5 h-4.5" />
                </button>
              </div>

              <input
                type="text"
                placeholder="Type your message here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="glass-input flex-1 px-4 py-2.5 text-xs rounded-xl"
              />

              <Button type="submit" variant="primary" className="p-2.5 rounded-xl">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        ) : null}
      </div>

      {/* Roster detail modal */}
      <Modal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={activeGroup ? 'Study Room Information' : 'User profile'}
      >
        {activeGroup ? (
          <div className="space-y-4 text-left">
            <div>
              <span className="text-xs text-text-secondary font-bold block">Room Name</span>
              <p className="text-base font-bold text-text-primary mt-0.5">{activeGroup.name}</p>
            </div>
            <div>
              <span className="text-xs text-text-secondary font-bold block">Objective</span>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">{activeGroup.description}</p>
            </div>
            <div>
              <span className="text-xs text-text-secondary font-bold block mb-2">Members List ({activeGroup.members.length})</span>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {activeGroup.members.map(m => (
                  <div key={m} className="p-2 bg-white/5 border border-white/5 rounded-lg text-xs font-semibold text-text-primary">
                    {m === currentUser.id ? `${currentUser.name} (You)` : `Student User ID: ${m}`}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeDMContact ? (
          <div className="space-y-4 text-left flex flex-col items-center text-center">
            <img src={activeDMContact.avatar} alt={activeDMContact.name} className="w-16 h-16 rounded-full object-cover border-2 border-brand" />
            <div>
              <h3 className="text-lg font-bold text-text-primary">{activeDMContact.name}</h3>
              <p className="text-xs text-text-secondary">{activeDMContact.role} Member</p>
            </div>
            <div className="w-full text-left space-y-2 pt-4 border-t border-white/10">
              <p className="text-xs text-text-secondary"><strong>Contact Email:</strong> {activeDMContact.id === 'fac-01' ? 'rsharma@ipu.edu.in' : 'student@ipu.edu.in'}</p>
              <p className="text-xs text-text-secondary"><strong>Office hours:</strong> Mon-Wed 10:00 AM - 12:00 PM</p>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};
