interface TimerProps {
    seconds: number;
    formatTime: (s: number) => string;
}

export function TimerDisplay({ seconds, formatTime }: TimerProps) {
    return (
        <div className="timer-box">
            <h2 style={{ fontSize: '4rem', fontFamily: 'monospace' }}>
                {formatTime(seconds)}
            </h2>
        </div>
    );
}