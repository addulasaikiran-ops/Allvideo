import { Component } from 'react';
import styles from './ErrorBoundary.module.css';

export class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { this.props.onError?.(error, info); }
  render() {
    if (!this.state.error) return this.props.children;
    return <main className={styles.fallback} role="alert"><p className={styles.kicker}>A LITTLE MORE LIGHT</p><h1>We lost our place for a moment.</h1><p>Your story is safe. Try returning to the beginning.</p><button onClick={() => { this.setState({ error: null }); window.location.reload(); }}>Return to the story</button><details><summary>Technical details</summary><pre>{String(this.state.error?.message ?? this.state.error)}</pre></details></main>;
  }
}
