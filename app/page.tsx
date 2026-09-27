"use client";
export default function DownloadSite(){
 const windows="https://github.com/webdemosite0/novacut-editor/releases/latest/download/NovaCut-Windows-Setup-0.2.0.exe";
 const mac="https://github.com/webdemosite0/novacut-editor/releases/latest/download/NovaCut-macOS-universal-0.2.0.dmg";
 return <main className="download-site">
  <nav className="download-nav"><a className="download-logo" href="/"><span>◆</span><b>NovaCut</b></a><div><a href="#features">Features</a><a href="https://github.com/webdemosite0/novacut-editor">GitHub</a></div></nav>
  <section className="download-hero">
   <div className="download-badge"><i/> Desktop video editor · Offline-first</div>
   <h1>Edit like a pro.<br/><span>Keep everything local.</span></h1>
   <p>NovaCut is a desktop video editor for focused, timeline-based editing with A-roll, B-roll, titles, audio, color and motion tools. Your footage stays on your computer.</p>
   <div className="download-actions">
    <a className="download-primary" href={windows}>⊞ Download for Windows <small>.exe · 64-bit</small></a>
    <a className="download-secondary" href={mac}> Download for macOS <small>Universal · .dmg</small></a>
   </div>
   <div className="download-note">No account required · Offline editing · Windows 10/11 · macOS</div>
   <div className="product-shot"><div className="shot-bar"><span>◆ NOVACUT</span><i/><i/><i/></div><div className="shot-body"><aside><b>MEDIA</b><em/><em/><em/><em/></aside><section><div className="shot-monitor"><span>WANDER<br/>FURTHER</span></div><div className="shot-controls">◀　▶　00:00:12:14</div></section><aside><b>INSPECTOR</b><label/><label/><label/><label/></aside></div><div className="shot-timeline"><b/><i/><i/><i/><i/></div></div>
  </section>
  <section id="features" className="download-features"><div><span>01</span><h2>Offline by design</h2><p>Import and edit local footage without uploading source media to a cloud service.</p></div><div><span>02</span><h2>Timeline-first workflow</h2><p>Built around tracks, cuts, B-roll, titles, audio, color controls and keyboard-driven editing.</p></div><div><span>03</span><h2>Desktop performance path</h2><p>Packaged as a native desktop application so we can progressively add hardware-accelerated media processing.</p></div></section>
  <footer><b>◆ NovaCut</b><span>Desktop video editing, without the cloud dependency.</span></footer>
 </main>
}