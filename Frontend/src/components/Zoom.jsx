import React, { useRef } from "react";

function ImageMagnifier({ src, alt, zoom = 2.5, lensSize = 180 }) {
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const lensRef = useRef(null);

  const handleMove = (e) => {
    const container = containerRef.current;
    const lens = lensRef.current;
    const img = imgRef.current;

    if (!container || !lens || !img) return;

    const { left, top, width, height } = container.getBoundingClientRect();
    let x = e.clientX - left;
    let y = e.clientY - top;

    // Show lens on hover
    lens.style.display = "block";

    // Apply zoomed background image
    lens.style.backgroundImage = `url(${src})`;
    lens.style.backgroundSize = `${width * zoom}px ${height * zoom}px`;

    // Prevent lens from going outside the image
    x = Math.max(lensSize / 2, Math.min(x, width - lensSize / 2));
    y = Math.max(lensSize / 2, Math.min(y, height - lensSize / 2));

    // Position the lens
    lens.style.left = `${x - lensSize / 2}px`;
    lens.style.top = `${y - lensSize / 2}px`;

    // Move zoom background
    lens.style.backgroundPosition = `
      -${x * zoom - lensSize / 2}px 
      -${y * zoom - lensSize / 2}px
    `;
  };

  const handleLeave = () => {
    lensRef.current.style.display = "none";
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-zoom-in"
    >
      {/* Product Image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />

      {/* Square Magnifier Lens */}
      <div
        ref={lensRef}
        className="absolute pointer-events-none hidden border-2 border-black shadow-lg"
        style={{
          width: lensSize,
          height: lensSize,
          backgroundRepeat: "no-repeat",
          borderRadius: "6px", // square (set to 0 if needed)
        }}
      ></div>
    </div>
  );
}

export default ImageMagnifier;
