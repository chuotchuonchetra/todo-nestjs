---
name: post-action-summary
description: Forces the AI agent to output a detailed summary of all actions, edits, and terminal commands executed after finishing a task.
trigger: automatic
---

# Post-Action Summary Rule

Whenever you complete a coding task, refactoring, bug fix, or command execution, you **MUST** conclude your response with a structured execution summary block.

Do not skip this summary, even for minor edits or single-line fixes.

---

### 📋 What Was Executed

#### 1. Files & Code Changed

- List every file created, modified, or deleted.
- Briefly state the specific changes made per file (e.g., functions added, imports updated).

#### 2. Terminal Commands & Tests

- List any terminal commands executed (e.g., `npm test`, `git status`, `build`).
- Mention the result or exit status of those commands.

#### 3. Core Decisions & Edge Cases

- Briefly highlight any technical trade-offs, assumptions, or safety checks performed.

#### 4. Final Deliverable / Outcome

- State the final status of the requested feature or fix.
