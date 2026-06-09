import "./Skeleton.css";

export type SkeletonProps = {
  width?: string | number;
  height?: number;
  radius?: number;
};

export function Skeleton({ width = "100%", height = 16, radius = 6 }: SkeletonProps) {
  return <span className="skeleton" style={{ width, height, borderRadius: radius }} />;
}

// Randuri placeholder pentru tabele/liste in timpul incarcarii.
export function SkeletonRows({ rows = 5, height = 44 }: { rows?: number; height?: number }) {
  return (
    <div className="skeleton-rows">
      {Array.from({ length: rows }).map((_, i) => (
        <span key={i} className="skeleton" style={{ height, borderRadius: 8 }} />
      ))}
    </div>
  );
}
