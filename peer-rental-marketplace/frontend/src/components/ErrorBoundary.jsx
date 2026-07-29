import { Component } from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary:", error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <div className="text-8xl">⚠️</div>

          <h1 className="mt-6 text-4xl font-bold">
            Something went wrong
          </h1>

          <p className="mt-4 max-w-md text-gray-600">
            An unexpected error occurred while rendering this page.
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={this.handleRefresh}
              className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
            >
              Refresh Page
            </button>

            <Link
              to="/"
              className="rounded-lg border border-gray-300 px-6 py-3 transition hover:bg-gray-100"
            >
              Go Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;