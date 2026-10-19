import { useEffect, useState } from 'react';

export function PWAControls() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [updateReady, setUpdateReady] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    let disposed = false;
    let registration;
    const onBeforeInstall = (event) => { event.preventDefault(); setInstallPrompt(event); };
    const onInstalled = () => { setInstalled(true); setInstallPrompt(null); };
    const onControllerChange = () => window.location.reload();
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js').then((value) => {
        if (disposed) return;
        registration = value;
        if (registration.waiting && navigator.serviceWorker.controller) setUpdateReady(true);
        registration.addEventListener('updatefound', () => {
          const worker = registration.installing;
          worker?.addEventListener('statechange', () => { if (worker.state === 'installed' && navigator.serviceWorker.controller) setUpdateReady(true); });
        });
      }).catch(() => {});
      navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    }
    return () => {
      disposed = true;
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
      navigator.serviceWorker?.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  const install = async () => { if (installPrompt) { await installPrompt.prompt(); await installPrompt.userChoice; setInstallPrompt(null); } };
  const applyUpdate = async () => { const registration = await navigator.serviceWorker?.getRegistration('/'); registration?.waiting?.postMessage({ type: 'SKIP_WAITING' }); setUpdateReady(false); };
  if (!installPrompt && !updateReady && !installed) return null;
  return <aside aria-live="polite" style={{ position: 'fixed', zIndex: 1000, insetInline: '1rem', bottom: '1rem', marginInline: 'auto', maxWidth: '34rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '.75rem', padding: '1rem', border: '1px solid #8c83bb', borderRadius: '1rem', color: '#fff5dd', background: '#19182b', boxShadow: '0 8px 36px #0006' }}>
    <span>{updateReady ? 'A little update is ready.' : installed ? 'Allvideo is installed. Welcome home.' : 'Keep this little world close by.'}</span>
    <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
      {installPrompt && <button type="button" onClick={install} style={buttonStyle}>Install app</button>}
      {updateReady && <button type="button" onClick={applyUpdate} style={buttonStyle}>Update and reload</button>}
      <button type="button" onClick={() => { setInstalled(false); setUpdateReady(false); setInstallPrompt(null); }} style={buttonStyle}>Not now</button>
    </div>
  </aside>;
}
const buttonStyle = { border: '1px solid #b9a8d9', borderRadius: '999px', padding: '.55rem .8rem', color: '#fff5dd', background: '#35304f', font: 'inherit', cursor: 'pointer' };
