"use client";

import { useMemo, useState } from "react";

type Tool = { icon: string; label: string };
type Clip = { label: string; kind: string; width: number; offset?: number };

const nav: Tool[] = [
  { icon: "▣", label: "Media" }, { icon: "◫", label: "B-Rolls" }, { icon: "▱", label: "A-Rolls" },
  { icon: "♫", label: "Audio" }, { icon: "◉", label: "Voice" }, { icon: "CC", label: "Captions" },
  { icon: "◇", label: "Transitions" }, { icon: "✦", label: "Effects" }, { icon: "▤", label: "Templates" },
];

const media = [
  ["A001_C005.MP4", "00:24", "linear-gradient(135deg,#46d7ff,#1d459b 45%,#06162f)"],
  ["A002_C017.MP4", "00:16", "linear-gradient(145deg,#ffbd72,#5c1c64 55%,#111827)"],
  ["B003_C001.MP4", "00:14", "linear-gradient(140deg,#e89c73,#7134da 55%,#18203a)"],
  ["Drone_Bali.mp4", "00:21", "linear-gradient(145deg,#38d9ce,#1683bd 50%,#082c56)"],
  ["Broll_Forest.mp4", "00:12", "linear-gradient(145deg,#c7f36d,#278a5b 52%,#083935)"],
  ["Interview_01.MP4", "00:18", "linear-gradient(145deg,#ffbdcb,#9b4cc6 60%,#312245)"],
];

const tracks: { name: string; icon: string; clips: Clip[] }[] = [
  { name: "Captions", icon: "CC", clips: [
    { label: "The world is vast…", kind: "caption", width: 145, offset: 38 },
    { label: "…and so are the stories…", kind: "caption", width: 183, offset: 160 },
    { label: "We travel not to escape…", kind: "caption", width: 190, offset: 165 },
    { label: "…but to feel alive.", kind: "caption", width: 155, offset: 210 },
  ]},
  { name: "Text", icon: "T", clips: [
    { label: "Wander Further", kind: "text", width: 280, offset: 150 },
    { label: "Glow", kind: "effect", width: 150, offset: 320 },
    { label: "A Journey Beyond Borders", kind: "text pink", width: 205, offset: 80 },
  ]},
  { name: "B-Roll", icon: "▣", clips: [
    { label: "Waterfall", kind: "video green", width: 130 },
    { label: "Islands", kind: "video cyan", width: 160, offset: 16 },
    { label: "Forest", kind: "video green", width: 170, offset: 10 },
    { label: "Drone", kind: "video blue", width: 145, offset: 16 },
    { label: "Ocean", kind: "video cyan", width: 210, offset: 12 },
  ]},
  { name: "A-Roll", icon: "▱", clips: [
    { label: "A002_C017", kind: "video amber", width: 330 },
    { label: "A003_C021", kind: "video purple", width: 270, offset: 4 },
    { label: "A004_C002", kind: "video blue", width: 280, offset: 4 },
    { label: "A005_C013", kind: "video amber", width: 250, offset: 4 },
  ]},
  { name: "Voice", icon: "◒", clips: [{ label: "Voiceover_Final.wav", kind: "audio greenwave", width: 1120 }]},
  { name: "Music", icon: "♫", clips: [{ label: "Inspiring Journey — Alex M", kind: "audio purplewave", width: 1250 }]},
];

export default function EditorPage() {
  const [active, setActive] = useState("Media");
  const [playing, setPlaying] = useState(false);
  const [inspector, setInspector] = useState("Video");
  const [zoom, setZoom] = useState(100);
  const [selectedMedia, setSelectedMedia] = useState(1);
  const timeLabels = useMemo(() => Array.from({ length: 13 }, (_, i) => "00:" + String(i * 15).padStart(2, "0") + ":00"), []);

  return (
    <main className="editor-shell">
      <header className="topbar">
        <div className="traffic"><i/><i/><i/></div>
        <div className="brand"><span className="brand-mark">◆</span><b>NovaCut</b></div>
        <nav className="menu"><span>File</span><span>Edit</span><span>Trim</span><span>Timeline</span><span>View</span><span>Window</span><span>Help</span></nav>
        <div className="project-title"><span>☁</span><b>Wanderlust</b><em>Travel Film</em><span>⌄</span></div>
        <div className="actions"><button>↶</button><button>↷</button><button className="quality">4K⌄</button><button className="share">⇧ Share</button><button className="export">▶ Export</button></div>
      </header>

      <section className="workspace">
        <aside className="rail">
          {nav.map((item) => (
            <button key={item.label} onClick={() => setActive(item.label)} className={active === item.label ? "active" : ""}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
          <div className="rail-spacer"/>
          <button><span>♛</span>Brand Kit</button>
        </aside>

        <section className="library panel">
          <div className="panel-head"><h2>{active}</h2><span>↕</span><span>⛶</span></div>
          <div className="search"><span>⌕</span><input placeholder="Search media, folders, or keywords…"/><button>⌁</button></div>
          <div className="tabs"><b>All</b><span>Video</span><span>Audio</span><span>Image</span><span>Favorites</span></div>
          <div className="folders">
            <button className="import-card"><strong>＋</strong><span>Import</span></button>
            {[["Travel","128 items"],["Africa","56 items"],["City","73 items"]].map(([name,count]) => (
              <button className="folder" key={name}><strong>▰</strong><b>{name}</b><small>{count}</small></button>
            ))}
          </div>
          <div className="media-grid">
            {media.map((m,i) => (
              <button key={m[0]} onClick={() => setSelectedMedia(i)} className={"media-item " + (selectedMedia === i ? "selected" : "")}>
                <span className="thumb" style={{background:m[2]}}><span className="thumb-shape one"/><span className="thumb-shape two"/><small>{m[1]}</small></span>
                <span className="filename">▣ {m[0]}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="center">
          <div className="viewer panel">
            <div className="stage">
              <div className="sun"/><div className="mountains back"/><div className="mountains front"/>
              <div className="island i1"/><div className="island i2"/>
              <div className="traveler"><div className="hat"/><div className="head"/><div className="body"/><div className="bag"/></div>
              <div className="safe-frame"/>
              <div className="hero-copy"><span>Wander</span><span>Further</span><i/></div>
              <div className="sub-copy">A JOURNEY<br/>BEYOND<br/>BORDERS<i/></div>
            </div>
            <div className="playerbar">
              <div className="time"><b>00:00:42:17</b><span>/ 00:03:28:03</span></div>
              <button>Fit⌄</button>
              <div className="transport"><button>│◀</button><button>◀</button><button className="play" onClick={() => setPlaying(!playing)}>{playing ? "❚❚" : "▶"}</button><button>▶</button><button>▶│</button></div>
              <div className="player-actions"><button>⛶</button><button>▣</button><button>◉</button><button>Full⌄</button><button>⌗</button></div>
            </div>
          </div>
        </section>

        <aside className="inspector panel">
          <div className="inspector-tabs">
            {["Video","Audio","Effects","Color","Captions"].map((tab) => <button className={inspector === tab ? "active" : ""} onClick={() => setInspector(tab)} key={tab}>{tab}</button>)}
          </div>
          <div className="clip-summary"><span className="clip-mini"/><div><b>{media[selectedMedia][0]}</b><small>00:00:32:12</small></div><button>•••</button></div>
          <SettingSection title="Transform">
            <div className="field-row"><span>Position</span><label>X <input value="960" readOnly/></label><label>Y <input value="540" readOnly/></label></div>
            <div className="field-row"><span>Scale</span><input value={zoom + "%"} readOnly/><button onClick={() => setZoom((z) => z === 100 ? 115 : 100)}>⛓</button></div>
            <div className="field-row"><span>Rotation</span><input value="0.0°" readOnly/><button>↺</button></div>
            <div className="field-row"><span>Anchor</span><label>X <input value="0" readOnly/></label><label>Y <input value="0" readOnly/></label></div>
          </SettingSection>
          <ToggleRow label="Motion"/><ToggleRow label="Opacity"/>
          <SettingSection title="Color">
            <Slider label="Temperature" value="8"/><Slider label="Tint" value="5"/><Slider label="Saturation" value="110"/><Slider label="Contrast" value="12"/>
          </SettingSection>
          <SettingSection title="Effects">
            <Slider label="Bloom ♛" value="0.35"/><Slider label="Sharpen" value="0.20"/>
          </SettingSection>
        </aside>
      </section>

      <section className="timeline panel">
        <div className="timeline-tools"><button className="tool-active">↖</button><button>↶</button><button>✂</button><button>⌁</button><button>⌗</button><button>╱</button><button>◉</button><button>◎</button><button>↥</button><div className="grow"/><span>Timeline</span><button>−</button><input type="range" min="1" max="100" defaultValue="54"/><button>＋</button></div>
        <div className="timeline-body">
          <div className="track-labels-spacer"/>
          <div className="ruler">{timeLabels.map((t) => <span key={t}>{t}</span>)}</div>
          {tracks.map((track,idx) => (
            <div className="track-row" key={track.name}>
              <div className="track-label"><small>{tracks.length-idx}</small><span>{track.icon}</span><b>{track.name}</b><button>◉</button></div>
              <div className="lane">
                {track.clips.map((clip,i) => (
                  <div key={i} className={"timeline-clip " + clip.kind} style={{width:clip.width, marginLeft:clip.offset||0}}>
                    <span>{clip.label}</span>{clip.kind.includes("wave") && <i className="wave"/>}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="playhead"><span>00:00:42:17</span><i/></div>
        </div>
      </section>
    </main>
  );
}

function SettingSection({title,children}:{title:string;children:React.ReactNode}) {
  return <section className="setting-section"><div className="section-title"><span>⌄</span><b>{title}</b><span className="toggle on"><i/></span></div>{children}</section>;
}
function ToggleRow({label}:{label:string}) {
  return <div className="toggle-row"><span>›</span><b>{label}</b><span className="toggle on"><i/></span></div>;
}
function Slider({label,value}:{label:string;value:string}) {
  return <div className="slider-row"><span>{label}</span><input type="range" defaultValue={label.includes("Saturation")?58:label.includes("Contrast")?48:52}/><output>{value}</output></div>;
}
