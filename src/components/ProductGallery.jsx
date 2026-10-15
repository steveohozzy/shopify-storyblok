
"use client";

import Image from "next/image";
import { useState, useRef } from "react";

const getShopifyImage = (url, width) => {
  if (!url) return "";

  try {
    const imageUrl = new URL(url);
    imageUrl.searchParams.set("width", width.toString());
    return imageUrl.toString();
  } catch {
    return url;
  }
};

const cleanYoutubeUrl = (url) => {
  if (!url) return "";

  try {
    const videoUrl = new URL(url);

    if (
      videoUrl.hostname.includes("youtube.com") &&
      videoUrl.searchParams.get("v")
    ) {
      return `https://www.youtube.com/embed/${videoUrl.searchParams.get("v")}`;
    }

    if (videoUrl.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${videoUrl.pathname}`;
    }

    return url;
  } catch {
    return url;
  }
};

export default function ProductGallery({ media, title }) {
  const items = media?.edges || [];
  const [active, setActive] = useState(0);
  const [zoomedIndex, setZoomedIndex] = useState(null);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [playingVideo, setPlayingVideo] = useState(null);

  const trackRef = useRef(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  const goTo = (index) => {
    setPlayingVideo(null);

    if (index < 0) {
      setActive(items.length - 1);
    } else if (index >= items.length) {
      setActive(0);
    } else {
      setActive(index);
    }
  };

  const onPointerDown = (event) => {
    isDragging.current = true;
    startX.current = event.clientX;
    currentX.current = event.clientX;

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!isDragging.current) return;

    currentX.current = event.clientX;

    const diff = currentX.current - startX.current;

    if (trackRef.current) {
      trackRef.current.style.transition = "none";
      trackRef.current.style.transform =
        `translateX(calc(${-active * 100}% + ${diff}px))`;
    }
  };

  const onPointerUp = () => {
    if (!isDragging.current) return;

    const diff = currentX.current - startX.current;
    isDragging.current = false;

    if (trackRef.current) {
      trackRef.current.style.transition = "transform 300ms ease";
    }

    if (diff < -60) {
      goTo(active + 1);
    } else if (diff > 60) {
      goTo(active - 1);
    } else {
      goTo(active);
    }
  };

  const renderMedia = (node, index) => {
    switch (node.__typename) {
      case "MediaImage": {
        const src = node.image?.url;

        if (!src) return null;

        return (
          <Image
            src={src}
            alt={node.image?.altText || title || ""}
            width={1200}
            height={1200}
            sizes="(min-width: 768px) 50vw, 100vw"
            draggable={false}
            priority={index === 0}
            className="h-full w-full object-cover"
          />
        );
      }

      case "Video": {
        const source = node.sources?.[0];

        if (!source?.url) return null;

        return (
          <video
            controls
            playsInline
            className="h-full w-full object-cover"
          >
            <source src={source.url} type={source.mimeType} />
          </video>
        );
      }

      case "ExternalVideo": {
        const isPlaying = playingVideo === index;
        const videoUrl = cleanYoutubeUrl(node.embeddedUrl);

        return (
          <div className="relative h-full w-full">
            <iframe
              src={
                isPlaying
                  ? `${videoUrl}${videoUrl.includes("?") ? "&" : "?"}autoplay=1`
                  : videoUrl
              }
              title={`${title || "Product"} video`}
              className={`h-full w-full ${
                isPlaying ? "pointer-events-auto" : "pointer-events-none"
              }`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

            {!isPlaying && (
              <button
                type="button"
                aria-label="Play product video"
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/20"
                onClick={() => setPlayingVideo(index)}
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-3xl shadow-lg">
                  ▶
                </span>
              </button>
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  const isVideoSlide = (index) =>
    items[index]?.node.__typename !== "MediaImage";

  if (!items.length) {
    return (
      <div className="flex aspect-square items-center justify-center border border-[#d9dedf] bg-[#edf1f1] text-sm text-[#64727c]">
        No product media available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop media grid */}
      <div className="hidden grid-cols-2 md:grid">
        {items.map((item, index) => {
          const node = item.node;
          const isImage = node.__typename === "MediaImage";
          const src = isImage ? node.image?.url || "" : "";

          const zoomSrc = getShopifyImage(src, 1600);
          const gridSrc = getShopifyImage(src, 600);

          return (
            <div
              key={`${node.__typename}-${index}`}
              className={`relative aspect-[4/5] overflow-hidden ${
                isImage ? "cursor-zoom-in" : ""
              }`}
              onMouseMove={(event) => {
                if (!isImage) return;

                const rect = event.currentTarget.getBoundingClientRect();

                setZoomPos({
                  x: ((event.clientX - rect.left) / rect.width) * 100,
                  y: ((event.clientY - rect.top) / rect.height) * 100,
                });
              }}
              onMouseEnter={() => {
                if (isImage) setZoomedIndex(index);
              }}
              onMouseLeave={() => setZoomedIndex(null)}
            >
              {isImage && src ? (
                <div
                  className="h-full w-full transition-transform duration-200"
                  style={{
                    transform:
                      zoomedIndex === index ? "scale(2)" : "scale(1)",
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  }}
                >
                  <Image
                    src={zoomedIndex === index ? zoomSrc : gridSrc}
                    alt={node.image?.altText || title || ""}
                    width={1600}
                    height={2000}
                    priority={index === 0}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                renderMedia(node, index)
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile media carousel */}
      <div className="md:hidden">
        <div
          className="relative aspect-square select-none overflow-hidden rounded-xl border border-[#d9dedf] bg-white"
          style={{ touchAction: "pan-y" }}
        >
          <div
            ref={trackRef}
            className="flex h-full w-full transition-transform duration-300"
            style={{
              transform: `translateX(-${active * 100}%)`,
            }}
          >
            {items.map((item, index) => (
              <div
                key={`${item.node.__typename}-${index}`}
                className="h-full min-w-full shrink-0"
              >
                {renderMedia(item.node, index)}
              </div>
            ))}
          </div>

          {!isVideoSlide(active) && (
            <div
              className="absolute inset-0 z-10"
              style={{ touchAction: "pan-y" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            />
          )}

          {items.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous product image"
                className="absolute left-0 top-0 z-20 h-full w-16"
                onClick={() => goTo(active - 1)}
              />

              <button
                type="button"
                aria-label="Next product image"
                className="absolute right-0 top-0 z-20 h-full w-16"
                onClick={() => goTo(active + 1)}
              />

              <div className="pointer-events-none absolute inset-0 z-30">
                <span className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-2xl font-bold text-white shadow-lg">
                  ‹
                </span>

                <span className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-2xl font-bold text-white shadow-lg">
                  ›
                </span>
              </div>
            </>
          )}
        </div>

        {items.length > 1 && (
          <div className="mt-3 flex justify-center gap-2">
            {items.map((item, index) => (
              <button
                key={`${item.node.__typename}-dot-${index}`}
                type="button"
                aria-label={`View media ${index + 1} of ${items.length}`}
                aria-pressed={active === index}
                onClick={() => goTo(index)}
                className={`h-2 rounded-full transition-all ${
                  active === index
                    ? "w-6 bg-[#0a9df5]"
                    : "w-2 bg-[#d9dedf]"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
