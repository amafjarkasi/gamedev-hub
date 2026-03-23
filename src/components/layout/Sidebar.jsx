import React, { useState } from 'react';
import styles from './Sidebar.module.css';

export default function Sidebar({ children, filterCount }) {
  const [open, setOpen] = useState(false);

  return (
    <aside className={styles.sidebar}>
      <button
        className={`${styles.sidebarToggle} ${open ? styles.toggleOpen : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span>Filters{filterCount > 0 ? ` (${filterCount})` : ''}</span>
        <span>{open ? '\u25B2' : '\u25BC'}</span>
      </button>
      <div
        className={`${styles.sidebarContent} ${open ? styles.sidebarContentOpen : ''}`}
      >
        {children}
      </div>
    </aside>
  );
}
