import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Computer Science 3',
  description: 'Computer Science 3 Grades Tracker',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/gg.png"/>
      </head>
      
      <body className={inter.className}>{children}</body>
      
    </html>
  )
}
