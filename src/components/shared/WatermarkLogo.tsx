import Image from "next/image";

interface WatermarkLogoProps {
  opacity?: number;
  size?: number;
  className?: string;
}

export default function WatermarkLogo({
  opacity = 0.07,
  size = 500,
  className = "",
}: WatermarkLogoProps) {
  return (
    <div
      className={`pointer-events-none absolute left-1/2 top-1/2 select-none ${className}`}
      style={{
        transform: "translate(-50%, -50%) rotate(-5deg)",
        animation: "watermark-float 8s ease-in-out infinite",
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      <Image
        src="/logo.png"
        alt=""
        width={size}
        height={size}
        className="object-contain"
        style={{
          opacity,
          filter: "blur(1px) grayscale(20%)",
          width: `${size}px`,
          height: `${size}px`,
          maxWidth: "90vw",
          maxHeight: "90vw",
        }}
        priority={false}
      />
    </div>
  );
}
