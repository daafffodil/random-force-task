# PRD — Random Force Task

## Product Name

Random Force Task

## Product Type

Gamified task execution tool.

Users create tasks that become colorful balls.
Clicking **"Do Task"** randomly selects one ball and forces the user to complete it.

---

# Product Goal

Help users start tasks faster by removing decision fatigue.

Instead of choosing tasks, users **draw a random task ball** and execute it with a countdown.

The experience should feel playful, lightweight, and motivating.

---

# Core User Flow

Create Task
→ Task becomes a ball in the task pool
→ User clicks **Do Task**
→ System randomly selects one ball
→ Fullscreen task execution mode
→ Countdown timer runs
→ Task completes
→ Ball moves to **Collection Box**

---

# Core Pages

The product contains **three main views**.

## 1 Home — Task Pool

This page displays all pending task balls.

Features:

* Create task
* View task balls
* Start random task

UI Components:

* Navbar
* Task input form
* Task ball area
* Do Task button

Task Ball Rules:

* Color: random
* Size: related to duration
* Status: pending

---

## 2 Execution Mode (Fullscreen)

Triggered when a task is selected.

Features:

* Fullscreen task card
* Task title
* Countdown timer
* Background color = task color

Behavior:

* Timer runs automatically
* When timer ends → task completes

Optional:

* Abandon task button

---

## 3 Collection Box

Displays all completed tasks.

Features:

* Completed task balls
* Total completed tasks
* Total completed duration

Balls should visually appear **stacked or collected**.

---

# Task Data Model

Each task should include:

```
id
title
duration (minutes)
color
size
status (pending | active | done)
created_at
completed_at
```

---

# Task Status Logic

```
Create task → pending

pending → active
(when randomly selected)

active → done
(timer finished)

active → pending
(user abandons)
```

Only **one active task at a time**.

---

# Ball Size Logic

Size increases with task duration.

Example mapping:

1-10 minutes → small
11-25 → medium-small
26-45 → medium
46-90 → large
90+ → extra large

---

# Random Selection Logic

When user clicks **Do Task**:

1. Filter tasks where status = pending
2. Randomly pick one
3. Set status = active
4. Open fullscreen execution mode

---

# Timer Rules

Duration is stored in minutes.

Timer converts to seconds.

Example:

25 minutes → 1500 seconds

Timer updates every second.

When timer reaches 0:

* status becomes done
* completed_at saved

---

# Statistics

Collection page shows:

* Total completed tasks
* Total minutes completed

---

# Backend Requirements

Use **Supabase**.

Tables required:

tasks

Columns:

id
title
duration
color
size
status
created_at
completed_at

---

# Frontend Stack

Next.js
React
TypeScript
Tailwind CSS

---

# Deployment

Frontend → Vercel
Backend → Supabase

---

# Key UX Principles

The experience must feel:

* Random
* Playful
* Light
* Motivating

The two most important moments are:

1. **Random task draw**
2. **Task completion**

Both should have satisfying visual feedback.
