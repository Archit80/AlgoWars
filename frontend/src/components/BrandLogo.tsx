import { GraduationCap } from "lucide-react";

const BrandLogo = ({ size = 36 }: { size?: number }) => (
  <span
    className="inline-flex items-center justify-center rounded-md bg-blue-700 text-white shrink-0"
    style={{ width: size, height: size }}
    aria-hidden="true"
  >
    <GraduationCap style={{ width: size * 0.58, height: size * 0.58 }} />
  </span>
);

export default BrandLogo;
