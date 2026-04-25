import React from 'react';
import useTutorStore from '../store/useTutorStore';
import Navbar from '../components/UI/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import ChatWindow from '../components/Chat/ChatWindow';

export default function TutorPage() {
  const { isSidebarOpen } = useTutorStore();

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Navbar />
        <ChatWindow />
      </div>
    </div>
  );
}
