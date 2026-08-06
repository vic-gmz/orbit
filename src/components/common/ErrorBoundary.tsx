import { Component } from "react";
import type { ReactNode } from "react";

export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <p className="p-6">Something went wrong. Try again.</p>;
    }
    return this.props.children;
  }
}
