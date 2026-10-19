import { Button } from '../design-system.jsx';
import styles from './Screens.module.css';
export default function ErrorScreen({message='Something went wrong',onRetry,onClose}) { return <main className={styles.screen} role="alert"><header className={styles.header}><p className={styles.kicker}>A LITTLE DETOUR</p><h1>We lost our place.</h1><p>{message}</p></header><div className={styles.actions}><Button variant="secondary" onClick={onClose}>Back</Button><Button onClick={onRetry}>Try again</Button></div></main>; }
