'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';

interface SocialShareButtonsProps {
  matchTitle?: string;
  battingTeamName: string;
  bowlingTeamName: string;
  totalRuns: number;
  wickets: number;
  oversCompleted: number;
  ballsInCurrentOver: number;
  strikerName?: string;
  strikerRuns?: number;
  nonStrikerName?: string;
  nonStrikerRuns?: number;
  venue?: string;
  customText?: string;
}

export function SocialShareButtons({
  matchTitle = 'Cheshire League Match',
  battingTeamName,
  bowlingTeamName,
  totalRuns,
  wickets,
  oversCompleted,
  ballsInCurrentOver,
  strikerName,
  strikerRuns,
  nonStrikerName,
  nonStrikerRuns,
  venue = 'The Recreation Ground, Wrexham Road, Malpas',
  customText,
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const oversFormatted = `${oversCompleted}.${ballsInCurrentOver}`;
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://malpas.play-cricket.com';

  const battersText = strikerName
    ? `\n⚡ Striker: ${strikerName}${strikerRuns !== undefined ? ` (${strikerRuns})` : ''}${
        nonStrikerName ? ` | ${nonStrikerName}${nonStrikerRuns !== undefined ? ` (${nonStrikerRuns})` : ''}` : ''
      }`
    : '';

  const shareText =
    customText ||
    `🏏 *MALPAS CC MATCH UPDATE* 🏏\n🏆 ${matchTitle}\n📊 ${battingTeamName}: ${totalRuns}/${wickets} (${oversFormatted} ov) vs ${bowlingTeamName}${battersText}\n📍 ${venue}\n\nLive Scorecard: ${siteUrl}`;

  const handleWhatsApp = () => {
    trackEvent('social_share', { platform: 'whatsapp' });
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleTwitter = () => {
    trackEvent('social_share', { platform: 'twitter' });
    const tweetText = `🏏 ${battingTeamName} ${totalRuns}/${wickets} (${oversFormatted} ov) vs ${bowlingTeamName}.${
      strikerName ? ` ${strikerName} ${strikerRuns}*` : ''
    } #MalpasCC #CheshireCricket`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(siteUrl)}`;
    window.open(url, '_blank');
  };

  const handleFacebook = () => {
    trackEvent('social_share', { platform: 'facebook' });
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    trackEvent('social_share', { platform: 'native' });
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Malpas CC: ${battingTeamName} ${totalRuns}/${wickets}`,
          text: shareText,
          url: siteUrl,
        });
      } catch (err) {
        console.log('Native share closed');
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    trackEvent('social_share', { platform: 'copy_clipboard' });
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Copy Link Button */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy match summary link and details to clipboard"
        title="Copy match summary to clipboard"
        className="min-h-[48px] h-12 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow border border-slate-600/50 transition-all active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 text-amber-400" aria-hidden="true" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      {/* Twitter / X Button */}
      <button
        type="button"
        onClick={handleTwitter}
        aria-label="Share live match update to Twitter or X"
        title="Share Live Score to X / Twitter"
        className="min-h-[48px] h-12 px-4 rounded-xl bg-black hover:bg-gray-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow border border-gray-700 transition-all active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span>Twitter/X</span>
      </button>

      {/* WhatsApp Button */}
      <button
        type="button"
        onClick={handleWhatsApp}
        aria-label="Share live match update to WhatsApp"
        title="Share Live Score to WhatsApp"
        className="min-h-[48px] h-12 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
        <span>WhatsApp</span>
      </button>

      {/* Facebook Button */}
      <button
        type="button"
        onClick={handleFacebook}
        aria-label="Share live match update to Facebook"
        title="Share Live Score to Facebook"
        className="min-h-[48px] h-12 px-4 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <span>Facebook</span>
      </button>

      {/* Share / Native Share Button */}
      <button
        type="button"
        onClick={handleNativeShare}
        aria-label="Share live match update using device share options"
        title="Share or Copy Summary"
        className="min-h-[48px] h-12 px-4 rounded-xl bg-malpas-blue hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow border border-blue-400/40 transition-all active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <Share2 className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
        <span>Share</span>
      </button>
    </div>
  );
}
