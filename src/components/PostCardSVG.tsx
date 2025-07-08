import React from "react";

interface PostCardSVGProps {
  width?: number;
  height?: number;
  aspect?: "3:4" | "1:1";
  title: string;
  content: string;
  backgroundColor: string;
  backgroundImage?: string;
  fontFamily: string;
  titleSize: number;
  contentSize: number;
  svgRef?: React.Ref<SVGSVGElement>;
}

export const PostCardSVG: React.FC<PostCardSVGProps> = ({
  width = 800,
  aspect = "3:4",
  title,
  content,
  backgroundColor,
  backgroundImage,
  fontFamily,
  titleSize,
  contentSize,
  svgRef,
}) => {
  const height = aspect === "3:4" ? Math.round((width * 4) / 3) : width;
  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{
        borderRadius: 32,
        overflow: "hidden",
        background: backgroundColor,
        display: "block",
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={32}
        fill={backgroundColor}
      />
      {backgroundImage && (
        <image
          href={backgroundImage}
          x={0}
          y={0}
          width={width}
          height={height}
          opacity={0.5}
          preserveAspectRatio="xMidYMid slice"
        />
      )}
      <text
        x={48}
        y={120}
        fontFamily={fontFamily}
        fontSize={titleSize}
        fill="#fff"
        fontWeight="bold"
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
      >
        {title}
      </text>
      <text
        x={48}
        y={180}
        fontFamily={fontFamily}
        fontSize={contentSize}
        fill="#fff"
        style={{ whiteSpace: "pre-line" }}
      >
        {content}
      </text>
    </svg>
  );
};

export default PostCardSVG;
