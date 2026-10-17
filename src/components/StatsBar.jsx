import React from 'react';
import { CheckCircle2, Clock, ListTodo, Star, TrendingUp } from 'lucide-react';

export default function StatsBar({ todos, onFilterSelect, activeFilter }) {
  const total = todos.length;
  const todoCount = todos.filter((t) => t.status === 'To Do').length;
  const progressCount = todos.filter((t) => t.status === 'In Progress').length;
  const doneCount = todos.filter((t) => t.status === 'Done').length;
  const starredCount = todos.filter((t) => t.starred).length;
  const percentage = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col gap-4.5">
      {/* Top Header & Progress */}
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <TrendingUp size={18} className="text-indigo-600" />
            <span>Productivity Overview</span>
          </div>
          <div className="text-xs text-slate-600">
            <strong className="text-indigo-600 font-extrabold text-sm mr-1">
              {percentage}%
            </strong>
            Completed
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden" title={`${percentage}% tasks completed`}>
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {/* Total */}
        <div
          className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
            activeFilter === 'All'
              ? 'bg-indigo-50/80 border-indigo-400 shadow-sm'
              : 'bg-slate-50/80 border-slate-200/70 hover:bg-slate-100/90'
          }`}
          onClick={() => onFilterSelect('All')}
          role="button"
          tabIndex={0}
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <ListTodo size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-slate-900 leading-none">
              {total}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 mt-0.5">
              Total
            </span>
          </div>
        </div>

        {/* To Do */}
        <div
          className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
            activeFilter === 'To Do'
              ? 'bg-blue-50/80 border-blue-400 shadow-sm'
              : 'bg-slate-50/80 border-slate-200/70 hover:bg-slate-100/90'
          }`}
          onClick={() => onFilterSelect('To Do')}
          role="button"
          tabIndex={0}
        >
          <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Clock size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-slate-900 leading-none">
              {todoCount}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 mt-0.5">
              To Do
            </span>
          </div>
        </div>

        {/* In Progress */}
        <div
          className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
            activeFilter === 'In Progress'
              ? 'bg-purple-50/80 border-purple-400 shadow-sm'
              : 'bg-slate-50/80 border-slate-200/70 hover:bg-slate-100/90'
          }`}
          onClick={() => onFilterSelect('In Progress')}
          role="button"
          tabIndex={0}
        >
          <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Clock size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-slate-900 leading-none">
              {progressCount}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 mt-0.5">
              In Progress
            </span>
          </div>
        </div>

        {/* Done */}
        <div
          className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
            activeFilter === 'Done'
              ? 'bg-emerald-50/80 border-emerald-400 shadow-sm'
              : 'bg-slate-50/80 border-slate-200/70 hover:bg-slate-100/90'
          }`}
          onClick={() => onFilterSelect('Done')}
          role="button"
          tabIndex={0}
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-slate-900 leading-none">
              {doneCount}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 mt-0.5">
              Done
            </span>
          </div>
        </div>

        {/* Starred */}
        <div
          className={`col-span-2 sm:col-span-1 flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
            activeFilter === 'Starred'
              ? 'bg-amber-50/80 border-amber-400 shadow-sm'
              : 'bg-slate-50/80 border-slate-200/70 hover:bg-slate-100/90'
          }`}
          onClick={() => onFilterSelect('Starred')}
          role="button"
          tabIndex={0}
        >
          <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-500 flex items-center justify-center flex-shrink-0">
            <Star size={18} fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-slate-900 leading-none">
              {starredCount}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 mt-0.5">
              Starred
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
