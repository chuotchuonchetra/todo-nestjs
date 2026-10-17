import React, { useState } from 'react';
import { Plus, Star, Tag, ChevronDown, ChevronUp, AlignLeft } from 'lucide-react';
import { CATEGORIES, PRIORITY_OPTIONS, STATUS_OPTIONS } from '../constants/options';

export default function TodoForm({ onAddTodo }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Development');
  const [starred, setStarred] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTodo({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      category,
      starred
    });

    // Reset
    setTitle('');
    setDescription('');
    setStatus('To Do');
    setPriority('Medium');
    setCategory('Development');
    setStarred(false);
    setShowDetails(false);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all duration-200">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            className="flex-1 bg-transparent border-0 text-sm md:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none py-1"
            placeholder="Add a new task... (e.g. Design homepage hero section)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoComplete="off"
          />

          <div className="flex items-center flex-wrap gap-2 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            {/* Status Select */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer transition-colors shadow-2xs"
              title="Initial Status"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white text-slate-800">
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Priority Select */}
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer transition-colors shadow-2xs"
              title="Priority Level"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white text-slate-800">
                  {opt.label} Priority
                </option>
              ))}
            </select>

            {/* Star toggle */}
            <button
              type="button"
              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                starred
                  ? 'bg-amber-50 border-amber-300 text-amber-500 shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-400'
              }`}
              onClick={() => setStarred(!starred)}
              title={starred ? 'Starred priority' : 'Mark as priority'}
              aria-label="Star task"
            >
              <Star size={16} fill={starred ? 'currentColor' : 'none'} />
            </button>

            {/* Expand Details button */}
            <button
              type="button"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-xs font-medium transition-all ${
                showDetails
                  ? 'bg-slate-200 border-slate-300 text-slate-800'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500'
              }`}
              onClick={() => setShowDetails(!showDetails)}
              title="Add notes & category"
              aria-label="Toggle notes"
            >
              <AlignLeft size={14} />
              {showDetails ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full shadow-sm shadow-indigo-600/30 active:scale-95 transition-all whitespace-nowrap"
            >
              <Plus size={16} />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Collapsible Details Row */}
        {showDetails && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-dashed border-slate-200">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-xs font-semibold text-slate-500 whitespace-nowrap">
                <Tag size={13} /> Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                {CATEGORIES.filter((c) => c.value !== 'All').map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-white text-slate-800">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <input
                type="text"
                placeholder="Optional description or note..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
