// Reye UI kit — EyeMark + ReyeFlame
// EyeMark: small brand glyph (header / footer). Icy iris, cool palette.
// ReyeFlame: BIG centerpiece — vertical slit pupil, icy/violet iris,
// electric rays radiating outward, soft cool halo, sweeping page beam.

const { useEffect: useEffectE, useRef: useRefE, useMemo: useMemoE } = React;

let __eyeIdCounter = 0;
function nextEyeId() { return `eye-${++__eyeIdCounter}`; }

/* ─────────────────────────────────────────────────────────────────
   Generate a single jagged lightning polyline from the iris edge
   outward. Each ray is a sequence of points with slight per-segment
   jitter and an inner gap so it doesn't overlap the iris.
   ───────────────────────────────────────────────────────────────── */
function buildRay(angle, length, seed) {
  // deterministic-ish jitter so renders don't reshuffle on every mount
  let s = seed;
  const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const cx = 40, cy = 44;
  const startR = 14 + rng() * 2;
  const stepR  = 1.5 + rng() * 1.2;
  const points = [];
  let r = startR;
  let perpJitter = 0;
  while (r < startR + length) {
    perpJitter += (rng() - 0.5) * 1.4;
    perpJitter *= 0.78;
    const x = cx + Math.cos(angle) * r + Math.cos(angle + Math.PI / 2) * perpJitter;
    const y = cy + Math.sin(angle) * r + Math.sin(angle + Math.PI / 2) * perpJitter;
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    r += stepR + rng() * 1.4;
  }
  return points.join(' ');
}

/* ─────────────────────────────────────────────────────────────────
   EyeMark — small glyph for header/footer (cool palette).
   ───────────────────────────────────────────────────────────────── */
function EyeMark({ size = 22, className = '' }) {
  const id = useMemoE(nextEyeId, []);
  return (
    <svg className={`eye-mark ${className}`} width={size} height={size}
         viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-iris`} cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%"   stopColor="#ffffff"/>
          <stop offset="22%"  stopColor="#9bcaff"/>
          <stop offset="55%"  stopColor="#4f7be8"/>
          <stop offset="85%"  stopColor="#3b1e8a"/>
          <stop offset="100%" stopColor="#0a0418"/>
        </radialGradient>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.8" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g filter={`url(#${id}-glow)`}>
        <ellipse className="eye-iris" cx="16" cy="16" rx="7" ry="13" fill={`url(#${id}-iris)`}/>
        <ellipse className="eye-pupil" cx="16" cy="16" rx="0.9" ry="10" fill="#040208"/>
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ReyeFlame — the BIG centerpiece. Icy/violet vertical eye with
   crackling electric rays radiating outward + sweeping page beam.
   ───────────────────────────────────────────────────────────────── */
function ReyeFlame({ size = 460, beam = false }) {
  const id = useMemoE(nextEyeId, []);
  const wrapRef = useRefE(null);

  // Pre-compute the rays once. ~36 rays of varied length, biased horizontal.
  const rays = useMemoE(() => {
    const out = [];
    const N = 36;
    for (let i = 0; i < N; i++) {
      const baseAngle = (i / N) * Math.PI * 2;
      const horizontalness = Math.abs(Math.cos(baseAngle));
      // Greater variance in length so rays feel chaotic / painterly
      const length = 10 + horizontalness * 26 + ((i * 53) % 11);
      const angle = baseAngle + ((i * 7) % 5 - 2) * 0.06;
      out.push({
        points: buildRay(angle, length, i * 137 + 23),
        opacity: 0.45 + (i % 6) * 0.10,
        width: 0.35 + ((i * 3) % 5) * 0.22,
        animDelay: ((i * 137) % 1000) + 'ms',
      });
    }
    return out;
  }, []);

  // Pupil drift — eye looks around
  useEffectE(() => {
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const t = (now - t0) / 1000;
      const ax = Math.sin(t * 0.55) * 0.8;
      const ay = Math.sin(t * 0.41 + 1.2) * 2.0;
      const el = wrapRef.current?.querySelector('.flame-pupil');
      if (el) el.setAttribute('transform', `translate(${ax} ${ay})`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={wrapRef} className={`flame-wrap ${beam ? 'has-beam' : ''}`}
         style={{ width: size, height: size }} aria-hidden="true">

      {beam && (
        <div className="flame-beam-stage">
          <div className="flame-beam"></div>
          <div className="flame-beam flame-beam-2"></div>
        </div>
      )}

      <svg className="flame-svg" width={size} height={size}
           viewBox="0 0 80 88" style={{ overflow: 'visible' }}>
        <defs>
          {/* Iris — cool palette, white-hot core to deep violet */}
          <radialGradient id={`${id}-iris`} cx="0.5" cy="0.5" r="0.65">
            <stop offset="0%"   stopColor="#ffffff"/>
            <stop offset="8%"   stopColor="#e8f4ff"/>
            <stop offset="22%"  stopColor="#9bcaff"/>
            <stop offset="42%"  stopColor="#4f7be8"/>
            <stop offset="65%"  stopColor="#5532b8"/>
            <stop offset="85%"  stopColor="#2a1255"/>
            <stop offset="100%" stopColor="#0a0418" stopOpacity="0.85"/>
          </radialGradient>
          {/* Inner white-cyan core */}
          <radialGradient id={`${id}-core`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="1"/>
            <stop offset="35%"  stopColor="#cfe6ff" stopOpacity="0.75"/>
            <stop offset="100%" stopColor="#7ec3ff" stopOpacity="0"/>
          </radialGradient>
          {/* Outer cool haze */}
          <radialGradient id={`${id}-haze`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%"   stopColor="#6d9eff" stopOpacity="0.4"/>
            <stop offset="50%"  stopColor="#5a32c8" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#0a0418" stopOpacity="0"/>
          </radialGradient>
          {/* Far halo */}
          <radialGradient id={`${id}-halo`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%"   stopColor="#7e6dff" stopOpacity="0.32"/>
            <stop offset="55%"  stopColor="#4528a0" stopOpacity="0.10"/>
            <stop offset="100%" stopColor="#0a0418" stopOpacity="0"/>
          </radialGradient>
          {/* Ray stroke — bright white center fading to violet */}
          <linearGradient id={`${id}-ray-h`} x1="0" y1="0.5" x2="1" y2="0.5">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.95"/>
            <stop offset="20%"  stopColor="#a8c8ff" stopOpacity="0.85"/>
            <stop offset="55%"  stopColor="#6d6dff" stopOpacity="0.45"/>
            <stop offset="100%" stopColor="#5a32c8" stopOpacity="0"/>
          </linearGradient>

          {/* Subtle turbulence on the iris (more painterly now) */}
          <filter id={`${id}-iris-shimmer`} x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed="9">
              <animate attributeName="baseFrequency"
                       dur="4s" values="0.6;0.95;0.6" repeatCount="indefinite"/>
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="2.8"/>
          </filter>

          {/* Tower body gradient — dark navy core, violet rim-lit edges */}
          <linearGradient id={`${id}-tower`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#3a2870" stopOpacity="0.95"/>
            <stop offset="25%"  stopColor="#0d0822"/>
            <stop offset="50%"  stopColor="#04020e"/>
            <stop offset="75%"  stopColor="#0d0822"/>
            <stop offset="100%" stopColor="#3a2870" stopOpacity="0.95"/>
          </linearGradient>
          <linearGradient id={`${id}-tower-spike`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#5a44a8"/>
            <stop offset="100%" stopColor="#0d0822"/>
          </linearGradient>
          {/* Soft outer glow */}
          <filter id={`${id}-bigGlow`} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="0.7" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Glow specifically for rays */}
          <filter id={`${id}-rayGlow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.35"/>
          </filter>
        </defs>

        {/* Far atmospheric halo — soft violet */}
        <ellipse cx="40" cy="44" rx="42" ry="36" fill={`url(#${id}-halo)`} className="flame-halo"/>

        {/* Lightning rays — radiate from the iris outward */}
        <g className="flame-rays" filter={`url(#${id}-rayGlow)`}>
          {rays.map((r, i) => (
            <polyline
              key={i}
              points={r.points}
              stroke={`url(#${id}-ray-h)`}
              strokeWidth={r.width}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity={r.opacity}
              style={{ '--d': r.animDelay }}
              className="ray"
            />
          ))}
        </g>

        {/* Flame haze envelope (now cool) */}
        <ellipse cx="40" cy="44" rx="20" ry="30" fill={`url(#${id}-haze)`} className="flame-haze"/>

        <g filter={`url(#${id}-bigGlow)`}>
          {/* Iris — shimmer-distorted, vertical ellipse */}
          <g filter={`url(#${id}-iris-shimmer)`}>
            <ellipse cx="40" cy="44" rx="13" ry="22" fill={`url(#${id}-iris)`} className="flame-iris"/>
            <ellipse cx="40" cy="44" rx="5"  ry="11" fill={`url(#${id}-core)`} className="flame-core"/>
          </g>

          {/* Pupil — gothic tower silhouette standing inside the eye.
              Drifts vertically a tiny amount; body has a violet rim-light gradient
              so the middle isn't a flat black line. */}
          <g className="flame-pupil">
            {/* Body */}
            <path d="M 38.3 58 L 38.3 30 L 37.6 28.5 L 37.6 27.2
                     L 38.4 27 L 38.6 22 L 39.0 27
                     L 39.4 27 L 39.7 18.5 L 40.0 27
                     L 40.3 18.5 L 40.6 27
                     L 41.0 27 L 41.4 22 L 41.6 27
                     L 42.4 27.2 L 42.4 28.5 L 41.7 30
                     L 41.7 58 L 42.6 61 L 37.4 61 Z"
                  fill={`url(#${id}-tower)`}/>
            {/* Spike tip highlights (subtle violet glow at the very top of each spike) */}
            <path d="M 38.5 22.5 L 38.6 22 L 38.7 23 Z" fill="#9b7eff" opacity="0.85"/>
            <path d="M 39.85 19 L 40.0 18.5 L 40.15 19 Z" fill="#bca8ff" opacity="0.95"/>
            <path d="M 41.3 22.5 L 41.4 22 L 41.5 23 Z" fill="#9b7eff" opacity="0.85"/>
            {/* Faint glowing seam down the centre — contrast against black */}
            <path d="M 40 28 L 40 56" stroke="#3a1e7a" strokeWidth="0.25" opacity="0.6"/>
          </g>
        </g>
      </svg>
    </div>
  );
}

window.EyeMark = EyeMark;
window.ReyeFlame = ReyeFlame;
