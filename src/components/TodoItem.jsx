import React, { useState, useRef, useEffect } from 'react';
import { 
  GripVertical, 
  Check, 
  Trash2, 
  Edit3, 
  Star, 
  Clock, 
  CheckCircle2, 
  X,
  Save,
  Tag
} from 'lucide-react';
import { STATUS_OPTIONS, PRIORITY_OPTIONS, CATEGORIES } from '../constants/options';

export default function TodoItem({
  todo,
  isSelected,
  onToggleSelect,
  onUpdateTodo,
  onDeleteTodo,
  onToggleStar,
  isDragging,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editStatus, setEditStatus] = useState(todo.status);
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editCategory, setEditCategory] = useState(todo.category || 'Development');
  const [justCompleted, setJustCompleted] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setEditTitle(todo.title);
    setEditStatus(todo.status);
    setEditPriority(todo.priority);
    setEditCategory(todo.category || 'Development');
    setIsEditing(true);
  };

  const handleSaveEdit = (e) => {
    if (e) e.preventDefault();
    if (!editTitle.trim()) return;

    onUpdateTodo(todo.id, {
      title: editTitle.trim(),
      status: editStatus,
      priority: editPriority,
      category: editCategory
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit(e);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleStatusQuickChange = (e) => {
    const newStatus = e.target.value;
    if (newStatus === 'Done') {
      const rect = e.currentTarget.getBoundingClientRect();
      const coords = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 700);
      onUpdateTodo(todo.id, { status: newStatus }, coords);
    } else {
      onUpdateTodo(todo.id, { status: newStatus });
    }
  };

  const toggleDoneStatus = (e) => {
    const isNowDone = todo.status !== 'Done';
    const rect = e.currentTarget.getBoundingClientRect();
    const coords = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

    if (isNowDone) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 700);
    }
    onUpdateTodo(todo.id, { status: isNowDone ? 'Done' : 'To Do' }, coords);
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Done':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-rose-50 text-rose-600 border-rose-200/70';
      case 'low':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200/70';
      default:
        return 'bg-amber-50 text-amber-600 border-amber-200/70';
    }
  };

  return (
    <div
      className={`group relative flex items-start gap-3 p-3.5 bg-white border rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 ${
        justCompleted ? 'animate-complete-flash' : ''
      } ${
        isSelected
          ? 'border-indigo-500 bg-indigo-50/30'
          : 'border-slate-200/90'
      } ${todo.status === 'Done' && !justCompleted ? 'opacity-85 bg-slate-50/50' : ''} ${
        isDragging ? 'opacity-40 border-dashed border-indigo-400' : ''
      }`}
      draggable={!isEditing}
      onDragStart={(e) => onDragStart(e, todo.id)}
      onDragOver={(e) => onDragOver(e, todo.id)}
      onDrop={(e) => onDrop(e, todo.id)}
      onDragEnd={onDragEnd}
    >
      {/* Drag Grip Handle */}
      <div 
        className="text-slate-300 group-hover:text-slate-500 cursor-grab active:cursor-grabbing pt-1 transition-colors"
        title="Drag to reorder tasks"
        aria-label="Drag handle"
      >
        <GripVertical size={16} />
      </div>

      {/* Multi-select Checkbox */}
      <div className="pt-0.5">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(todo.id)}
          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          title="Select task for bulk actions"
        />
      </div>

      {/* Quick completion toggle circle */}
      <button
        type="button"
        className={`w-5.5 h-5.5 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 flex-shrink-0 ${
          todo.status === 'Done'
            ? 'bg-emerald-500 border-emerald-500 text-white shadow-2xs'
            : 'border-slate-300 hover:border-emerald-500 hover:bg-emerald-50'
        } ${justCompleted ? 'scale-110 ring-4 ring-emerald-200/60' : ''}`}
        onClick={toggleDoneStatus}
        title={todo.status === 'Done' ? 'Mark as incomplete' : 'Mark as Done'}
        aria-label="Toggle completed"
      >
        {todo.status === 'Done' && (
          <Check size={12} strokeWidth={3} className={justCompleted ? 'animate-check-pop' : ''} />
        )}
      </button>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          /* Inline Editing Mode */
          <form onSubmit={handleSaveEdit} className="flex flex-col gap-2.5">
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-slate-50 border border-indigo-500 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-900 focus:outline-none"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              required
            />

            <div className="flex items-center flex-wrap gap-2">
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-white text-slate-800">
                    {opt.label}
                  </option>
                ))}
              </select>

              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-white text-slate-800">
                    {opt.label} Priority
                  </option>
                ))}
              </select>

              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                {CATEGORIES.filter((c) => c.value !== 'All').map((c) => (
                  <option key={c.value} value={c.value} className="bg-white text-slate-800">
                    {c.label}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors"
                  title="Save changes (Enter)"
                >
                  <Save size={13} /> Save
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition-colors"
                  onClick={handleCancelEdit}
                  title="Cancel (Esc)"
                >
                  <X size={13} /> Cancel
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Normal Display Mode */
          <div className="flex flex-col gap-1.5">
            <span
              className={`text-sm font-semibold text-slate-800 leading-snug cursor-pointer transition-colors ${
                todo.status === 'Done' ? 'line-through text-slate-400' : ''
              }`}
              onDoubleClick={handleStartEdit}
              title="Double-click to edit title"
            >
              {todo.title}
            </span>

            {todo.description && (
              <p className="text-xs text-slate-500 leading-relaxed">
                {todo.description}
              </p>
            )}

            <div className="flex items-center flex-wrap gap-2 mt-1">
              {/* Quick Status Pill with inline select */}
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadgeStyle(todo.status)}`}>
                {todo.status === 'Done' ? (
                  <CheckCircle2 size={12} />
                ) : (
                  <Clock size={12} />
                )}
                <select
                  value={todo.status}
                  onChange={handleStatusQuickChange}
                  className="bg-transparent border-0 text-inherit font-bold cursor-pointer focus:outline-none p-0 text-[11px]"
                  title="Click to quickly switch status"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-white text-slate-800 font-semibold">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority badge */}
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getPriorityStyle(todo.priority)}`}>
                {todo.priority || 'Medium'}
              </span>

              {/* Category tag */}
              {todo.category && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                  <Tag size={10} />
                  {todo.category}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons (Star, Edit, Delete) */}
      {!isEditing && (
        <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
          {/* Star toggle */}
          <button
            type="button"
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              todo.starred
                ? 'text-amber-500 hover:text-amber-600'
                : 'text-slate-300 hover:text-amber-500 hover:bg-slate-100'
            }`}
            onClick={() => onToggleStar(todo.id)}
            title={todo.starred ? 'Remove Star' : 'Mark as Starred priority'}
            aria-label="Star todo"
          >
            <Star size={16} fill={todo.starred ? 'currentColor' : 'none'} />
          </button>

          {/* Edit button */}
          <button
            type="button"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            onClick={handleStartEdit}
            title="Edit task"
            aria-label="Edit todo"
          >
            <Edit3 size={15} />
          </button>

          {/* Delete button */}
          <button
            type="button"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            onClick={() => onDeleteTodo(todo.id)}
            title="Delete task"
            aria-label="Delete todo"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
