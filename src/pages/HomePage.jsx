import React from 'react';
import { Link } from 'react-router-dom';
import { useTutorials } from '../hooks/useTutorials';
import { useAuth } from '../hooks/useAuth';
import { CATEGORIES } from '../data/constants';
import TutorialGallery from '../components/TutorialGallery';
import styles from './HomePage.module.css';

export default function HomePage() {
  const { featuredTutorials, popularTutorials, allTutorials, getForYouTutorials } = useTutorials();
  const { currentUser, isAuthenticated } = useAuth();

  const getCategoryCount = (category) =>
    allTutorials.filter((t) => t.category === category).length;

  const forYouTutorials = isAuthenticated ? getForYouTutorials(currentUser.id) : [];

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Level Up Your{' '}
            <span className={styles.heroAccent}>Game Dev Skills</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Discover curated video tutorials for every aspect of game development.
            From 2D pixel art to 3D worlds, programming to sound design.
          </p>
          <div className={styles.heroActions}>
            <Link to="/search" className={styles.btnPrimary}>
              Browse Tutorials
            </Link>
            <Link to="/submit" className={styles.btnSecondary}>
              Share a Tutorial
            </Link>
          </div>
        </div>
      </section>

      {/* For You Section */}
      {isAuthenticated && forYouTutorials.length > 0 && (
        <section className={styles.section}>
          <TutorialGallery
            tutorials={forYouTutorials}
            title="For You"
            subtitle="Based on tags you follow"
          />
        </section>
      )}

      {/* Featured Section */}
      <section className={styles.section}>
        <TutorialGallery
          tutorials={featuredTutorials}
          title="Featured Tutorials"
          subtitle="Hand-picked tutorials to accelerate your learning"
          viewAllLink="/search"
        />
      </section>

      {/* Categories */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Browse by Category</h2>
        <div className={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              to={`/category/${cat.value}`}
              className={styles.categoryCard}
            >
              <span className={styles.categoryCardIcon}>{cat.icon}</span>
              <span className={styles.categoryCardLabel}>{cat.label}</span>
              <span className={styles.categoryCardCount}>
                {getCategoryCount(cat.value)} tutorials
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Section */}
      <section className={styles.section}>
        <TutorialGallery
          tutorials={popularTutorials}
          title="Most Popular"
          subtitle="Trending tutorials loved by the community"
          viewAllLink="/search"
        />
      </section>
    </div>
  );
}
