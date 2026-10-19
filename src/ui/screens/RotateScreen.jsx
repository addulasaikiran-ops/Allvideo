import { Button } from '../design-system.jsx';
import styles from './Screens.module.css';
export default function RotateScreen({onClose}) { return <main className={styles.screen}><header className={styles.header}><p className={styles.kicker}>A LITTLE MORE ROOM</p><div aria-hidden="true" style={{fontSize:'5rem'}}>▱ ↻</div><h1>Turn your device</h1><p>Rotate to landscape for a wider view of the world, or keep playing as you are.</p></header><Button onClick={onClose}>Keep playing</Button></main>; }
