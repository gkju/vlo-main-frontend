import {ErrorBoundaryPropsWithFallback, FallbackProps} from "react-error-boundary";
import {FunctionComponent} from "react";

export const ErrorBoundaryFallback: FunctionComponent<FallbackProps> = ({error, resetErrorBoundary}) => {
    return (
        <div role="alert">
            <p>Wystąpił błąd</p>
            <pre>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Spróbuj ponownie</button>
        </div>
    )
}
