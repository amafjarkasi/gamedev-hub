import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../ThemeToggle';
import styles from './Header.module.css';

export default function Header() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { theme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;

  const navItems = (
    <>
      <NavLink to="/" className={navLinkClass} onClick={() => setMobileOpen(false)} end>
        Home
      </NavLink>
      <NavLink to="/search" className={navLinkClass} onClick={() => setMobileOpen(false)}>
        Browse
      </NavLink>
      <NavLink to="/submit" className={navLinkClass} onClick={() => setMobileOpen(false)}>
        Submit
      </NavLink>
    </>
  );

  const authSection = isAuthenticated ? (
    <div className={styles.userMenu}>
      <Link
        to="/profile"
        className={styles.userAvatar}
        onClick={() => setMobileOpen(false)}
        title="Profile"
      >
        {currentUser.avatarUrl ? (
          <img src={currentUser.avatarUrl} alt={currentUser.displayName} />
        ) : (
          currentUser.displayName.charAt(0).toUpperCase()
        )}
      </Link>
      <span className={styles.userName}>{currentUser.displayName}</span>
      <button onClick={handleLogout} className={styles.btnLogout}>
        Logout
      </button>
    </div>
  ) : (
    <div className={styles.authButtons}>
      <Link
        to="/login"
        className={styles.btnLogin}
        onClick={() => setMobileOpen(false)}
      >
        Log In
      </Link>
      <Link
        to="/register"
        className={styles.btnSignup}
        onClick={() => setMobileOpen(false)}
      >
        Sign Up
      </Link>
    </div>
  );

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>&#x1F3AE;</span>
          <span className={styles.logoText}>
            GameDev<span className={styles.logoAccent}>Hub</span>
          </span>
        </Link>

        <nav className={styles.nav}>
          <ThemeToggle />
          {navItems}
        </nav>

        {/* Desktop auth */}
        <div className={styles.authButtons} style={{ display: undefined }}>
          <ThemeToggle />
          {authSection}
        </div>

        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? '\u2715' : '\u2630'}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ''}`}
      >
        <ThemeToggle />
        {navItems}
        {authSection}
      </div>
    </header>
  );
}
