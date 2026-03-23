import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.page}>
      <span className={styles.code}>404</span>
      <h1 className={styles.heading}>Page Not Found</h1>
      <p className={styles.message}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className={styles.actions}>
        <Link to="/" className={styles.homeBtn}>
          Go Home
        </Link>
        <Link to="/search" className={styles.browseLink}>
          Browse Tutorials
        </Link>
      </div>
    </div>
  );
}
