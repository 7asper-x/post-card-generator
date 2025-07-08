import React, { forwardRef } from "react";

interface PostCardProps {
  title: string;
  content: string;
  backgroundImage?: string;
  backgroundColor?: string;
  backgroundOpacity?: number;
  imageSize: "3:4" | "1:1";
  fontFamily: string;
  titleSize: number;
  contentSize: number;
  locale?: "en" | "zh";
}

const fontOptions = {
  en: [
    { value: "Inter", label: "Inter", cssVar: "var(--font-inter)" },
    { value: "Poppins", label: "Poppins", cssVar: "var(--font-poppins)" },
    { value: "Roboto", label: "Roboto", cssVar: "var(--font-roboto)" },
    { value: "Open Sans", label: "Open Sans", cssVar: "var(--font-open-sans)" },
    {
      value: "Montserrat",
      label: "Montserrat",
      cssVar: "var(--font-montserrat)",
    },
  ],
  zh: [
    {
      value: "Noto Sans SC",
      label: "思源黑体",
      cssVar: "var(--font-noto-sans-sc)",
    },
    {
      value: "Noto Serif SC",
      label: "思源宋体",
      cssVar: "var(--font-noto-serif-sc)",
    },
    { value: "Inter", label: "Inter", cssVar: "var(--font-inter)" },
    { value: "Poppins", label: "Poppins", cssVar: "var(--font-poppins)" },
    { value: "Roboto", label: "Roboto", cssVar: "var(--font-roboto)" },
  ],
};

export const PostCard = forwardRef<HTMLDivElement, PostCardProps>(
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
      locale = "en",
    },
    ref
  ) => {
    const aspectRatio = imageSize === "3:4" ? "aspect-[3/4]" : "aspect-square";
    // Find the font CSS variable
    const allFonts = [...fontOptions.en, ...fontOptions.zh];
    const selectedFont = allFonts.find((font) => font.value === fontFamily);
    const fontCSS = selectedFont?.cssVar || "var(--font-inter)";
    return (
      <div
        ref={ref}
        className={`relative w-full max-w-[400px] ${aspectRatio} shadow-xl overflow-hidden flex items-center justify-center p-6 text-white`}
        style={{
          backgroundImage: backgroundImage
            ? `url(${backgroundImage})`
            : undefined,
          backgroundColor: backgroundImage ? undefined : backgroundColor,
          backgroundSize: backgroundImage ? "cover" : undefined,
          backgroundPosition: backgroundImage ? "center" : undefined,
          fontFamily: fontCSS,
        }}
      >
        {backgroundImage && (
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundColor: backgroundColor,
              opacity: backgroundOpacity,
            }}
          />
        )}
        <div className="relative z-10 flex flex-col items-center justify-center gap-2 max-w-full">
          <h2
            className="font-bold break-words leading-tight drop-shadow-md text-left w-full"
            style={{ fontSize: `${titleSize}px` }}
          >
            {title}
          </h2>
          <p
            className="font-medium break-words whitespace-pre-line drop-shadow-sm text-left w-full"
            style={{ fontSize: `${contentSize}px` }}
          >
            {content}
          </p>
        </div>
      </div>
    );
  }
);

export { fontOptions };
export default PostCard;
