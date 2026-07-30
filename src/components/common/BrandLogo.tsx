import cyderCupLogo from "../../assets/logos/cyder-cup-logo.png";

interface BrandLogoProps {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

export default function BrandLogo({
  className = "",
  imageClassName = "",
  priority = false,
}: BrandLogoProps) {
  return (
    <div className={className}>
      <img
        src={cyderCupLogo}
        alt="Cyder Cup"
        className={imageClassName}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </div>
  );
}