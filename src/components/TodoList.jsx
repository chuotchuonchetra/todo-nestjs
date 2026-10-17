import React, { useState } from 'react';
import { ClipboardList, Sparkles } from 'lucide-react';
import TodoItem from './TodoItem';

export default function TodoList({
  todos,
  selectedIds,
  onToggleSelect,
  onUpdateTodo,
  onDeleteTodo,
  onToggleStar,
  onReorderTodos,
  onClearFilters,
  hasActiveFilters  
}) {
  const [draggedId, setDraggedId] = useState(null);

  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    const currentIndex = todos.findIndex((t) => t.id === draggedId);
    const targetIndex = todos.findIndex((t) => t.id === targetId);

    if (currentIndex !== -1 && targetIndex !== -1) {
      const updatedList = [...todos];
      const [draggedItem] = updatedList.splice(currentIndex, 1);
      updatedList.splice(targetIndex, 0, draggedItem);
      onReorderTodos(updatedList);
    }

    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 px-6 bg-white border-2 border-dashed border-slate-200 rounded-2xl text-center">
        <div className="relative w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
          <ClipboardList size={34} />
          <Sparkles size={16} className="absolute top-2 right-2 text-amber-500" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          {hasActiveFilters ? 'No matching tasks found' : 'No tasks on your board'}
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mb-5 leading-relaxed">
          {hasActiveFilters
            ? 'Try adjusting your search keywords or switching filter tabs to see other items.'
            : 'Get organized! Add your first task using the input form above.'}
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full shadow-sm transition-all active:scale-95"
            onClick={onClearFilters}
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isSelected={selectedIds.includes(todo.id)}
          onToggleSelect={onToggleSelect}
          onUpdateTodo={onUpdateTodo}
          onDeleteTodo={onDeleteTodo}
          onToggleStar={onToggleStar}
          isDragging={draggedId === todo.id}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
        />
      ))}
    </div>
  );
}
