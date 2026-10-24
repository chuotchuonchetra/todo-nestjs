import React, { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import Header from "./components/Header";
import StatsBar from "./components/StatsBar";
import TodoForm from "./components/TodoForm";
import TodoFilters from "./components/TodoFilters";
import TodoList from "./components/TodoList";
import Toast from "./components/Toast";
import { api } from "./api";

export default function App() {
  // Server data
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Filter & Search states
  const [activeStatus, setActiveStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [starredOnly, setStarredOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Multi-selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // Toast feedback state
  const [toast, setToast] = useState(null);

  // Enforce light mode on mount and drop data left over from the localStorage version
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.removeAttribute("data-theme");
    ["flowtask_theme", "flowtask_todos", "flowtask_user"].forEach((key) =>
      localStorage.removeItem(key),
    );
  }, []);

  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      // the profile is optional: the server may not expose /user (yet)
      const [loadedTodos, loadedUser] = await Promise.all([
        api.getTodos(),
        api.getUser().catch(() => null),
      ]);
      setTodos(loadedTodos);
      setUser(loadedUser);
    } catch (e) {
      setLoadError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Load todos & profile from the API
  useEffect(() => {
    loadData();
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const showError = (e) =>
    showToast(e.message || "Something went wrong.", "danger");

  const triggerCelebration = (x, y) => {
    try {
      const origin =
        x !== undefined && y !== undefined && window.innerWidth > 0 && window.innerHeight > 0
          ? { x: Math.max(0.1, Math.min(0.9, x / window.innerWidth)), y: Math.max(0.1, Math.min(0.9, y / window.innerHeight)) }
          : { x: 0.5, y: 0.65 };

      confetti({
        particleCount: 65,
        spread: 70,
        startVelocity: 35,
        origin,
        zIndex: 99999,
        colors: ["#6366f1", "#10b981", "#3b82f6", "#f59e0b", "#ec4899"],
        disableForReducedMotion: true,
      });
    } catch (e) {
      // Ignore if confetti fails
    }
  };

  // --- Profile ---
  const handleSaveUser = async (updatedUser) => {
    try {
      setUser(await api.saveUser(updatedUser));
      showToast("Profile updated.");
    } catch (e) {
      showError(e);
    }
  };

  const handleResetDemo = async () => {
    try {
      const { todos: demoTodos, user: demoUser } = await api.resetDemo();
      setTodos(demoTodos);
      setUser(demoUser);
      setSelectedIds([]);
      showToast("Demo data restored.", "info");
    } catch (e) {
      showError(e);
    }
  };

  // --- CRUD Operations ---

  // 1. Create
  const handleAddTodo = async (newTodoData) => {
    try {
      const newTodo = await api.createTodo(newTodoData);
      setTodos((prev) => [newTodo, ...prev]);
      showToast(`Task "${newTodo.title}" created!`);

      if (newTodo.status === "Done") {
        triggerCelebration();
      }
    } catch (e) {
      showError(e);
    }
  };

  // 2. Update (Title, Status, Priority, Category, etc.)
  const handleUpdateTodo = async (id, updates, clickCoords) => {
    const item = todos.find((t) => t.id === id);
    if (!item) return;

    // optimistic update, rolled back if the request fails
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));

    try {
      const saved = await api.updateTodo(id, updates);
      setTodos((prev) => prev.map((t) => (t.id === id ? saved : t)));

      if (item.status !== "Done" && updates.status === "Done") {
        triggerCelebration(clickCoords?.x, clickCoords?.y);
        showToast(`Task completed! 🎉`);
      } else if (updates.title && updates.title !== item.title) {
        showToast(`Task updated successfully.`);
      } else if (updates.status && updates.status !== item.status) {
        showToast(`Status changed to "${updates.status}".`);
      }
    } catch (e) {
      setTodos((prev) => prev.map((t) => (t.id === id ? item : t)));
      showError(e);
    }
  };

  // 3. Delete
  const handleDeleteTodo = async (id) => {
    try {
      await api.deleteTodo(id);
      setTodos((prev) => prev.filter((item) => item.id !== id));
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
      showToast(`Task deleted.`, "info");
    } catch (e) {
      showError(e);
    }
  };

  // 4. Toggle Star
  const handleToggleStar = async (id) => {
    const item = todos.find((t) => t.id === id);
    if (!item) return;
    const starred = !item.starred;

    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, starred } : t)));

    try {
      await api.updateTodo(id, { starred });
      showToast(
        starred ? `Task starred as priority ⭐` : `Star removed`,
        "info",
      );
    } catch (e) {
      setTodos((prev) => prev.map((t) => (t.id === id ? item : t)));
      showError(e);
    }
  };

  // 5. Reorder (Drag & Drop)
  // `reorderedList` may be a filtered subset: its items take the slots the
  // subset already occupies, so hidden tasks keep their place.
  const handleReorderTodos = async (reorderedList) => {
    const previous = todos;
    const reorderedIds = new Set(reorderedList.map((t) => t.id));
    let next = 0;
    setTodos(
      todos.map((t) => (reorderedIds.has(t.id) ? reorderedList[next++] : t)),
    );

    try {
      await api.reorderTodos(reorderedList.map((t) => t.id));
      showToast(`Tasks reordered.`);
    } catch (e) {
      setTodos(previous);
      showError(e);
    }
  };

  // --- Bulk Operations ---

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAllVisible = () => {
    setSelectedIds(filteredTodos.map((t) => t.id));
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleBulkStatusChange = async (newStatus) => {
    if (selectedIds.length === 0) return;

    try {
      await api.bulkStatus(selectedIds, newStatus);
      setTodos((prev) =>
        prev.map((item) =>
          selectedIds.includes(item.id) ? { ...item, status: newStatus } : item,
        ),
      );

      showToast(`Updated ${selectedIds.length} tasks to "${newStatus}"!`);
      if (newStatus === "Done") {
        triggerCelebration();
      }
      setSelectedIds([]);
    } catch (e) {
      showError(e);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    if (
      window.confirm(`Are you sure you want to delete ${count} selected tasks?`)
    ) {
      try {
        await api.bulkDelete(selectedIds);
        setTodos((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
        setSelectedIds([]);
        showToast(`Deleted ${count} tasks.`, "danger");
      } catch (e) {
        showError(e);
      }
    }
  };

  // --- Filtering & Searching Logic ---

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // Status Filter
      if (activeStatus === "Starred") {
        if (!todo.starred) return false;
      } else if (activeStatus !== "All" && todo.status !== activeStatus) {
        return false;
      }

      // Starred-only quick toggle
      if (starredOnly && !todo.starred) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "All" && todo.category !== selectedCategory) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = todo.title.toLowerCase().includes(query);
        const matchesDesc = todo.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      return true;
    });
  }, [todos, activeStatus, starredOnly, selectedCategory, searchQuery]);

  // Status Counts
  const statusCounts = useMemo(() => {
    return {
      all: todos.length,
      todo: todos.filter((t) => t.status === "To Do").length,
      progress: todos.filter((t) => t.status === "In Progress").length,
      done: todos.filter((t) => t.status === "Done").length,
    };
  }, [todos]);

  const hasActiveFilters =
    activeStatus !== "All" ||
    searchQuery.trim() !== "" ||
    starredOnly ||
    selectedCategory !== "All";

  const handleClearFilters = () => {
    setActiveStatus("All");
    setSearchQuery("");
    setStarredOnly(false);
    setSelectedCategory("All");
  };

  if (loading || loadError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 text-center">
        {loadError ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-slate-700">
              Could not reach the server: {loadError}
            </p>
            <button
              onClick={loadData}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Loading your tasks…</p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-6">
        <Header user={user} onSaveUser={handleSaveUser} onResetDemo={handleResetDemo} />

        {/* Main Workspace */}
        <main className="flex flex-col gap-6">
          {/* Productivity Stats & Progress */}
          <StatsBar
            todos={todos}
            onFilterSelect={(filter) => {
              setActiveStatus(filter);
            }}
            activeFilter={activeStatus}
          />

          {/* Create Todo Form */}
          <section>
            <TodoForm onAddTodo={handleAddTodo} />
          </section>

          {/* Filtering, Search & Bulk Actions */}
          <section className="flex flex-col gap-4">
            <TodoFilters
              activeStatus={activeStatus}
              onStatusChange={setActiveStatus}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              starredOnly={starredOnly}
              onToggleStarredOnly={() => setStarredOnly(!starredOnly)}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              statusCounts={statusCounts}
              selectedIds={selectedIds}
              totalVisibleCount={filteredTodos.length}
              onSelectAll={handleSelectAllVisible}
              onDeselectAll={handleDeselectAll}
              onBulkStatusChange={handleBulkStatusChange}
              onBulkDelete={handleBulkDelete}
            />

            {/* Todo List with Drag & Drop */}
            <TodoList
              todos={filteredTodos}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onUpdateTodo={handleUpdateTodo}
              onDeleteTodo={handleDeleteTodo}
              onToggleStar={handleToggleStar}
              onReorderTodos={handleReorderTodos}
              onClearFilters={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </section>
        </main>

        {/* App Footer */}
        <footer className="text-center py-6 text-xs text-slate-400">
          <p>FlowTask — Built with React & Tailwind CSS (Light Mode)</p>
        </footer>
      </div>
    </div>
  );
}
