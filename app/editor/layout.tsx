"use client";
import { useEffect, useState } from "react";

export default function DesktopOnlyLayout({children}:{children:React.ReactNode}) {
  const [ready,setReady]=useState(false);
  useEffect(()=>{
    if ((window as any).novaDesktop) setReady(true);
    else window.location.replace("/");
  },[]);
  if(!ready) return <main style={{height:"100vh",display:"grid",placeItems:"center",background:"#090b0f",color:"#7f8898",fontFamily:"system-ui"}}>Opening NovaCut…</main>;
  return children;
}
