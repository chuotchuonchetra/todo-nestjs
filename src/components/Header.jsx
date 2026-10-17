import React, { useState, useEffect } from 'react';
import { CheckSquare, User, X, Save, Mail, Briefcase, RotateCcw } from 'lucide-react';

export default function Header({ user, onSaveUser, onResetDemo }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(user);

  useEffect(() => {
    if (isOpen) setForm(user);
  }, [isOpen, user]);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.displayName.trim()) return;
    onSaveUser({
      ...form,
      username: form.username.trim(),
      displayName: form.displayName.trim(),
    });
    setIsOpen(false);
  };

  const inputClass =
    'w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

  return (
    <>
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
          <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
            <CheckSquare size={20} />
          </span>
          FlowTask
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 bg-white border border-slate-200/90 rounded-full shadow-xs hover:shadow-md transition-all"
          title="Open profile"
        >
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <User size={16} />
            </span>
          )}
          <span className="flex flex-col items-start leading-tight">
            <span className="text-xs font-bold text-slate-800">{user.displayName}</span>
            <span className="text-[11px] text-slate-500">@{user.username}</span>
          </span>
        </button>
      </header>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40"
          onClick={() => setIsOpen(false)}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">My Profile</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="Close profile"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {form.avatarUrl ? (
                <img src={form.avatarUrl} alt="" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <span className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <User size={28} />
                </span>
              )}
              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-500">Avatar URL</label>
                <input className={inputClass} value={form.avatarUrl} onChange={handleChange('avatarUrl')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500">Display name</label>
                <input className={inputClass} value={form.displayName} onChange={handleChange('displayName')} required />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Username</label>
                <input className={inputClass} value={form.username} onChange={handleChange('username')} required />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                <Briefcase size={12} /> Job title
              </label>
              <input className={inputClass} value={form.title} onChange={handleChange('title')} />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                <Mail size={12} /> Email
              </label>
              <input type="email" className={inputClass} value={form.email} onChange={handleChange('email')} />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500">Bio</label>
              <textarea rows={2} className={inputClass} value={form.bio} onChange={handleChange('bio')} />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  onResetDemo();
                  setIsOpen(false);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600"
              >
                <RotateCcw size={13} /> Reset demo data
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full"
              >
                <Save size={14} /> Save profile
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
