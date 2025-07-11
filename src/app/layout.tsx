import './globals.css'

export const metadata = {
  title: 'Marketing Auth App',
  description: 'A comprehensive authentication system for marketing applications',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}