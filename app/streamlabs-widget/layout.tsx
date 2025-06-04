import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'PLIPLI9 Chat Widget',
  description: 'Chat overlay pentru Streamlabs',
}

export default function StreamlabsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            body {
              background: transparent !important;
              margin: 0;
              padding: 0;
              overflow: hidden;
            }
            
            /* Custom animations pentru Streamlabs */
            @keyframes slideInFromBottom {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .animate-in {
              animation: slideInFromBottom 0.5s ease-out forwards;
            }
            
            /* Smooth scrolling */
            * {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            
            *::-webkit-scrollbar {
              display: none;
            }
          `
        }} />
      </head>
      <body className="transparent-bg">
        {children}
      </body>
    </html>
  )
} 