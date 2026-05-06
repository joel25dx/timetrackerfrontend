interface TimerProps {
    seconds: number;
    formatTime: (s: number) => string;
}
// Simple component to display the timer in MM:SS format, used in App.tsx
export function TimerDisplay({ seconds, formatTime }: TimerProps) {
    return (
        <div className="timer-box">
            <h2 style={{ fontSize: '4rem', fontFamily: 'monospace' }}>
                {formatTime(seconds)}
            </h2>
        </div>
    );
}