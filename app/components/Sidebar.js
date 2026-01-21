"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

const Icons = {
  Record: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
  ),
  Edit: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
  ),
  Summary: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
  )
};

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Record", href: "/record", icon: Icons.Record },
    { name: "Edit / Add", href: "/manage", icon: Icons.Edit },
    { name: "Summary", href: "/summary", icon: Icons.Summary },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>Attendance</div>
      <nav className={styles.nav}>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={styles.link + (isActive ? " " + styles.active : "")}
            >
              <span className={styles.icon}><Icon /></span>
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
