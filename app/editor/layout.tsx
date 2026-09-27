"use client";
import { useEffect, useState } from "react";

const isDesktopBuild = process.env.NEXT_PUBLIC_DESKTOP_BUILD === "1";

export default function DesktopOnlyLayout({children}:{children:React.ReactNode}) {
  const [ready,setReady]=useState(isDesktopBuild);

  useEffect(()=>{
    if (isDesktopBuild || (window as any).novaDesktop) {
      setReady(true);
      return;
    }
    window.location.replace("/");
  },[]);

  if(!ready) return (
    <main className="desktop-boot">
      <div className="desktop-boot-mark">◆</div>
      <div className="desktop-boot-copy">
        <b>NovaCut</b>
        <span>Starting editor…</span>
      </div>
    </main>
  );

  return children;
}
