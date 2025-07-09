"use client";
import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

interface PostCardCanvasProps {
  title: string;
  content: string;
  backgroundImage?: string;
  backgroundColor?: string;
  backgroundOpacity?: number;
  imageSize: "3:4" | "1:1";
  fontFamily: string;
  titleSize: number;
  contentSize: number;
  textColor?: string;
  scale?: number;
}

export interface PostCardCanvasRef {
  exportImage: (format: "png" | "jpg", scale: number) => Promise<string>;
}

export const PostCardCanvas = forwardRef<
  PostCardCanvasRef,
  PostCardCanvasProps
>(
  (
    {
      title,
      content,
      backgroundImage,
      backgroundColor = "#10b981",
      backgroundOpacity = 0.8,
      imageSize = "3:4",
      fontFamily = "Inter",
      titleSize = 24,
      contentSize = 16,
      textColor = "#ffffff",
      scale = 1,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawCard = async (
      canvas: HTMLCanvasElement,
      scaleFactor: number = 1
    ) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const baseWidth = 400;
      const baseHeight = imageSize === "3:4" ? 534 : 400;
      const width = baseWidth * scaleFactor;
      const height = baseHeight * scaleFactor;

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${baseWidth}px`;
      canvas.style.height = `${baseHeight}px`;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw background
      if (backgroundImage) {
        try {
          const img = new Image();
          img.crossOrigin = "anonymous";
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = reject;
            img.src = backgroundImage;
          });

          // Calculate dimensions to maintain aspect ratio (like object-fit: cover)
          const imgAspect = img.width / img.height;
          const canvasAspect = width / height;

          let drawWidth, drawHeight, offsetX, offsetY;

          if (imgAspect > canvasAspect) {
            // Image is wider than canvas ratio - fit to height and crop sides
            drawHeight = height;
            drawWidth = height * imgAspect;
            offsetX = (width - drawWidth) / 2;
            offsetY = 0;
          } else {
            // Image is taller than canvas ratio - fit to width and crop top/bottom
            drawWidth = width;
            drawHeight = width / imgAspect;
            offsetX = 0;
            offsetY = (height - drawHeight) / 2;
          }

          // Draw background image with proper aspect ratio
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

          // Draw overlay
          ctx.fillStyle = backgroundColor;
          ctx.globalAlpha = backgroundOpacity;
          ctx.fillRect(0, 0, width, height);
          ctx.globalAlpha = 1;
        } catch (error) {
          console.warn("Failed to load background image:", error);
          // Fallback to solid color
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, width, height);
        }
      } else {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }

      // Apply border radius (approximation with clipping path)
      ctx.save();
      const radius = 12 * scaleFactor;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(width - radius, 0);
      ctx.quadraticCurveTo(width, 0, width, radius);
      ctx.lineTo(width, height - radius);
      ctx.quadraticCurveTo(width, height, width - radius, height);
      ctx.lineTo(radius, height);
      ctx.quadraticCurveTo(0, height, 0, height - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.clip();

      // Setup text rendering
      ctx.fillStyle = textColor;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      // Add text shadow effect
      const shadowBlur = 3 * scaleFactor;
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 1 * scaleFactor;

      const padding = 24 * scaleFactor;
      const textStartY =
        height / 2 - (titleSize + contentSize + 16) * scaleFactor;

      // Draw title
      if (title) {
        ctx.font = `bold ${
          titleSize * scaleFactor
        }px ${fontFamily}, system-ui, sans-serif`;
        const titleLines = wrapText(
          ctx,
          title,
          width - padding * 2
          // titleSize * scaleFactor
        );
        let titleY = textStartY;

        titleLines.forEach((line) => {
          ctx.fillText(line, padding, titleY);
          titleY += titleSize * scaleFactor * 1.2;
        });
      }

      // Draw content
      if (content) {
        ctx.font = `500 ${
          contentSize * scaleFactor
        }px ${fontFamily}, system-ui, sans-serif`;
        const contentLines = wrapText(
          ctx,
          content,
          width - padding * 2
          // contentSize * scaleFactor
        );
        let contentY =
          textStartY + titleSize * scaleFactor * 1.2 + 16 * scaleFactor;

        contentLines.forEach((line) => {
          ctx.fillText(line, padding, contentY);
          contentY += contentSize * scaleFactor * 1.4;
        });
      }

      ctx.restore();
    };

    // Helper function to wrap text
    const wrapText = (
      ctx: CanvasRenderingContext2D,
      text: string,
      maxWidth: number
      // lineHeight: number
    ): string[] => {
      const words = text.split(" ");
      const lines: string[] = [];
      let currentLine = "";

      for (const word of words) {
        const testLine = currentLine + (currentLine ? " " : "") + word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      return lines;
    };

    useImperativeHandle(ref, () => ({
      exportImage: async (
        format: "png" | "jpg",
        exportScale: number
      ): Promise<string> => {
        if (!canvasRef.current) throw new Error("Canvas not ready");

        // Create a temporary canvas for high-res export
        const exportCanvas = document.createElement("canvas");
        await drawCard(exportCanvas, exportScale);

        const quality = format === "jpg" ? 0.95 : undefined;
        const mimeType = format === "jpg" ? "image/jpeg" : "image/png";

        return exportCanvas.toDataURL(mimeType, quality);
      },
    }));

    useEffect(() => {
      if (canvasRef.current) {
        drawCard(canvasRef.current, scale);
      }
    }, [
      title,
      content,
      backgroundImage,
      backgroundColor,
      backgroundOpacity,
      imageSize,
      fontFamily,
      titleSize,
      contentSize,
      textColor,
      scale,
    ]);

    const baseWidth = 400;
    const baseHeight = imageSize === "3:4" ? 534 : 400;

    return (
      <canvas
        ref={canvasRef}
        className="shadow-xl rounded-xl max-w-full"
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          maxWidth: "100%",
        }}
      />
    );
  }
);

PostCardCanvas.displayName = "PostCardCanvas";

export default PostCardCanvas;
