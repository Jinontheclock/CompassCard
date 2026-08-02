/* iOS chrome that every screen carries: the status bar at the top and the
   home indicator at the bottom. Both are drawn rather than imported so they
   pick up the screen's own foreground colour — the dark onboarding screens
   need light chrome, the rest need dark.

   The Figma frames use Apple's UI kit here: a 62px bar with the clock and
   the level icons either side of a 125×37 Dynamic Island, and a 144×5 home
   indicator sitting 8px off the bottom of a 34px band. */

export function StatusBar({ light = false }) {
  return (
    <div className={"status-bar" + (light ? " status-bar--light" : "")}>
      <span className="status-time tnum">9:41</span>
      <span className="status-island" />
      <span className="status-levels">
        {/* one 85.329×13 group — the box the kit gives the level icons */}
        <svg width="85.329" height="13" viewBox="0 0 85.329 13" aria-hidden="true">
          <g fill="currentColor">
            <rect x="0" y="8.6" width="3.2" height="4.4" rx="1" />
            <rect x="4.7" y="6.3" width="3.2" height="6.7" rx="1" />
            <rect x="9.4" y="3.4" width="3.2" height="9.6" rx="1" />
            <rect x="14.2" y="0.4" width="3.2" height="12.6" rx="1" />
          </g>
          <path
            d="M32.55 12.3 29.9 9.4a4 4 0 0 1 5.3 0l-2.65 2.9Zm0-5.7a7 7 0 0 0-4.9 2L25.9 6.6a9.6 9.6 0 0 1 13.3 0l-1.75 1.7a7 7 0 0 0-4.9-2Zm0-4.6a11.6 11.6 0 0 0-8.15 3.3L24.9 3.6a13.9 13.9 0 0 1 15.3 0l-1.5 1.7a11.6 11.6 0 0 0-8.15-3.3Z"
            fill="currentColor"
          />
          <g>
            <rect
              x="48.2"
              y="0.8"
              width="21.5"
              height="11.4"
              rx="3.6"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.4"
            />
            <rect x="49.8" y="2.4" width="18.3" height="8.2" rx="2.2" fill="currentColor" />
            <path d="M70.9 4.6v3.8a2 2 0 0 0 0-3.8Z" fill="currentColor" fillOpacity="0.4" />
          </g>
        </svg>
      </span>
    </div>
  );
}

export function HomeIndicator({ light = false }) {
  return <div className={"home-indicator" + (light ? " home-indicator--light" : "")} />;
}
