import {Component, type ErrorInfo, type ReactNode} from 'react';
import './ErrorBoundary.css';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {hasError: false, error: null};
    }

    static getDerivedStateFromError(error: Error): State {
        return {hasError: true, error};
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="error-boundary" role="alert">
                    <h1>Something went wrong</h1>
                    <p>We&apos;re sorry, but something unexpected happened. Please try refreshing the page.</p>
                    <details>
                        <summary>Error Details</summary>
                        <pre>{this.state.error?.toString()}</pre>
                    </details>
                    <button type="button" onClick={() => window.location.reload()}>
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
