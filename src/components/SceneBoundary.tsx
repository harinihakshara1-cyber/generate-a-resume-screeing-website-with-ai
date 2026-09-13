import { Component, type ReactNode } from 'react';

// Renders a fallback if the 3D canvas (WebGL) fails for any reason, so the
// page never goes blank.
export class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(err: unknown) {
    // eslint-disable-next-line no-console
    console.warn('3D scene failed, showing fallback:', err);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
