import React, { useRef } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { Download, Copy, Check, ExternalLink, Share2 } from 'lucide-react';
import type { TapframePage } from '../types';

interface QRCodeDisplayProps {
  page: TapframePage;
  size?: number;
  showCardWrapper?: boolean;
  isThumbnail?: boolean;
  onDownload?: () => void;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  page,
  size = 220,
  showCardWrapper = true,
  isThumbnail = false,
}) => {
  const [copied, setCopied] = React.useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Construct target URL
  const publicUrl = `https://qr.clearpath.click/q/${page.slug}`;

  const qrConfig = page.custom_theme?.qr_style || {
    fg_color: '#000000',
    bg_color: '#FFFFFF',
    frame_style: 'dark_pill',
    callout_text: page.headline || 'Scan to view offer',
  };

  // Generate clean, descriptive, and distinct filename
  const getCleanFilename = (ext: 'png' | 'svg') => {
    const rawName = page.headline || page.title || 'Tapframe';
    const cleanTitle = rawName
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .substring(0, 35);
    return `ClearpathQR_${cleanTitle}_${page.slug}.${ext}`;
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPNG = async () => {
    const canvas = document.createElement('canvas');
    const exportWidth = 1080;
    const exportHeight = 1080;
    canvas.width = exportWidth;
    canvas.height = exportHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const hiddenCanvas = canvasRef.current?.querySelector('canvas');
    if (!hiddenCanvas) return;

    const img = new Image();
    img.src = hiddenCanvas.toDataURL('image/png');
    img.onload = async () => {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(100, 100, 880, 880, 48);
      ctx.fill();

      ctx.drawImage(img, 190, 190, 700, 700);

      const filename = getCleanFilename('png');

      // Native mobile Web Share API for saving to camera roll / files
      if (navigator.canShare && canvas.toBlob) {
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], filename, { type: 'image/png' });
            if (navigator.canShare({ files: [file] })) {
              try {
                await navigator.share({
                  files: [file],
                  title: page.headline || page.title,
                  text: `ClearpathQR code for ${page.headline || page.title}`,
                });
                return;
              } catch (err) {
                // User cancelled or fallback to download
              }
            }
          }

          // Fallback direct download
          const a = document.createElement('a');
          a.download = filename;
          a.href = canvas.toDataURL('image/png');
          a.click();
        }, 'image/png');
      } else {
        const a = document.createElement('a');
        a.download = filename;
        a.href = canvas.toDataURL('image/png');
        a.click();
      }
    };
  };

  const downloadSVG = () => {
    const svgEl = canvasRef.current?.querySelector('svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = getCleanFilename('svg');
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  // If thumbnail mode, render ONLY the crisp QR code inside a neat container
  if (isThumbnail) {
    return (
      <div className="w-full h-full bg-white p-1.5 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
        <QRCodeSVG
          value={publicUrl}
          size={size}
          level="M"
          fgColor="#000000"
          bgColor="#FFFFFF"
          includeMargin={false}
        />
      </div>
    );
  }

  const renderQRContent = () => {
    if (qrConfig.frame_style === 'gradient_border') {
      return (
        <div className="flex flex-col items-center max-w-full">
          <div className="p-2.5 rounded-3xl bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-300 shadow-2xl">
            <div className="bg-white p-3 sm:p-4 rounded-2xl flex items-center justify-center">
              <QRCodeSVG
                value={publicUrl}
                size={size}
                level="H"
                fgColor={qrConfig.fg_color || '#000000'}
                bgColor={qrConfig.bg_color || '#FFFFFF'}
                includeMargin={false}
              />
            </div>
          </div>
          {qrConfig.callout_text && (
            <div className="mt-3 max-w-xs px-3.5 py-2 rounded-xl bg-black/85 backdrop-blur-md text-white text-xs font-medium text-center border border-white/10 shadow-lg leading-snug">
              {qrConfig.callout_text}
            </div>
          )}
        </div>
      );
    }

    if (qrConfig.frame_style === 'dark_pill') {
      return (
        <div className="flex flex-col items-center max-w-full">
          <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center justify-center border border-slate-100">
            <QRCodeSVG
              value={publicUrl}
              size={size}
              level="H"
              fgColor={qrConfig.fg_color || '#000000'}
              bgColor={qrConfig.bg_color || '#FFFFFF'}
              includeMargin={false}
            />
          </div>
          {qrConfig.callout_text && (
            <div className="mt-3 max-w-xs px-3.5 py-2 rounded-xl bg-[#090B10]/95 backdrop-blur-md text-white text-xs font-medium text-center border border-white/10 shadow-xl leading-snug">
              {qrConfig.callout_text}
            </div>
          )}
        </div>
      );
    }

    // Standard Clean
    return (
      <div className="flex flex-col items-center max-w-full">
        <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-xl flex items-center justify-center border border-slate-200/50">
          <QRCodeSVG
            value={publicUrl}
            size={size}
            level="H"
            fgColor={qrConfig.fg_color || '#000000'}
            bgColor={qrConfig.bg_color || '#FFFFFF'}
            includeMargin={false}
          />
        </div>
        {qrConfig.callout_text && (
          <p className="mt-2.5 text-xs text-slate-300 text-center max-w-xs font-medium">
            {qrConfig.callout_text}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className={showCardWrapper ? 'p-5 sm:p-6 rounded-2xl bg-[#12141D] border border-white/10 flex flex-col items-center justify-center w-full overflow-hidden' : 'w-full'}>
      {/* Hidden high-res canvas for exports */}
      <div ref={canvasRef} className="hidden">
        <QRCodeCanvas value={publicUrl} size={700} level="H" />
        <QRCodeSVG value={publicUrl} size={700} level="H" />
      </div>

      {/* Rendered Visual Frame */}
      <div className="flex flex-col items-center justify-center w-full">
        {renderQRContent()}
      </div>

      {showCardWrapper && (
        <div className="w-full mt-5 pt-4 border-t border-white/10 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono break-all gap-2">
            <span className="truncate pr-1">{publicUrl}</span>
            <button
              onClick={copyUrl}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              title="Copy link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={downloadPNG}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-violet-600/20 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download PNG
            </button>
            <button
              onClick={downloadSVG}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download SVG
            </button>
          </div>

          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center text-xs text-violet-400 hover:text-violet-300 py-1 font-medium inline-flex items-center justify-center gap-1 transition-colors"
          >
            <span>Test live destination preview</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
};
