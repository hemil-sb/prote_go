import { ImageIcon, PlayCircle } from "lucide-react";

/*
  Marks a spot where the client still needs to supply real content.
  Shows what belongs here and the recommended size, so it doubles as a content brief.
*/
export default function Placeholder({
  label,
  hint,
  kind = "photo",
  tone = "light",
  className = "",
}: {
  label: string;
  hint?: string;
  kind?: "photo" | "video";
  tone?: "light" | "dark";
  className?: string;
}) {
  const Icon = kind === "video" ? PlayCircle : ImageIcon;
  const dark = tone === "dark";
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}`}
      className={`flex flex-col items-center justify-center gap-3 rounded-[1.5rem] border-2 border-dashed p-6 text-center ${
        dark ? "border-white/25 bg-white/[0.04] text-white/70" : "border-sherpa/25 bg-turquoise-tint/60 text-sherpa"
      } ${className}`}
    >
      <Icon aria-hidden className={`size-10 ${dark ? "text-turquoise" : "text-orient"}`} strokeWidth={1.3} />
      <p className={`max-w-[18rem] text-sm font-semibold ${dark ? "text-white" : "text-sherpa-deep"}`}>{label}</p>
      {hint && <p className="text-xs">{hint}</p>}
    </div>
  );
}
