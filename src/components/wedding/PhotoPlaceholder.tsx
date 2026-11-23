import { Camera } from "lucide-react";

export const PhotoPlaceholder = ({ aspect = "aspect-[4/5]" }: { aspect?: string }) => (
  <div role="img" aria-label="Empty photo placeholder" className={`photo-placeholder w-full ${aspect}`}>
    <span className="photo-placeholder-mark" aria-hidden="true">
      <Camera className="h-5 w-5" />
    </span>
  </div>
);