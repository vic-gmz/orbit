export default function OrbitMark({
  size = 28,
  className = "text-sun",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="orbit-sun-grad"
          x1="0"
          y1="0"
          x2="44"
          y2="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F6C177" />
          <stop offset="1" stopColor="#E47A5A" />
        </linearGradient>
      </defs>
      <circle cx="22" cy="22" r="8.5" fill="url(#orbit-sun-grad)" />
      <ellipse
        cx="22"
        cy="22"
        rx="19.5"
        ry="8.5"
        transform="rotate(-26 22 22)"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="38.5" cy="13" r="2.2" fill="currentColor" />
    </svg>
  );
}
