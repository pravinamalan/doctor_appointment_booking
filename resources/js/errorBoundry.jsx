import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // This lifecycle method is used to update the state if an error occurs
  static getDerivedStateFromError(error) {
    // Update state to trigger fallback UI
    return { hasError: true };
  }

  // This lifecycle method is used to log errors (e.g., to an error reporting service)
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info);
    // You can also log error info to an external service here
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI when an error occurs
      return <h1>Something went wrong.</h1>;
    }

    // Render children (normal flow) if no error occurred
    return this.props.children;
  }
}

export default ErrorBoundary;
