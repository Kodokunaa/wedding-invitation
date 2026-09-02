import type { Metadata } from 'next';
import './globals.css';
import Music from './music';
export const metadata:Metadata={title:'Brandon & Lourey Mae | September 9, 2026',description:'Join Brandon and Lourey Mae for their wedding celebration on September 9, 2026. Ceremony, reception, attire, and cherished memories.',openGraph:{title:'Brandon & Lourey Mae',description:'Together begins September 9, 2026.',images:['/og.png']},twitter:{card:'summary_large_image',title:'Brandon & Lourey Mae',description:'Together begins September 9, 2026.',images:['/og.png']}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}<Music/></body></html>}


