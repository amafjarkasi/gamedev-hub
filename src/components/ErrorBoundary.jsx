import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reportError } from '../utils/analytics';
import styles from './ErrorBoundary.module.css';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Report to Sentry/analytics
    reportError(error, {
      component: 'ErrorBoundary',
      ...errorInfo,
    });
  }

  handleReset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <span className={styles.icon}>&#x26A0;</span>
          <h1 className={styles.heading}>Something went wrong</h1>
          <p className={styles.message}>
            An unexpected error occurred. You can try again or return to the home page.
          </p>
          {this.state.error && (
            <pre className={styles.errorDetail}>
              {this.state.error.message}
            </pre>
          )}
          <div className={styles.actions}>
            <button className={styles.retryBtn} onClick={this.handleReset}>
              Try Again
            </button>
            <a href="/" className={styles.homeLink}>
              Go Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
