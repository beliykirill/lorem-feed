import { Component, type ErrorInfo, type PropsWithChildren } from 'react';

import { StateView } from '@/shared/ui';

type State = { hasError: boolean };

// "Try again" only re-renders the tree: stored data is never reset (invariant 5).
export class ErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (__DEV__) {
      console.error(error, info.componentStack);
    }
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return (
        <StateView
          message="Something went wrong"
          actionTitle="Try again"
          onAction={this.reset}
        />
      );
    }

    return this.props.children;
  }
}
