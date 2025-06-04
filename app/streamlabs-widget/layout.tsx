import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'PLIPLI9 Chat Widget | Streamlabs',
  description: 'Chat overlay transparent pentru Streamlabs OBS',
}

export default function StreamlabsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <style dangerouslySetInnerHTML={{
          __html: `
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            html, body {
              width: 100%;
              height: 100%;
              background: transparent !important;
              overflow: hidden;
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
            }
            
            /* Custom animations pentru Streamlabs */
            @keyframes slideInFromBottom {
              from {
                opacity: 0;
                transform: translateY(30px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            
            .animate-in {
              animation: slideInFromBottom 0.3s ease-out;
            }
            
            /* Ascunde scroll bars */
            * {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            
            *::-webkit-scrollbar {
              display: none;
            }
            
            /* Fix pentru Chrome transparency */
            body {
              background-color: rgba(0,0,0,0) !important;
            }
            
            /* Prevent text selection */
            .no-select {
              -webkit-touch-callout: none;
              -webkit-user-select: none;
              -khtml-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
            }
          `
        }} />
      </head>
      <body className="transparent-bg no-select">
        {children}
      </body>
    </html>
  )
} 