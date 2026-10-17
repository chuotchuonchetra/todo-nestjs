import React, { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import Header from "./components/Header";
import StatsBar from "./components/StatsBar";
import TodoForm from "./components/TodoForm";
import TodoFilters from "./components/TodoFilters";
import TodoList from "./components/TodoList";
import Toast from "./components/Toast";
import { INITIAL_TODOS, INITIAL_USER } from "./constants/initialData";

export default function App() {
  // Todos local state
  const [todos, setTodos] = useState(() => {
    try {
      const savedTodos = localStorage.getItem("flowtask_todos");
      return savedTodos ? JSON.parse(savedTodos) : INITIAL_TODOS;
    } catch {
      return INITIAL_TODOS;
    }
  });

  // User profile local state
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("flowtask_user");
      return savedUser ? JSON.parse(savedUser) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // Filter & Search states
  const [activeStatus, setActiveStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [starredOnly, setStarredOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Multi-selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // Toast feedback state
  const [toast, setToast] = useState(null);

  // Enforce light mode on mount
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem("flowtask_theme");
  }, []);

  // Sync todos to localStorage
  useEffect(() => {
    localStorage.setItem("flowtask_todos", JSON.stringify(todos));
  }, [todos]);

  // Sync profile to localStorage
  useEffect(() => {
    localStorage.setItem("flowtask_user", JSON.stringify(user));
  }, [user]);

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
  const handleSaveUser = (updatedUser) => {
    setUser(updatedUser);
    showToast("Profile updated.");
  };

  const handleResetDemo = () => {
    setTodos(INITIAL_TODOS);
    setUser(INITIAL_USER);
    setSelectedIds([]);
    showToast("Demo data restored.", "info");
  };

  // --- CRUD Operations ---

  // 1. Create
  const handleAddTodo = (newTodoData) => {
    const newTodo = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...newTodoData,
      createdAt: new Date().toISOString(),
    };

    setTodos((prev) => [newTodo, ...prev]);
    showToast(`Task "${newTodo.title}" created!`);

    if (newTodo.status === "Done") {
      triggerCelebration();
    }
  };

  // 2. Update (Title, Status, Priority, Category, etc.)
  const handleUpdateTodo = (id, updates, clickCoords) => {
    setTodos((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          if (item.status !== "Done" && updates.status === "Done") {
            if (clickCoords) {
              triggerCelebration(clickCoords.x, clickCoords.y);
            } else {
              triggerCelebration();
            }
            showToast(`Task completed! 🎉`);
          } else if (updates.title && updates.title !== item.title) {
            showToast(`Task updated successfully.`);
          } else if (updates.status && updates.status !== item.status) {
            showToast(`Status changed to "${updates.status}".`);
          }
          return updated;
        }
        return item;
      }),
    );
  };

  // 3. Delete
  const handleDeleteTodo = (id) => {
    setTodos((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    showToast(`Task deleted.`, "info");
  };

  // 4. Toggle Star
  const handleToggleStar = (id) => {
    setTodos((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStarred = !item.starred;
          showToast(
            newStarred ? `Task starred as priority ⭐` : `Star removed`,
            "info",
          );
          return { ...item, starred: newStarred };
        }
        return item;
      }),
    );
  };

  // 5. Reorder (Drag & Drop)
  const handleReorderTodos = (reorderedList) => {
    setTodos(reorderedList);
    showToast(`Tasks reordered.`);
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

  const handleBulkStatusChange = (newStatus) => {
    if (selectedIds.length === 0) return;

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
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    if (
      window.confirm(`Are you sure you want to delete ${count} selected tasks?`)
    ) {
      setTodos((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
      setSelectedIds([]);
      showToast(`Deleted ${count} tasks.`, "danger");
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
