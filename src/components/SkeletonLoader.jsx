import styles from './SkeletonLoader.module.css';

export default function SkeletonLoader({ variant = 'card', width, height }) {
  if (variant === 'card') {
    return (
      <div className={styles.card} style={{ width, height }}>
        <div className={styles.cardImage} />
        <div className={styles.cardContent}>
          <div className={styles.cardTitle} />
          <div className={styles.cardText} />
          <div className={styles.cardMeta} />
        </div>
      </div>
    );
  }

  if (variant === 'text') {
    return <div className={styles.text} style={{ width, height }} />;
  }

  if (variant === 'thumbnail') {
    return <div className={styles.thumbnail} style={{ width, height }} />;
  }

  if (variant === 'avatar') {
    return <div className={styles.avatar} style={{ width, height }} />;
  }

  return null;
}
