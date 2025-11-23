
# Chat App Frontend (Next.js)

This is the frontend for my real-time chat application. It is built using Next.js, React, Tailwind CSS, and Socket.io.
The frontend communicates with a NestJS backend and supports real-time chat, message deletion, typing indicators, and message seen status.

The goal of this project is to create a simple, modern chat interface similar to WhatsApp, but built from scratch with full control over the code.



## Getting Started

### 1. Install dependencies

After downloading or cloning the project, run:

```
npm install
```

or

```
yarn install
```

### 2. Start the development server

```
npm run dev
```

The app usually runs on [http://localhost:3000](http://localhost:3000) or [http://localhost:3001](http://localhost:3001) depending on your machine.



## Backend Requirement

This frontend needs the backend running to work correctly.

Expected backend URL:

```
http://localhost:3000
```

Socket.io is also expected to run at the same port on the path:

```
/socket.io
```

A valid JWT token must be stored in the browser's localStorage after logging in.
If no token is found, the user will be redirected to the login page.

---

## Technologies Used

**Next.js** – Frontend framework
**React** – Component logic
**Tailwind CSS** – Styling
**Socket.io Client** – Real-time messaging
**Axios** – API communication
**Zustand** – Global state for authentication



## Project Structure

```
app/
  login/
  chats/
  layout.tsx
  page.tsx

lib/
  axios.ts
  socket.ts

store/
  authStore.ts

styles/
  globals.css
```



## Features

* Real-time messaging using Socket.io
* Sending and receiving messages without refreshing
* "Seen" message indicators
* Typing indicator
* Delete message (for everyone or only for me)
* Basic media message support
* Clean two-column chat layout (users left, chat right)



## Assumptions

1. The backend API routes match these:

   * POST /auth/login
   * GET /users
   * POST /chats/create
   * GET /messages?chatId=
   * POST /messages/send-encrypted
   * POST /messages/delete
   * POST /messages/edit

2. The backend handles JWT validation.

3. The backend returns messages with a unique MongoDB `_id`.

4. The frontend receives real-time events from Socket.io.



## Limitations

* There is no theme switch (only dark mode UI).
* Media upload is basic and can be improved.
* No group chat support yet.
* No emoji picker or message reactions.
* Not optimized for mobile browsers.



## Build for Production

```
npm run build
npm run start
```


