/* iOS chrome that every screen carries: the status bar at the top and the
   home indicator at the bottom. Both are drawn rather than imported so they
   pick up the screen's own foreground colour — the dark onboarding screens
   need light chrome, the rest need dark. */

export function StatusBar({ light = false }) {
  return (
    <div className={"status-bar" + (light ? " status-bar--light" : "")}>
      <span className="status-time tnum">9:41</span>
      <span className="status-notch" />
      <span className="status-icons">
        <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true">
          <rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor" />
          <rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor" />
          <rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true">
          <path
            d="M8 11.2 5.6 8.6a3.4 3.4 0 0 1 4.8 0L8 11.2Zm0-5.1a6.2 6.2 0 0 0-4.4 1.8L2 6.3a8.5 8.5 0 0 1 12 0l-1.6 1.6A6.2 6.2 0 0 0 8 6.1Zm0-4.1a10.3 10.3 0 0 0-7.3 3L.7 3.9a12.6 12.6 0 0 1 14.6 0l-.9.9A10.3 10.3 0 0 0 8 2Z"
            fill="currentColor"
          />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden="true">
          <rect
            x="0.5"
            y="0.5"
            width="21"
            height="11"
            rx="3.5"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.4"
          />
          <rect x="2" y="2" width="18" height="8" rx="2" fill="currentColor" />
          <path
            d="M23 4v4a2 2 0 0 0 0-4Z"
            fill="currentColor"
            fillOpacity="0.4"
          />
        </svg>
      </span>
    </div>
  );
}

export function HomeIndicator({ light = false }) {
  return <div className={"home-indicator" + (light ? " home-indicator--light" : "")} />;
}
