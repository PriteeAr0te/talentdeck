'use client';

import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import clsx from "clsx";

interface SidebarLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export default function SidebarLayout({ sidebar, children }: SidebarLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <div className="flex flex-col lg:flex-row h-full w-full relative">

      <aside className="hidden lg:block lg:w-1/4 bg-[#E5D6F0] dark:bg-sidebar border-r max-h-[100vh-64px] p-4 overflow-y-auto pb-14">
        {sidebar}
      </aside>

      <div className="lg:hidden flex justify-start p-4">
        <button
          onClick={toggleDrawer}
          className="bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-secondary transition duration-200"
        >
          Filter
        </button>
      </div>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className={clsx(
                "fixed top-0 left-0 z-50 h-full w-4/5 max-w-sm bg-[#E5D6F0] dark:bg-sidebar p-4 shadow-lg border-r animate__animated animate__fadeIn",
              )}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Filters</h2>
                <button onClick={closeDrawer} className="text-black dark:text-white">
                  <X size={24} />
                </button>
              </div>
              {sidebar}
            </motion.aside>

            <motion.div
              className="fixed inset-0 z-40 bg-black/50 animate__animated animate__fadeIn"
              onClick={closeDrawer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 p-4 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
