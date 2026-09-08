// Set propio de íconos en línea (sin dependencias externas). Trazo único de
// 1.75px para que todos se vean consistentes entre sí.
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Svg({ size = 18, children, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...props}>
      {children}
    </svg>
  )
}

export function LogoMark({ size = 26, ...props }) {
  return (
    <Svg size={size} viewBox="0 0 28 28" {...props}>
      <rect x="1.5" y="1.5" width="25" height="25" rx="7" fill="var(--accent-soft-strong)" stroke="var(--accent)" />
      <path d="M9 14.5l3.2 3.2L19 10.5" stroke="var(--accent)" />
    </Svg>
  )
}

export function IconGrid(props) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </Svg>
  )
}

export function IconStore(props) {
  return (
    <Svg {...props}>
      <path d="M4 9.5l1.2-5h13.6l1.2 5" />
      <path d="M4 9.5c0 1.4 1.1 2.5 2.4 2.5S8.8 10.9 8.8 9.5c0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5c0 1.4 1.1 2.5 2.5 2.5s2.4-1.1 2.4-2.5" />
      <path d="M5.5 12v7.5h13V12" />
      <path d="M10 19.5V15h4v4.5" />
    </Svg>
  )
}

export function IconCard(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.2" />
      <path d="M3 10h18" />
      <path d="M7 14.5h4" />
    </Svg>
  )
}

export function IconQr(props) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="3.5" width="6" height="6" rx="1" />
      <rect x="14.5" y="3.5" width="6" height="6" rx="1" />
      <rect x="3.5" y="14.5" width="6" height="6" rx="1" />
      <path d="M14.5 15h2.5v2.5" />
      <path d="M20.5 15v2.5h-2" />
      <path d="M14.5 20.5h2.5v-1" />
      <path d="M20 20.5v-2" />
    </Svg>
  )
}

export function IconMessage(props) {
  return (
    <Svg {...props}>
      <path d="M4 5.5h16v10.5H9.2L5 20V16H4z" />
    </Svg>
  )
}

export function IconLogout(props) {
  return (
    <Svg {...props}>
      <path d="M9 4.5H5.5v15H9" />
      <path d="M20 12H10.5" />
      <path d="M16.5 8l4 4-4 4" />
    </Svg>
  )
}

export function IconScan(props) {
  return (
    <Svg {...props}>
      <path d="M4 8V5.5a1.5 1.5 0 0 1 1.5-1.5H8" />
      <path d="M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8" />
      <path d="M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16" />
      <path d="M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" />
      <path d="M4 12h16" />
    </Svg>
  )
}

export function IconStar(props) {
  return (
    <Svg {...props}>
      <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.9-5.2 2.9 1-5.9-4.3-4.2 5.9-.8z" />
    </Svg>
  )
}

export function IconTrendUp(props) {
  return (
    <Svg {...props}>
      <path d="M4 16l5.5-5.5 4 4L20 8" />
      <path d="M14.5 8H20v5.5" />
    </Svg>
  )
}

export function IconUsers(props) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19.5c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
      <path d="M15.5 6.2c1.3.3 2.3 1.5 2.3 3s-1 2.7-2.3 3" />
      <path d="M17.7 14.3c2 .5 3.3 2.1 3.3 4.2" />
    </Svg>
  )
}

export function IconShield(props) {
  return (
    <Svg {...props}>
      <path d="M12 3.5l7 2.6v5.4c0 4.6-3 7.6-7 9-4-1.4-7-4.4-7-9V6.1z" />
      <path d="M9 12l2.2 2.2L15.5 10" />
    </Svg>
  )
}

export function IconInbox(props) {
  return (
    <Svg {...props}>
      <path d="M4 12.5h4.2l1.5 2.5h4.6l1.5-2.5H20" />
      <path d="M5.8 6h12.4L20 12.5v6a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-6z" />
    </Svg>
  )
}

export function IconAlert(props) {
  return (
    <Svg {...props}>
      <path d="M12 4l9 16H3z" />
      <path d="M12 10v3.5" />
      <path d="M12 17h.01" />
    </Svg>
  )
}

export function IconCheck(props) {
  return (
    <Svg {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </Svg>
  )
}
