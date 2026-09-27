"use client";
import {ChangeEvent,useEffect,useMemo,useRef,useState} from "react";
import Link from "next/link";
type Clip={id:string;name:string;start:number;duration:number;track:number;color:string};
const seed:Clip[]=[
{id:'a1',name:'Interview_A.mov',start:0,duration:24,track:2,color:'amber'},
{id:'b1',name:'City_Broll.mp4',start:7,duration:8,track:1,color:'cyan'},
{id:'b2',name:'Detail_Closeup.mp4',start:17,duration:6,track:1,color:'violet'},
{id:'a2',name:'Interview_B.mov',start:24,duration:22,track:2,color:'amber'},
{id:'v1',name:'Voiceover.wav',start:0,duration:46,track:3,color:'green'},
{id:'m1',name:'Music Bed.wav',start:0,duration:55,track:4,color:'purple'}
];
const tracks=['B-ROLL','A-ROLL','VOICE','MUSIC'];
export default function Editor(){
 const video=useRef<HTMLVideoElement>(null), file=useRef<HTMLInputElement>(null);
 const [src,setSrc]=useState('');const [fileName,setFileName]=useState('No source loaded');const [playing,setPlaying]=useState(false);const [time,setTime]=useState(12.6);const [duration,setDuration]=useState(60);const [zoom,setZoom]=useState(14);const [clips,setClips]=useState<Clip[]>(seed);const [selected,setSelected]=useState('a1');const [history,setHistory]=useState<Clip[][]>([]);const [future,setFuture]=useState<Clip[][]>([]);const [leftTab,setLeftTab]=useState('Media');const [rightTab,setRightTab]=useState('Video');const [mode,setMode]=useState('Edit');const [scale,setScale]=useState(100);const [rotation,setRotation]=useState(0);const [opacity,setOpacity]=useState(100);const [exposure,setExposure]=useState(0);const [contrast,setContrast]=useState(100);const [saturation,setSaturation]=useState(100);const [volume,setVolume]=useState(100);const [snap,setSnap]=useState(true);const [ripple,setRipple]=useState(false);const [toast,setToast]=useState('');
 const active=clips.find(c=>c.id===selected);
 const commit=(next:Clip[])=>{setHistory(h=>[...h,clips].slice(-30));setClips(next);setFuture([])};
 const undo=()=>{if(!history.length)return;const prev=history[history.length-1];setFuture(f=>[clips,...f]);setHistory(h=>h.slice(0,-1));setClips(prev)};
 const redo=()=>{if(!future.length)return;const next=future[0];setHistory(h=>[...h,clips]);setFuture(f=>f.slice(1));setClips(next)};
 const split=()=>{if(!active)return;const local=time-active.start;if(local<=.2||local>=active.duration-.2)return;const one={...active,duration:local};const two={...active,id:crypto.randomUUID(),name:active.name+' B',start:time,duration:active.duration-local};commit(clips.flatMap(c=>c.id===active.id?[one,two]:[c]));setSelected(two.id);flash('Clip split')};
 const remove=()=>{if(!active)return;commit(clips.filter(c=>c.id!==active.id));setSelected('');flash('Clip deleted')};
 const flash=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),1200)};
 const save=()=>{localStorage.setItem('novacut-editor-state',JSON.stringify({clips,time,zoom,scale,rotation,opacity,exposure,contrast,saturation,volume}));flash('Project saved locally')};
 const toggle=()=>{const v=video.current;if(v&&src){if(v.paused){v.play();setPlaying(true)}else{v.pause();setPlaying(false)}}else setPlaying(p=>!p)};
 const importVideo=(e:ChangeEvent<HTMLInputElement>)=>{const f=e.target.files?.[0];if(!f)return;const u=URL.createObjectURL(f);setSrc(u);setFileName(f.name);setTime(0);flash('Media loaded')};
 const seek=(n:number)=>{const t=Math.max(0,Math.min(duration,n));setTime(t);if(video.current)video.current.currentTime=t};
 useEffect(()=>{const raw=localStorage.getItem('novacut-editor-state');if(raw){try{const s=JSON.parse(raw);if(s.clips)setClips(s.clips);if(typeof s.zoom==='number')setZoom(s.zoom)}catch{}}},[]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if((e.target as HTMLElement)?.tagName==='INPUT')return;if(e.code==='Space'){e.preventDefault();toggle()}if(e.key.toLowerCase()==='s'&&!e.ctrlKey&&!e.metaKey)split();if(e.key==='Delete'||e.key==='Backspace')remove();if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?redo():undo()}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();save()}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)});
 useEffect(()=>{if(!src&&playing){const id=setInterval(()=>setTime(t=>t>=duration?0:t+.04),40);return()=>clearInterval(id)}},[playing,src,duration]);
 const tick=useMemo(()=>Array.from({length:Math.ceil(duration/5)+1},(_,i)=>i*5),[duration]);
 return <div className="editor-pro">
  {toast&&<div className="toast">{toast}</div>}
  <header className="editor-top"><div className="editor-brand"><Link href="/">◆</Link><b>NovaCut</b><span>/</span><strong>Wanderlust</strong></div><div className="editor-modes">{['Edit','Color','Audio','Motion'].map(x=><button key={x} onClick={()=>{setMode(x);if(x==='Color')setRightTab('Color');if(x==='Audio')setRightTab('Audio');if(x==='Motion')setRightTab('Video')}} className={mode===x?'on':''}>{x}</button>)}</div><div className="editor-actions"><button onClick={undo}>↶</button><button onClick={redo}>↷</button><button onClick={save}>Save</button><Link className="export-mini" href="/exports">Export</Link></div></header>
  <div className="editor-body">
   <aside className="source-panel">
    <div className="panel-tabs">{['Media','Effects','Titles','Audio'].map(x=><button onClick={()=>setLeftTab(x)} className={leftTab===x?'on':''} key={x}>{x}</button>)}</div>
    <div className="bin-head"><b>{leftTab}</b><button onClick={()=>file.current?.click()}>＋</button><input ref={file} hidden type="file" accept="video/*" onChange={importVideo}/></div>
    <div className="bin-search">⌕ <input placeholder="Search project…"/></div>
    {leftTab==='Media'?<><button className="import-large" onClick={()=>file.current?.click()}><span>＋</span><b>Import footage</b><small>Video files stay on this device</small></button><div className="bin-list"><div className="bin-row active"><i className="bin-thumb bt1"/><div><b>{fileName}</b><small>Master clip</small></div></div><div className="bin-row"><i className="bin-thumb bt2"/><div><b>City_Broll.mp4</b><small>B-roll · 00:08</small></div></div><div className="bin-row"><i className="bin-thumb bt3"/><div><b>Interview_A.mov</b><small>A-roll · 00:24</small></div></div></div></>:<ToolLibrary tab={leftTab}/>} 
   </aside>
   <section className="program-panel">
    <div className="monitor-head"><span>PROGRAM</span><div><button>½</button><button>Fit⌄</button></div></div>
    <div className="monitor-wrap">
      {src?<video ref={video} className="program-video" style={{transform:`scale(${scale/100}) rotate(${rotation}deg)`,opacity:opacity/100,filter:`brightness(${100+exposure}%) contrast(${contrast}%) saturate(${saturation}%)`}} src={src} onLoadedMetadata={e=>{setDuration(e.currentTarget.duration||60);e.currentTarget.volume=volume/100}} onTimeUpdate={e=>setTime(e.currentTarget.currentTime)} onEnded={()=>setPlaying(false)}/>:<div className="demo-frame" style={{transform:`scale(${scale/100}) rotate(${rotation}deg)`,opacity:opacity/100,filter:`brightness(${100+exposure}%) contrast(${contrast}%) saturate(${saturation}%)`}}><div className="demo-glow"/><div className="demo-grid"/><div className="demo-title"><small>TRAVEL FILM</small><b>WANDER<br/>FURTHER</b><span>01 / 04</span></div></div>}
    </div>
    <div className="monitor-controls"><span className="tc">{fmt(time)}</span><div><button onClick={()=>seek(time-5)}>│◀</button><button onClick={()=>seek(time-.04)}>◀</button><button className="play-main" onClick={toggle}>{playing?'❚❚':'▶'}</button><button onClick={()=>seek(time+.04)}>▶</button><button onClick={()=>seek(time+5)}>▶│</button></div><span>{fmt(duration)}</span></div>
   </section>
   <aside className="inspector-pro">
    <div className="panel-tabs">{['Video','Color','Audio'].map(x=><button onClick={()=>setRightTab(x)} className={rightTab===x?'on':''} key={x}>{x}</button>)}</div>
    <div className="inspect-title"><div><small>SELECTED CLIP</small><b>{active?.name||'Nothing selected'}</b></div><button>•••</button></div>
    {rightTab==='Video'?<><InspectorGroup title="Transform"><Control label="Scale" value={scale} set={setScale} min={25} max={200}/><Control label="Rotation" value={rotation} set={setRotation} min={-180} max={180}/><div className="xy"><label>X <input defaultValue="0"/></label><label>Y <input defaultValue="0"/></label></div></InspectorGroup><InspectorGroup title="Compositing"><Control label="Opacity" value={opacity} set={setOpacity} min={0} max={100}/><label className="selectline">Blend<select><option>Normal</option><option>Screen</option><option>Multiply</option><option>Overlay</option></select></label></InspectorGroup></>:rightTab==='Color'?<InspectorGroup title="Primary color"><Control label="Exposure" value={exposure} set={setExposure} min={-50} max={50}/><Control label="Contrast" value={contrast} set={setContrast} min={0} max={200}/><Control label="Saturation" value={saturation} set={setSaturation} min={0} max={200}/><div className="wheels"><i/><i/><i/></div></InspectorGroup>:<InspectorGroup title="Clip audio"><Control label="Volume" value={volume} set={v=>{setVolume(v);if(video.current)video.current.volume=v/100}} min={0} max={100}/><Control label="Pan" value={0} set={()=>{}} min={-100} max={100}/><label className="check"><input type="checkbox" defaultChecked/> Normalize dialogue</label></InspectorGroup>}
   </aside>
  </div>
  <section className="timeline-pro">
   <div className="timeline-toolbar"><div className="edit-tools"><button className="on">↖</button><button onClick={split}>✂ <span>Split</span></button><button onClick={remove}>⌫ <span>Delete</span></button><button className={ripple?'on':''} onClick={()=>setRipple(!ripple)}>⇥ <span>Ripple</span></button><button className={snap?'on':''} onClick={()=>setSnap(!snap)}>⌁ <span>Snap</span></button></div><div className="timeline-status"><span>{active?active.name:'No clip selected'}</span><b>{fmt(time)}</b></div><div className="zoom-tools"><button onClick={()=>setZoom(Math.max(7,zoom-2))}>−</button><input type="range" min="7" max="28" value={zoom} onChange={e=>setZoom(+e.target.value)}/><button onClick={()=>setZoom(Math.min(28,zoom+2))}>＋</button></div></div>
   <div className="timeline-scroll">
    <div className="track-names"><div className="ruler-spacer"/>{tracks.map((t,i)=><div className="track-name" key={t}><small>{i<2?'V':'A'}{i<2?2-i:i-1}</small><b>{t}</b><span>● ◉</span></div>)}</div>
    <div className="timeline-canvas" style={{width:Math.max(1100,duration*zoom+180)}} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();seek((e.clientX-r.left)/zoom)}}>
      <div className="ruler-pro">{tick.map(t=><span key={t} style={{left:t*zoom}}>{fmt(t)}</span>)}</div>
      {tracks.map((_,i)=><div className="lane-pro" key={i}>{clips.filter(c=>c.track===i+1).map(c=><div key={c.id} className={`clip-pro ${c.color} ${selected===c.id?'selected':''}`} style={{left:c.start*zoom,width:Math.max(34,c.duration*zoom)}} onClick={e=>{e.stopPropagation();setSelected(c.id)}}><div className="clip-stripe"/><b>{c.name}</b>{c.track>2&&<div className="waveform-mini"/>}</div>)}</div>)}
      <div className="playhead-pro" style={{left:time*zoom}}><i/><span/></div>
    </div>
   </div>
  </section>
 </div>
}
function ToolLibrary({tab}:{tab:string}){const map:Record<string,string[]>= {Effects:['Gaussian Blur','Glow','Film Grain','Sharpen','Vignette','Chromatic Shift'],Titles:['Clean Lower Third','Editorial Title','Kinetic Type','Subtitle Card','Quote Card'],Audio:['Dialogue Enhance','Noise Reduce','Room Tone','Limiter','Compressor']};return <div className="tool-library">{(map[tab]||[]).map(x=><button key={x}><i/> <span>{x}</span><small>⋮</small></button>)}</div>}
function InspectorGroup({title,children}:{title:string;children:React.ReactNode}){return <section className="inspect-group"><div className="inspect-group-head"><b>{title}</b><span>↺</span></div>{children}</section>}
function Control({label,value,set,min,max}:{label:string;value:number;set:(n:number)=>void;min:number;max:number}){return <label className="control"><div><span>{label}</span><output>{value}</output></div><input type="range" min={min} max={max} value={value} onChange={e=>set(+e.target.value)}/></label>}
function fmt(s:number){if(!Number.isFinite(s))s=0;const m=Math.floor(s/60),sec=Math.floor(s%60),f=Math.floor((s%1)*24);return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}:${String(f).padStart(2,'0')}`}
