import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConvexReactClient } from 'convex/react'
import { ConvexAuthProvider } from '@convex-dev/auth/react'
import { AppProvider } from './context/AppContext'
import './i18n' // Initialize i18n
import './index.css'
import App from './App.jsx'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL)

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ConvexAuthProvider client={convex}>
            <BrowserRouter>
                <AppProvider>
                    <App />
                </AppProvider>
            </BrowserRouter>
        </ConvexAuthProvider>
    </StrictMode>,
)

