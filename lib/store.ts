"use client";
export type Project={id:string;name:string;updated:string;duration:string;resolution:string;fps:number};
export const starterProjects:Project[]=[
{id:"wanderlust",name:"Wanderlust",updated:"Today, 6:42 PM",duration:"03:28",resolution:"3840×2160",fps:24},
{id:"launch-film",name:"Launch Film",updated:"Yesterday",duration:"01:14",resolution:"1920×1080",fps:30},
{id:"podcast-ep12",name:"Podcast — Episode 12",updated:"Sep 24",duration:"42:10",resolution:"1920×1080",fps:30}
];
export function loadProjects(){if(typeof window==="undefined")return starterProjects;const raw=localStorage.getItem("novacut-projects");return raw?JSON.parse(raw):starterProjects}
export function saveProjects(p:Project[]){localStorage.setItem("novacut-projects",JSON.stringify(p))}
