import { ReactNode } from "react";

interface SidebarLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export default function SidebarLayout({ sidebar, children }: SidebarLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
     
      <aside className="lg:w-1/4 w-full bg-white dark:bg-zinc-900 border-r p-4">
        {sidebar}
      </aside>

      <main className="flex-1 p-4 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
