export function FincoMark({ size = 28 }: { size?: number }) {
  // Semn de brand inline — flacara portocalie + badge grafit, evoca logo-ul.
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-label="FINCO">
      <rect x="3" y="6" width="20" height="20" rx="3" fill="#3D3D3D" />
      <path d="M22 8 C 28 14, 28 22, 22 26 C 26 22, 26 14, 22 10 Z" fill="#F26B22" />
      <circle cx="9" cy="11" r="1.4" fill="#FAFAF9" />
    </svg>
  );
}
