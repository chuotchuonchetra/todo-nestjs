export const INITIAL_USER = {
  username: "alexmorgan",
  displayName: "Alex Morgan",
  title: "Senior Product Engineer",
  email: "alex.morgan@flowtask.io",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
  bio: "Building high-impact product experiences with clean code and thoughtful design."
};

export const INITIAL_TODOS = [
  {
    id: "task-1",
    title: "Design intuitive onboarding flow for new users",
    description: "Prepare wireframes and user interaction states in Figma",
    status: "In Progress",
    priority: "High",
    category: "Design",
    starred: true,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: "task-2",
    title: "Implement local state CRUD operations for Todo list",
    description: "Support create, read, edit title & status, delete with instant feedback",
    status: "Done",
    priority: "High",
    category: "Development",
    starred: true,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: "task-3",
    title: "Add drag-and-drop task reordering capability",
    description: "Allow fluid rearranging of todos with native HTML5 drag and drop",
    status: "Done",
    priority: "Medium",
    category: "Feature",
    starred: false,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: "task-4",
    title: "Refactor profile drawer and user settings panel",
    description: "Provide customizable username, avatar, and quick demo reset",
    status: "In Progress",
    priority: "Medium",
    category: "Feature",
    starred: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: "task-5",
    title: "Prepare sprint demo presentation for stakeholders",
    description: "Record walkthrough video and summarize key metrics",
    status: "To Do",
    priority: "High",
    category: "Management",
    starred: true,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "task-6",
    title: "Audit responsive layout on mobile screens",
    description: "Test touch targets and viewport handling across iOS & Android browsers",
    status: "To Do",
    priority: "Low",
    category: "QA",
    starred: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

export const CATEGORIES = [
  { label: "All Categories", value: "All" },
  { label: "Design", value: "Design" },
  { label: "Development", value: "Development" },
  { label: "Feature", value: "Feature" },
  { label: "Management", value: "Management" },
  { label: "QA", value: "QA" },
  { label: "Personal", value: "Personal" }
];

export const STATUS_OPTIONS = [
  { value: "To Do", label: "To Do" },
  { value: "In Progress", label: "In Progress" },
  { value: "Done", label: "Done" }
];

export const PRIORITY_OPTIONS = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" }
];
