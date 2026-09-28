import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Edit3,
  Trash2,
  Lock,
  Camera,
  Heart,
  AlertTriangle,
  Check,
  UserCheck
} from 'lucide-react';
import { POPULAR_INTERESTS, RELATIONSHIP_GOAL_LABELS } from '../../data/districts';

interface UserProfileViewProps {
  onOpenVerification: () => void;
  onOpenMembership: () => void;
  onOpenLegal: (type: string) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  onOpenVerification,
  onOpenMembership,
  onOpenLegal
}) => {
  const { currentUser, updateCurrentUserProfile, deleteAccount, dailySwipesRemaining, maxDailySwipes } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');

  // Editable Form State
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editProfession, setEditProfession] = useState(currentUser?.profession || '');
  const [editEducation, setEditEducation] = useState(currentUser?.education || '');
  const [editPhoto, setEditPhoto] = useState(currentUser?.profilePhoto || '');
  const [editInterests, setEditInterests] = useState<string[]>(currentUser?.interests || []);

  if (!currentUser) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      bio: editBio,
      profession: editProfession,
      education: editEducation,
      profilePhoto: editPhoto,
      interests: editInterests
    });
    setIsEditing(false);
  };

  const handleDeleteAccountConfirm = () => {
    deleteAccount(deleteReason);
    setDeleteModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Profile Card Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-40 bg-rose-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          
          {/* Avatar with Verification Shield */}
          <div className="relative shrink-0">
            <img
              src={currentUser.profilePhoto}
              alt={currentUser.fullName}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-rose-500/40 shadow-2xl"
            />
            {currentUser.verificationStatus === 'approved' && (
              <div 
                className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl shadow-lg ring-4 ring-slate-900"
                title="Real-Time Video Verified"
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}
          </div>

          {/* User Primary Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center justify-center sm:justify-start gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">{currentUser.fullName}</h2>
                <span className="text-lg text-rose-300 font-light">{currentUser.age}</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 capitalize font-medium">
                  {currentUser.gender}
                </span>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="self-center sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-rose-400" />
                <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 flex items-center justify-center sm:justify-start gap-1.5">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{currentUser.city}, {currentUser.district} (West Bengal)</span>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-rose-400" />
                <span>{currentUser.profession}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                <span>{currentUser.education}</span>
              </span>
              <span>·</span>
              <span>Height: {currentUser.height}</span>
            </div>

            {/* Verification Status Banner */}
            <div className="pt-2">
              {currentUser.verificationStatus === 'approved' ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Real-Time Liveness Verified Profile</span>
                </div>
              ) : (
                <button
                  onClick={onOpenVerification}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Verify Profile with Real-Time Camera</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* EDIT FORM (if toggled) */}
      {isEditing ? (
        <form onSubmit={handleSaveProfile} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-rose-400" />
            <span>Edit Profile Information</span>
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Photo URL</label>
            <input
              type="text"
              value={editPhoto}
              onChange={e => setEditPhoto(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">About / Bio</label>
            <textarea
              rows={3}
              value={editBio}
              onChange={e => setEditBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Profession</label>
              <input
                type="text"
                value={editProfession}
                onChange={e => setEditProfession(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Education</label>
              <input
                type="text"
                value={editEducation}
                onChange={e => setEditEducation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md"
            >
              Save Profile Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        /* Bio & Lifestyle Overview */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 space-y-6">
            
            {/* About Card */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider text-rose-400">
                About Me
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                "{currentUser.bio}"
              </p>
            </div>

            {/* Interests & Adda Topics */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider text-rose-400">
                Adda Topics & Interests
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentUser.interests.map((it, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  >
                    {it}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Side Privacy & Settings Column */}
          <div className="space-y-6">
            
            {/* Private Contact Notice */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-white font-bold">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Private Information (Never Shared)</span>
              </div>
              <div className="space-y-1.5 text-slate-400 text-[11px]">
                <p>• Mobile: <span className="text-slate-200 font-mono">{currentUser.mobile}</span> (Hidden from matches)</p>
                <p>• Email: <span className="text-slate-200">{currentUser.email}</span> (Hidden)</p>
                <p>• DOB: <span className="text-slate-200">{currentUser.dob}</span> (Only age is shown)</p>
              </div>
            </div>

            {/* Daily Swipes & Membership Status */}
            <div className="p-5 rounded-3xl bg-purple-950/20 border border-purple-900/40 space-y-3 text-xs">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Swipe & Calling Quotas</span>
              </h4>
              <p className="text-slate-300">
                Daily Swipes: <strong className="text-white">{dailySwipesRemaining} / {maxDailySwipes} left today</strong>
              </p>
              <button
                onClick={onOpenMembership}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-semibold text-xs border border-slate-700"
              >
                Upgrade Allowance (From ₹99)
              </button>
            </div>

            {/* Account Deletion */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-white">Account Privacy & Erasure</h4>
              <p className="text-[11px] text-slate-400">
                You can permanently delete your profile and personal photos in compliance with DPDP 2023.
              </p>
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="mt-2 text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete My Account Permanently</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-3xl p-6 text-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Delete PremKotha Account?</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                This action is irreversible. All your mutual matches, chats, and verified badge will be permanently erased.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Reason (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Found someone special on PremKotha!"
                value={deleteReason}
                onChange={e => setDeleteReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold"
              >
                Keep Account
              </button>
              <button
                onClick={handleDeleteAccountConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg"
              >
                Confirm Account Deletion
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
