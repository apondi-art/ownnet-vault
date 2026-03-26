import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

if (isDark) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error.toString() };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-red-500 font-mono bg-background min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <pre className="bg-secondary-background p-4 rounded-base border-border overflow-auto">{this.state.error}</pre>
          <p className="mt-4 text-foreground">Check browser console for more details</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = React.lazy(() => import('./App'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <React.Suspense fallback={
        <div className="flex justify-center items-center h-screen bg-background text-foreground">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-main border-t-transparent rounded-full animate-spin" />
            <span className="font-base">Loading Vault...</span>
          </div>
        </div>
      }>
        <App />
      </React.Suspense>
    </ErrorBoundary>
  </React.StrictMode>,
)