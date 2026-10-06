import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('App Error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ fontFamily: 'Arial', padding: '40px', maxWidth: '600px', margin: '60px auto', textAlign: 'center' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>⚠️</div>
          <h2 style={{ color: '#dc2626', marginBottom: '12px' }}>Something went wrong</h2>
          <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '14px' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            style={{ background: '#1d4ed8', color: 'white', border: 'none', padding: '12px 28px',
                     borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
            Go to Login
          </button>
          <br /><br />
          <button onClick={() => window.location.reload()}
            style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0',
                     padding: '10px 24px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px' }}>
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
