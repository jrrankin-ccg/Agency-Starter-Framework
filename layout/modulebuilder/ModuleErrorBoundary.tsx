import React, { Component, ErrorInfo, ReactNode } from "react";

import { Spacing } from "../../components/module/Spacing";
import { Width } from "../../components/module/Width";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

const IS_PRODUCTION = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
class ModuleErrorBoundary extends Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      hasError: false,
      error: undefined,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (IS_PRODUCTION) return null;
      return (
        <Spacing space={{ top: "sm", bottom: "sm" }}>
          <Width>
            <strong className="block">
              {(this.props.children as React.ReactElement)?.props?.module}
            </strong>
            <p>{this.state.error?.toString()}</p>
          </Width>
        </Spacing>
      );
    }

    return this.props.children;
  }
}

export default ModuleErrorBoundary;