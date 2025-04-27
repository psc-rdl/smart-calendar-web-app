# Smart Calendar Web App 🗓️

A full-stack web application that helps users efficiently schedule their tasks into their existing Google Calendar using a smart scheduler. The app allows users to log in using Google OAuth, fetch their current calendar events, submit tasks and time estimates, and automatically insert optimized tasks into their calendar — powered by a Python scheduling algorithm.

---

## ✨ Features

- 🔐 **Google OAuth Sign-In** (via Passport.js)
- 📅 **Google Calendar API Integration**
- 📌 **Task Submission UI**
- 🧠 **Smart Scheduling via Python Script**
- 🌐 Full-stack with **React + TypeScript (frontend)** and **Node.js + Express + TypeScript (backend)**

---

## Team Members and Contributions:
Beck Edwards, Xinying Bi, and Colt Adams:
1. Formulated a mathematical Mixed Integer Program with Gurobi, and scheduling constraints allowing for realistic task-scheduling functionality.
2. Implemented compatibility for optimized tasks around a pre-existing calendar using object-oriented design and classes in Python.
3. Devised a notion of task priority, programming the model to encourage users to finish pressing tasks first.

Susanna Tang: Implemented frontend of the application using React.js + TypeScript and then created a FastAPI API encasing the optimizer.

Vinuth Gamage: Implemented backend of the application using Node.js, Express.js, and TypeScript, handling OAuth, routing, and other internal functionalities.

---
## How to use our application:
First, `git clone` our repo into a repository of your choice.
Then, navigate to the frontend folder of the repo and run `npm install`.
Navigate to the backend folder and do the same.

In one terminal, navigate to the backend folder and `npm run dev`.
In another, navigate to the frontend folder and `npm run dev`.

Once the backend connects, if you navigate to the localhost link of the frontend, you should be able to use the application.
Further functionality will be added, upon which this will be updated.
