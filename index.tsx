import React, { ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n'; // Import the i18n configuration
import './index.css'; // Import Tailwind CSS styles

// Error Boundary Component to catch crashes and display a fallback UI
interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // FIX: Switched from a class property to a constructor for state initialization. This is a more robust pattern that ensures `this.props` is available and correctly typed, resolving the error.
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Ratel AI App crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'white', backgroundColor: '#1f2937', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚙️ Ratel AI is refreshing</h1>
          <p>Please reload the page or check your connection.</p>
           <button
              onClick={() => window.location.reload()}
              style={{ marginTop: '1.5rem', padding: '0.5rem 1.5rem', border: '1px solid white', borderRadius: '0.25rem', cursor: 'pointer', background: 'transparent', color: 'white', fontSize: '0.875rem', fontWeight: 600 }}
            >
              Reload Page
            </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <React.Suspense fallback="Loading...">
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.Suspense>
  </React.StrictMode>
);