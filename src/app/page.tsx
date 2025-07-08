"use client";
import React, { useState, useRef } from "react";
import { PostCard, fontOptions } from "../components/PostCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Icons } from "../components/ui/icons";
import domtoimage from "dom-to-image";

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(
    undefined
  );
  const [backgroundColor, setBackgroundColor] = useState("#10b981");
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.8);
  const [imageSize, setImageSize] = useState<"3:4" | "1:1">("3:4");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [titleSize, setTitleSize] = useState(24);
  const [contentSize, setContentSize] = useState(16);
  const [outputFormat, setOutputFormat] = useState<"png" | "jpg">("png");
  const [locale, setLocale] = useState<"en" | "zh">("en");
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setBackgroundImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (cardRef.current) {
      setIsDownloading(true);
      try {
        const scale = 1;
        const baseWidth = 400;
        const baseHeight = imageSize === "3:4" ? 534 : 400;
        const width = baseWidth * scale;
        const height = baseHeight * scale;
        const originalStyle = cardRef.current.getAttribute("style") || "";
        // Temporarily set export size/styles on the real card
        cardRef.current.style.width = `${width}px`;
        cardRef.current.style.height = `${height}px`;
        cardRef.current.style.maxWidth = "unset";
        cardRef.current.style.maxHeight = "unset";
        cardRef.current.style.boxSizing = "border-box";
        cardRef.current.style.padding = `${24 * scale}px`;

        const dataUrl = await domtoimage.toPng(cardRef.current, {
          quality: 1.0,
          bgcolor: undefined,
          width,
          height,
          style: { width: `${width}px`, height: `${height}px` },
        });
        const link = document.createElement("a");
        link.download = `post-card.png`;
        link.href = dataUrl;
        link.click();
        // Restore original style
        cardRef.current.setAttribute("style", originalStyle);
      } catch (error) {
        console.error("Download error:", error);
        alert("Download failed. Please try again.");
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const clearBackgroundImage = () => {
    setBackgroundImage(undefined);
  };

  // Helper function to convert hex to RGB (keeping for potential future use)
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-emerald-700 text-center">
        Post Card Generator
      </h1>
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Form */}
        <div className="flex flex-col gap-6 w-full lg:w-1/2 bg-white rounded-xl shadow p-6 max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="font-semibold text-emerald-700">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your post title"
                maxLength={60}
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="content"
                className="font-semibold text-emerald-700"
              >
                Content
              </Label>
              <textarea
                id="content"
                className="w-full border rounded-md px-3 py-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                maxLength={300}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold text-emerald-700">
                  Image Size
                </Label>
                <Select
                  value={imageSize}
                  onValueChange={(value: "3:4" | "1:1") => setImageSize(value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3:4">3:4 (Portrait)</SelectItem>
                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="font-semibold text-emerald-700">
                  Language
                </Label>
                <Select
                  value={locale}
                  onValueChange={(value: "en" | "zh") => setLocale(value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="font-semibold text-emerald-700">
                Font Family
              </Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions[locale].map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold text-emerald-700">
                  Title Size: {titleSize}px
                </Label>
                <input
                  type="range"
                  min="16"
                  max="48"
                  value={titleSize}
                  onChange={(e) => setTitleSize(Number(e.target.value))}
                  className="w-full mt-1"
                />
              </div>

              <div>
                <Label className="font-semibold text-emerald-700">
                  Content Size: {contentSize}px
                </Label>
                <input
                  type="range"
                  min="12"
                  max="32"
                  value={contentSize}
                  onChange={(e) => setContentSize(Number(e.target.value))}
                  className="w-full mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="font-semibold text-emerald-700">
                Background Color
              </Label>
              <div className="flex gap-2 mt-1">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-12 h-10 rounded border"
                />
                <Input
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  placeholder="#10b981"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label className="font-semibold text-emerald-700">
                Background Opacity: {Math.round(backgroundOpacity * 100)}%
              </Label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={backgroundOpacity}
                onChange={(e) => setBackgroundOpacity(Number(e.target.value))}
                className="w-full mt-1"
              />
            </div>

            <div>
              <Label className="font-semibold text-emerald-700">
                Background Image
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1"
                />
                {backgroundImage && (
                  <Button
                    onClick={clearBackgroundImage}
                    variant="outline"
                    size="sm"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            <div>
              <Label className="font-semibold text-emerald-700">
                Output Format
              </Label>
              <Select
                value={outputFormat}
                onValueChange={(value: "png" | "jpg") => setOutputFormat(value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpg">JPG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Preview & Download */}
        <div className="flex flex-col items-center gap-4 w-full lg:w-1/2">
          <div className="w-full flex justify-center">
            <PostCard
              ref={cardRef}
              title={title}
              content={content}
              backgroundImage={backgroundImage}
              backgroundColor={backgroundColor}
              backgroundOpacity={backgroundOpacity}
              imageSize={imageSize}
              fontFamily={fontFamily}
              titleSize={titleSize}
              contentSize={contentSize}
              locale={locale}
            />
          </div>
          <Button
            onClick={handleDownload}
            className="w-full lg:w-auto bg-emerald-600 hover:bg-emerald-700"
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Download as " + outputFormat.toUpperCase()
            )}
          </Button>
        </div>
      </div>
      {/* <footer className="mt-10 text-xs text-gray-400 text-center">
        © {new Date().getFullYear()} Post Card Generator. Built with Next.js,
        Tailwind CSS, and shadcn/ui.
      </footer> */}
    </div>
  );
}
