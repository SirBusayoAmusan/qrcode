import React, { useRef } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { Download, Copy, Check, Sparkles, ExternalLink, MonitorPlay } from 'lucide-react';
import { TapframePage } from '../types';

interface QRCodeDisplayProps {
  page: TapframePage;
  size?: number;
  showCardWrapper?: boolean;
  onDownload?: () => void;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  page,
  size = 240,
  showCardWrapper = true,
}) => {
  const [copied, setCopied] = React.useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Construct target URL
  const publicUrl = `${window.location.origin}/q/${page.slug}`;

  const qrConfig = page.custom_theme?.qr_style || {
    fg_color: '#000000',
    bg_color: '#FFFFFF',
    frame_style: 'dark_pill',
    callout_text: page.headline || 'Scan to view offer',
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPNG = () => {
    // Create a high resolution canvas for video screens / YouTube overlays
    const canvas = document.createElement('canvas');
    const exportWidth = 1080;
    const exportHeight = 1080;
    canvas.width = exportWidth;
    canvas.height = exportHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background or transparent
    const hiddenCanvas = canvasRef.current?.querySelector('canvas');
    if (!hiddenCanvas) return;

    // High res redraw
    const img = new Image();
    img.src = hiddenCanvas.toDataURL('image/png');
    img.onload = () => {
      // Background card
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(100, 100, 880, 880, 48);
      ctx.fill();

      // Draw QR centered inside
      ctx.drawImage(img, 190, 190, 700, 700);

      const a = document.createElement('a');
      a.download = `ClearpathQR-${page.slug}-4k.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
  };

  const downloadSVG = () => {
    const svgEl = canvasRef.current?.querySelector('svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `ClearpathQR-${page.slug}.svg`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderQRContent = () => {
    if (qrConfig.frame_style === 'gradient_border') {
      return (
        <div className="flex flex-col items-center">
          {/* Gradient Frame as seen in female creator mockup */}
          <div className="p-2.5 rounded-3xl bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-300 shadow-2xl">
            <div className="bg-white p-4 rounded-2xl flex items-center justify-center">
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
            <div className="mt-4 max-w-sm px-4 py-2.5 rounded-xl bg-black/80 backdrop-blur-md text-white text-xs sm:text-sm font-medium text-center border border-white/10 shadow-lg leading-snug">
              {qrConfig.callout_text}
            </div>
          )}
        </div>
      );
    }

    if (qrConfig.frame_style === 'dark_pill') {
      return (
        <div className="flex flex-col items-center max-w-sm">
          {/* White Card QR */}
          <div className="bg-white p-4 rounded-2xl shadow-2xl flex items-center justify-center border border-slate-100">
            <QRCodeSVG
              value={publicUrl}
              size={size}
              level="H"
              fgColor={qrConfig.fg_color || '#000000'}
              bgColor={qrConfig.bg_color || '#FFFFFF'}
              includeMargin={false}
            />
          </div>
          {/* Dark Callout Pill underneath as seen in male creator mockup */}
          {qrConfig.callout_text && (
            <div className="mt-3 px-4 py-2.5 rounded-xl bg-[#090B10]/90 backdrop-blur-md text-white text-xs sm:text-sm font-medium text-left border border-white/10 shadow-xl leading-snug">
              {qrConfig.callout_text}
            </div>
          )}
        </div>
      );
    }

    // Default clean
    return (
      <div className="flex flex-col items-center">
        <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center justify-center border border-slate-200/50">
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
          <p className="mt-3 text-xs text-slate-400 text-center max-w-xs font-medium">
            {qrConfig.callout_text}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className={showCardWrapper ? 'p-6 rounded-2xl bg-[#12141D] border border-white/5 flex flex-col items-center justify-center' : ''}>
      {/* Hidden high-res canvas for image exports */}
      <div ref={canvasRef} className="hidden">
        <QRCodeCanvas value={publicUrl} size={700} level="H" />
        <QRCodeSVG value={publicUrl} size={700} level="H" />
      </div>

      {/* Rendered Display */}
      <div className="flex flex-col items-center justify-center">
        {renderQRContent()}
      </div>

      {showCardWrapper && (
        <div className="w-full mt-6 pt-5 border-t border-white/10 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono break-all">
            <span className="truncate pr-2">{publicUrl}</span>
            <button
              onClick={copyUrl}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center gap-1 shrink-0"
              title="Copy link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={downloadPNG}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-violet-600/20"
            >
              <Download className="w-3.5 h-3.5" />
              Download PNG
            </button>
            <button
              onClick={downloadSVG}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
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
