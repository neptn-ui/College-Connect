import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Plus, Search, MapPin, Phone, Calendar, Upload, AlertCircle } from 'lucide-react';
import { LostFoundItem } from '../types';

export const LostFound: React.FC = () => {
  const { currentUser, lostFoundItems, postLostFoundItem } = useAuth();
  
  const [showPostModal, setShowPostModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contactInfo, setContactInfo] = useState(currentUser?.phone || '');
  const [itemType, setItemType] = useState<'lost' | 'found'>('lost');
  const [category, setCategory] = useState('Electronics');

  if (!currentUser) return null;

  const CATEGORIES = ['Electronics', 'Stationery', 'Books', 'Clothing', 'Accessories', 'Documents', 'Other'];

  // Filters items
  const filteredItems = lostFoundItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const handlePostItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location) return;

    postLostFoundItem(title, description, location, contactInfo, itemType, category);
    setShowPostModal(false);
    setTitle('');
    setDescription('');
    setLocation('');
    alert('Campus item post published!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 text-left">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Campus Lost & Found</h1>
          <p className="text-sm text-text-secondary mt-1">Locate lost belongings or report found items on campus.</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setShowPostModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Post Item
        </Button>
      </div>

      {/* Filter and Search board */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 border border-white/10 dark:border-white/5 rounded-2xl p-4">
        
        {/* Toggle Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex bg-white/5 border border-white/10 dark:border-white/5 rounded-xl p-1">
            {(['all', 'lost', 'found'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer capitalize ${filterType === type ? 'bg-brand text-white' : 'text-text-secondary hover:text-text-primary'}`}
              >
                {type}
              </button>
            ))}
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="glass-input px-3 py-1.5 text-xs rounded-xl cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative flex items-center w-full md:w-64">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input pl-9 pr-3 py-1.5 text-xs rounded-xl w-full"
          />
        </div>
      </div>

      {/* Grid items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <Card hoverEffect={false} className="p-8 text-center text-text-secondary text-sm md:col-span-3">
            No items reported in this category.
          </Card>
        ) : (
          filteredItems.map(item => (
            <Card key={item.id} padding="none" className="flex flex-col h-full text-left">
              {item.photoUrl ? (
                <img 
                  src={item.photoUrl} 
                  alt={item.title} 
                  className="w-full h-44 object-cover"
                />
              ) : (
                <div className="w-full h-44 bg-brand/10 flex items-center justify-center border-b border-white/10">
                  <AlertCircle className="w-8 h-8 text-brand/40" />
                </div>
              )}
              
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border ${item.type === 'lost' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'}`}>
                      {item.type.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-text-primary line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">{item.description}</p>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-2 text-[11px] text-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand shrink-0" />
                    <span className="truncate">Location: {item.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand shrink-0" />
                    <span>Posted: {new Date(item.datePosted).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1 text-text-primary font-semibold">
                    <Phone className="w-3.5 h-3.5 text-brand shrink-0" />
                    <span>Contact: {item.contactInfo}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Post Modal */}
      <Modal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        title="Report Campus Belonging"
      >
        <form onSubmit={handlePostItem} className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary" htmlFor="postTitle">Belonging Title</label>
              <input
                id="postTitle"
                type="text"
                required
                placeholder="e.g. Black keys with audi ring"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="glass-input w-full px-3 py-2 text-sm rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary" htmlFor="postCat">Category</label>
              <select
                id="postCat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="glass-input w-full px-3 py-2 text-sm rounded-xl cursor-pointer"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary" htmlFor="postDesc">Item Description & Details</label>
            <textarea
              id="postDesc"
              rows={3}
              required
              placeholder="What color, mark, or scratch defines the item? When was it misplaced?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="glass-input w-full px-3 py-2 text-sm rounded-xl resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary" htmlFor="postLoc">Last Known Location</label>
              <input
                id="postLoc"
                type="text"
                required
                placeholder="e.g. Block C Canteen"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="glass-input w-full px-3 py-2 text-sm rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary" htmlFor="postContact">Contact Details</label>
              <input
                id="postContact"
                type="text"
                required
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                className="glass-input w-full px-3 py-2 text-sm rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary block">Report Mode</label>
            <div className="flex gap-4 pt-1">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="itemType"
                  checked={itemType === 'lost'}
                  onChange={() => setItemType('lost')}
                  className="w-4 h-4 text-brand bg-white/5 border-white/10"
                />
                <span className="ml-2 text-xs text-text-primary">I lost this item</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="itemType"
                  checked={itemType === 'found'}
                  onChange={() => setItemType('found')}
                  className="w-4 h-4 text-brand bg-white/5 border-white/10"
                />
                <span className="ml-2 text-xs text-text-primary">I found this item</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-white/10">
            <Button type="button" variant="secondary" onClick={() => setShowPostModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Post Belonging
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
