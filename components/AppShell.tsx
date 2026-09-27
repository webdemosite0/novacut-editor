"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
const nav=[['/','⌂','Home'],['/projects','▦','Projects'],['/editor','◫','Editor'],['/media','▣','Media'],['/exports','⇧','Exports']];
export default function AppShell({children,title,actions}:{children:React.ReactNode;title?:string;actions?:React.ReactNode}){
 const path=usePathname();
 return <div className="app"><aside className="app-sidebar"><Link className="logo" href="/"><span>◆</span><b>NovaCut</b></Link><nav>{nav.map(([href,icon,label])=><Link key={href} className={path===href?'active':''} href={href}><span>{icon}</span>{label}</Link>)}</nav><div className="sidebar-bottom"><Link className={path==='/settings'?'active':''} href="/settings"><span>⚙</span>Settings</Link><div className="profile"><span className="avatar">NW</span><div><b>Workspace</b><small>Local editor</small></div></div></div></aside><main className="app-main"><header className="app-topbar"><div><small>NOVACUT / WORKSPACE</small><h1>{title||'NovaCut'}</h1></div><div className="top-actions">{actions}</div></header>{children}</main></div>
}