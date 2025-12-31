import React, { useRef, useState } from "react";

interface HoverLinkPreviewProps {
  href: string;
  previewImage: string;
  imageAlt?: string;
  children: React.ReactNode;
  className?: string;
}

export const HoverLinkPreview: React.FC<HoverLinkPreviewProps> = ({
  href,
  previewImage,
  imageAlt = "Link preview",
  children,
  className,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, rotate: 0 });
  const prevX = useRef<number | null>(null);

  // Handlers
  const handleMouseEnter = () => {
    setShowPreview(true);
    prevX.current = null;
  };

  const handleMouseLeave = () => {
    setShowPreview(false);
    prevX.current = null;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const PREVIEW_WIDTH = 192;
    const PREVIEW_HEIGHT = 112;
    const OFFSET_Y = 40;

    // Calculate rotation based on movement
    let newRotate = 0;
    if (prevX.current !== null) {
      const deltaX = e.clientX - prevX.current;
      newRotate = Math.max(-15, Math.min(15, deltaX * 1.2));
    }
    prevX.current = e.clientX;

    setPosition({
      top: e.clientY - PREVIEW_HEIGHT - OFFSET_Y,
      left: e.clientX - PREVIEW_WIDTH / 2,
      rotate: newRotate
    });
  };

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className || "relative inline-block cursor-pointer text-blue-600 underline"}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {children}
      </a>

      {showPreview && (
        <div
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            transform: `rotate(${position.rotate}deg)`,
            zIndex: 100,
            pointerEvents: "none",
            transition: "transform 0.1s ease-out, top 0.1s ease-out, left 0.1s ease-out", // Simple smoothing
          }}
          className="animate-fade-in-up" // Reuse existing animation class
        >
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl p-2 w-[220px]">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100">
              <img
                src={previewImage}
                alt={imageAlt}
                draggable={false}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};