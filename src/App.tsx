import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TabType } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { CoinLab } from './pages/CoinLab';
import { DiceLab } from './pages/DiceLab';
import { CardLab } from './pages/CardLab';
import { StatisticsLab } from './pages/StatisticsLab';
import { About } from './pages/About';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 bg-grid-scientific">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {activeTab === 'home' && <Home setActiveTab={setActiveTab} />}
            {activeTab === 'coin' && <CoinLab />}
            {activeTab === 'dice' && <DiceLab />}
            {activeTab === 'cards' && <CardLab />}
            {activeTab === 'statistics' && <StatisticsLab />}
            {activeTab === 'about' && <About />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default App;
