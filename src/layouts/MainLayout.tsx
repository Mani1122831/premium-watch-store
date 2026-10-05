import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ChatWidget from '../components/chat/ChatWidget';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-charcoal-900 antialiased selection:bg-gold-500 selection:text-white">
      <Header />
      <main className="flex-1 pt-24 sm:pt-28" id="main-content">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
