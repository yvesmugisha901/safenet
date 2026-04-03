# SafeNet Frontend

## Project Overview
SafeNet is a Smart Community Resource & Emergency Management Platform.  
The frontend is built with **React.js + TypeScript** and provides a user-friendly interface for:

- Reporting emergencies
- Viewing nearby community resources
- Receiving real-time notifications
- Accessing dashboards for analytics

This frontend communicates with the backend via REST APIs and WebSockets for real-time updates.

---

## Key Features
- **Emergency Reporting Form** – users can report emergencies instantly.
- **Real-time Notifications** – updates via WebSockets, in-app alerts, SMS, and email.
- **Resource Dashboard** – view nearby resources, availability, and distance.
- **Analytics** – charts and dashboards showing trends and response times.
- **Offline Mode** – users can submit emergencies even without internet; data syncs later.
- **Role-based UI** – different interfaces for Users, Resource Managers, and Admins.

---

## Technology Stack
- **Framework**: React.js with TypeScript
- **UI Library**: Tailwind CSS 
- **Realtime Updates**: Socket.io (WebSockets)
- **Maps & Routing**: Google Maps API
- **Build Tools**: Vite / React Scripts

---


### 1. Install Dependencies
```bash
npm install
