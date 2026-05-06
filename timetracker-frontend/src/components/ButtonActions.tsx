interface Props {
    isActive: boolean;
    onStart: () => void;
    onStop: () => void;
}
// Simple start/stop button component, used in App.tsx
export function ButtonActions({ isActive, onStart, onStop }: Props) {
    return (
        <button
            className={isActive ? "stop-btn" : "start-btn"}
            onClick={isActive ? onStop : onStart}
        >
            {isActive ? 'Stop & Save' : 'Start Timer'}
        </button>
    );
}