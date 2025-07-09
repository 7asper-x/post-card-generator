"use client";
import React, { useState, useRef } from "react";
import {
  PostCardCanvas,
  PostCardCanvasRef,
} from "../components/PostCardCanvas";
import { fontOptions } from "../components/PostCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Icons } from "../components/ui/icons";

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(
    undefined
  );
  const [backgroundColor, setBackgroundColor] = useState("#10b981");
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.8);
  const [textColor, setTextColor] = useState("#ffffff");
  const [imageSize, setImageSize] = useState<"3:4" | "1:1">("3:4");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [titleSize, setTitleSize] = useState(24);
  const [contentSize, setContentSize] = useState(16);
  const [outputFormat, setOutputFormat] = useState<"png" | "jpg">("png");
  const [locale, setLocale] = useState<"en" | "zh">("en");
  const [exportResolution, setExportResolution] = useState<
    "1x" | "2x" | "3x" | "4x"
  >("3x");
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<PostCardCanvasRef>(null);

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
        const scale = parseInt(exportResolution.replace("x", ""));
        const baseWidth = 400;
        const baseHeight = imageSize === "3:4" ? 534 : 400;
        const width = baseWidth * scale;
        const height = baseHeight * scale;

        const dataUrl = await cardRef.current.exportImage(outputFormat, scale);

        // Detect iOS devices
        const isIOS =
          /iPad|iPhone|iPod/.test(navigator.userAgent) ||
          (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

        if (isIOS) {
          // For iOS: Open image in new tab with instructions
          const newWindow = window.open();
          if (newWindow) {
            newWindow.document.write(`
              <html>
                <head>
                  <title>Your Post Card</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    body { 
                      margin: 0; 
                      padding: 20px; 
                      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                      background: #f5f5f5;
                      text-align: center;
                    }
                    .container {
                      max-width: 600px;
                      margin: 0 auto;
                      background: white;
                      border-radius: 12px;
                      padding: 20px;
                      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    img { 
                      max-width: 100%; 
                      height: auto; 
                      border-radius: 8px;
                      margin: 20px 0;
                    }
                    .instructions {
                      background: #e6f7ff;
                      padding: 15px;
                      border-radius: 8px;
                      margin: 15px 0;
                      border-left: 4px solid #1890ff;
                    }
                    .steps {
                      text-align: left;
                      margin: 10px 0;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <h2>🎉 Your Post Card is Ready!</h2>
                    <img src="${dataUrl}" alt="Post Card" />
                    
                    <div class="instructions">
                      <h3>📱 How to save on iOS:</h3>
                      <div class="steps">
                        <p><strong>1.</strong> Press and hold the image above</p>
                        <p><strong>2.</strong> Select "Save to Photos" or "Download Image"</p>
                        <p><strong>3.</strong> The image will be saved to your Photos app</p>
                      </div>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">
                      Resolution: ${width}×${height}px | Format: ${outputFormat.toUpperCase()}
                    </p>
                  </div>
                </body>
              </html>
            `);
            newWindow.document.close();
          }
        } else {
          // For desktop and Android: Use standard download
          const link = document.createElement("a");
          link.download = `post-card-${width}x${height}.${outputFormat}`;
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
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
                <Slider
                  value={[titleSize]}
                  onValueChange={(val) => setTitleSize(val[0])}
                  min={16}
                  max={48}
                  step={1}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <Label className="font-semibold text-emerald-700">
                  Content Size: {contentSize}px
                </Label>
                <Slider
                  value={[contentSize]}
                  onValueChange={(val) => setContentSize(val[0])}
                  min={12}
                  max={32}
                  step={1}
                  className="w-full mt-2"
                />
              </div>
            </div>

            <div>
              <Label className="font-semibold text-emerald-700">
                Background Color
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
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
              <Slider
                value={[backgroundOpacity]}
                onValueChange={(val) => setBackgroundOpacity(val[0])}
                min={0}
                max={1}
                step={0.1}
                className="w-full mt-2"
              />
            </div>

            <div>
              <Label className="font-semibold text-emerald-700">
                Text Color
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-12 h-10 rounded border"
                />
                <Input
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold text-emerald-700">
                  Output Format
                </Label>
                <Select
                  value={outputFormat}
                  onValueChange={(value: "png" | "jpg") =>
                    setOutputFormat(value)
                  }
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

              <div>
                <Label className="font-semibold text-emerald-700">
                  Export Resolution
                </Label>
                <Select
                  value={exportResolution}
                  onValueChange={(value: "1x" | "2x" | "3x" | "4x") =>
                    setExportResolution(value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1x">1x (400px)</SelectItem>
                    <SelectItem value="2x">2x (800px)</SelectItem>
                    <SelectItem value="3x">3x (1200px)</SelectItem>
                    <SelectItem value="4x">4x (1600px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Preview & Download */}
        <div className="flex flex-col items-center gap-4 w-full lg:w-1/2">
          <div className="w-full flex justify-center">
            <PostCardCanvas
              ref={cardRef}
              title={title}
              content={content}
              backgroundImage={backgroundImage}
              backgroundColor={backgroundColor}
              backgroundOpacity={backgroundOpacity}
              textColor={textColor}
              imageSize={imageSize}
              fontFamily={fontFamily}
              titleSize={titleSize}
              contentSize={contentSize}
              // locale={locale}
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
