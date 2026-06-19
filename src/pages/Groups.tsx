import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Plus, Users, Globe, Lock, Search, PlusCircle, CheckCircle, MessageSquare } from 'lucide-react';
import { Group } from '../types';
import { useNavigate } from 'react-router-dom';

export const Groups: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, groups, createGroup, joinGroup, leaveGroup } = useAuth();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'study' | 'class'>('all');

  // Form states
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [groupType, setGroupType] = useState<'study' | 'class'>('study');
  const [isPublic, setIsPublic] = useState(true);

  if (!currentUser) return null;

  // Filter groups
  const filteredGroups = groups.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || g.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName || !groupDesc) return;

    createGroup(groupName, groupDesc, groupType, isPublic, [currentUser.id]);
    setShowCreateModal(false);
    setGroupName('');
    setGroupDesc('');
    alert('Collaboration Group created successfully!');
  };

  const handleToggleJoin = (g: Group) => {
    const isMember = g.members.includes(currentUser.id);
    if (isMember) {
      leaveGroup(g.id);
      alert(`Left group: ${g.name}`);
    } else {
      joinGroup(g.id);
      alert(`Joined group: ${g.name}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 text-left">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Collab & Groups</h1>
          <p className="text-sm text-text-secondary mt-1">Form study circles, coordinate team projects, or sync class sections.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Start Group
        </Button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white/5 border border-white/10 dark:border-white/5 rounded-2xl p-4">
        {/* Toggle Filters */}
        <div className="flex bg-white/5 border border-white/10 dark:border-white/5 rounded-xl p-1 w-full sm:w-auto">
          {(['all', 'study', 'class'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer capitalize ${filterType === type ? 'bg-brand text-white' : 'text-text-secondary hover:text-text-primary'}`}
            >
              {type} Rooms
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex items-center w-full sm:w-64">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input pl-9 pr-3 py-1.5 text-xs rounded-xl w-full"
          />
        </div>
      </div>

      {/* Grid of groups cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.length === 0 ? (
          <Card hoverEffect={false} className="p-8 text-center text-text-secondary text-sm md:col-span-3">
            No study groups or classes found.
          </Card>
        ) : (
          filteredGroups.map(g => {
            const isMember = g.members.includes(currentUser.id);
            return (
              <Card key={g.id} padding="lg" className="flex flex-col justify-between text-left space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[9px] font-bold text-brand uppercase tracking-wider px-2 py-0.5 rounded bg-brand/10 border border-brand/20">
                      {g.type}
                    </span>
                    <span className="text-[10px] text-text-secondary flex items-center gap-1">
                      {g.isPublic ? <Globe className="w-3 h-3 text-green-500" /> : <Lock className="w-3 h-3 text-red-500" />}
                      {g.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-text-primary line-clamp-1">{g.name}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">{g.description}</p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                  <span className="text-[11px] text-text-secondary font-medium">
                    {g.members.length} members
                  </span>

                  <div className="flex items-center gap-2">
                    {isMember ? (
                      <>
                        <button
                          onClick={() => { navigate('/messages'); }}
                          className="p-1.5 rounded-lg border border-white/10 hover:bg-brand/10 text-brand transition-colors cursor-pointer"
                          title="Open Group Chat"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => handleToggleJoin(g)}
                          className="text-xs py-1"
                        >
                          Leave
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={() => handleToggleJoin(g)}
                        className="text-xs py-1"
                      >
                        Join Circle
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Create Group Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Collaboration Room"
      >
        <form onSubmit={handleCreateGroup} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary" htmlFor="grpName">Group Name</label>
            <input
              id="grpName"
              type="text"
              required
              placeholder="e.g. Hackathon Idea Builders"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="glass-input w-full px-3 py-2 text-sm rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary" htmlFor="grpDesc">Objective / Description</label>
            <textarea
              id="grpDesc"
              rows={3}
              required
              placeholder="What is the room topic or objective?"
              value={groupDesc}
              onChange={(e) => setGroupDesc(e.target.value)}
              className="glass-input w-full px-3 py-2 text-sm rounded-xl resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary" htmlFor="grpType">Group Category</label>
              <select
                id="grpType"
                value={groupType}
                onChange={(e) => setGroupType(e.target.value as any)}
                className="glass-input w-full px-3 py-2 text-xs rounded-xl cursor-pointer"
              >
                <option value="study">Study Circle</option>
                <option value="class">Classroom Committee</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary" htmlFor="grpPriv">Privacy Setting</label>
              <select
                id="grpPriv"
                value={isPublic ? 'true' : 'false'}
                onChange={(e) => setIsPublic(e.target.value === 'true')}
                className="glass-input w-full px-3 py-2 text-xs rounded-xl cursor-pointer"
              >
                <option value="true">Public (Anyone can browse)</option>
                <option value="false">Private (By approval only)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-white/10">
            <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Room
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
