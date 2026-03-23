import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <div className={styles.footerLogo}>
            GameDev<span className={styles.footerLogoAccent}>Hub</span>
          </div>
          <p className={styles.footerDesc}>
            Your one-stop destination for game development tutorials.
            Learn, share, and grow with a community of game creators.
          </p>
        </div>

        <div className={styles.footerSection}>
          <h4>Browse</h4>
          <Link to="/search" className={styles.footerLink}>All Tutorials</Link>
          <Link to="/category/2D" className={styles.footerLink}>2D Development</Link>
          <Link to="/category/3D" className={styles.footerLink}>3D Development</Link>
          <Link to="/category/Programming" className={styles.footerLink}>Programming</Link>
        </div>

        <div className={styles.footerSection}>
          <h4>Categories</h4>
          <Link to="/category/Art" className={styles.footerLink}>Art & Design</Link>
          <Link to="/category/Audio" className={styles.footerLink}>Audio & Music</Link>
          <Link to="/category/Game Design" className={styles.footerLink}>Game Design</Link>
          <Link to="/submit" className={styles.footerLink}>Submit Tutorial</Link>
        </div>

        <div className={styles.footerSection}>
          <h4>Community</h4>
          <Link to="/register" className={styles.footerLink}>Join Us</Link>
          <Link to="/login" className={styles.footerLink}>Sign In</Link>
          <Link to="/profile" className={styles.footerLink}>Your Profile</Link>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <span className={styles.footerCopy}>
          &copy; {new Date().getFullYear()} GameDevHub. Built for game creators.
        </span>
      </div>
    </footer>
  );
}
