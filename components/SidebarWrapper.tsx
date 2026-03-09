"use client";

import { Sidebar } from "./Sidebar";

export function SidebarWrapper({ isDesktop }: { isDesktop: boolean }) {
  return <Sidebar isOpen={isDesktop} onToggle={() => {}} />;
}
