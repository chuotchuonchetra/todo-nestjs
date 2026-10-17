import React from 'react';
import { Search, X, CheckSquare, Square, Trash2, CheckCircle2, Clock, Star, Filter } from 'lucide-react';
import { CATEGORIES } from '../constants/initialData';

export default function TodoFilters({
  activeStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  starredOnly,
  onToggleStarredOnly,
  selectedCategory,
  onCategoryChange,
  statusCounts,
  selectedIds,
  totalVisibleCount,
  onSelectAll,
  onDeselectAll,
  onBulkStatusChange,
  onBulkDelete
}) {
  const isAllSelected = totalVisibleCount > 0 && selectedIds.length === totalVisibleCount;
  const hasSelection = selectedIds.length > 0;

  const STATUS_TABS = [
    { id: 'All', label: 'All', count: statusCounts.all },
    { id: 'To Do', label: 'To Do', count: statusCounts.todo },
    { id: 'In Progress', label: 'In Progress', count: statusCounts.progress },
    { id: 'Done', label: 'Done', count: statusCounts.done }
  ];

  return (
    <div className="flex flex-col gap-3.5">
      {/* Search and Category Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 flex items-center">
          <Search size={17} className="absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            className="w-full bg-white border border-slate-200/90 rounded-xl py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xs transition-all"
            placeholder="Search tasks by title..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filters Group (Category + Starred) */}
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          <div className="relative flex items-center flex-1 sm:flex-initial">
            <Filter size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full sm:w-auto bg-white border border-slate-200/90 rounded-xl py-2.5 pl-8 pr-4 text-xs font-semibold text-slate-700 focus:outline-none shadow-xs cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value} className="bg-white text-slate-800">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold shadow-xs transition-all ${
              starredOnly
                ? 'bg-amber-50 border-amber-300 text-amber-600'
                : 'bg-white border-slate-200/90 text-slate-600 hover:bg-slate-50'
            }`}
            onClick={onToggleStarredOnly}
            title="Filter by starred priority"
          >
            <Star size={15} fill={starredOnly ? 'currentColor' : 'none'} className={starredOnly ? 'text-amber-500' : ''} />
            <span>Starred</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs & Select All */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80 overflow-x-auto" role="tablist">
          {STATUS_TABS.map((tab) => {
            const isActive = activeStatus === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                onClick={() => onStatusChange(tab.id)}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {totalVisibleCount > 0 && (
          <button
            type="button"
            className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 py-1.5 px-3 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={isAllSelected ? onDeselectAll : onSelectAll}
          >
            {isAllSelected ? (
              <>
                <CheckSquare size={15} className="text-indigo-600" />
                <span>Deselect All</span>
              </>
            ) : (
              <>
                <Square size={15} />
                <span>Select All</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Floating Bulk Actions Bar */}
      {hasSelection && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl shadow-sm transition-all">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-extrabold">
              {selectedIds.length}
            </span>
            <span>selected tasks</span>
          </div>

          <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 hover:brightness-105 transition-all"
              onClick={() => onBulkStatusChange('To Do')}
              title="Move selected to To Do"
            >
              <Clock size={13} /> To Do
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200 hover:brightness-105 transition-all"
              onClick={() => onBulkStatusChange('In Progress')}
              title="Move selected to In Progress"
            >
              <Clock size={13} /> In Progress
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 hover:brightness-105 transition-all"
              onClick={() => onBulkStatusChange('Done')}
              title="Move selected to Done"
            >
              <CheckCircle2 size={13} /> Done
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200 hover:bg-rose-200 transition-all"
              onClick={onBulkDelete}
              title="Delete all selected tasks"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
