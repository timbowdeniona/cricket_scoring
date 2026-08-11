'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MalpasNewsArticle, MalpasNewsCategory, MalpasTeamId } from '@/types/malpas';
import { MALPAS_NEWS_ARTICLES } from '@/services/malpasData';
import { SocialShareButtons } from '@/components/scoring/SocialShareButtons';
import {
  Newspaper,
  Calendar,
  User,
  Trophy,
  Award,
  ChevronRight,
  X,
  Search,
  Share2,
  Sparkles,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface NewsFeedViewProps {
  articles?: MalpasNewsArticle[];
  selectedTeamId?: MalpasTeamId;
  limit?: number;
  showTitle?: boolean;
}

export function NewsFeedView({
  articles = MALPAS_NEWS_ARTICLES,
  selectedTeamId,
  limit,
  showTitle = true,
}: NewsFeedViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<MalpasNewsArticle | null>(null);

  // Category options
  const categories = ['All', 'Match Report', 'Club News', 'Junior Academy', '1st XI', '2nd XI'];

  // Filter articles based on selected team, category, and search query
  const filteredArticles = articles.filter(article => {
    // Category filter
    if (selectedCategory === 'Match Report' && article.category !== 'Match Report') return false;
    if (selectedCategory === 'Club News' && article.category !== 'Club News') return false;
    if (selectedCategory === 'Junior Academy' && article.category !== 'Junior Academy') return false;
    if (selectedCategory === '1st XI' && article.teamId !== '1st_xi') return false;
    if (selectedCategory === '2nd XI' && article.teamId !== '2nd_xi') return false;

    // Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = article.title.toLowerCase().includes(q);
      const matchSummary = article.summary.toLowerCase().includes(q);
      const matchCat = article.category.toLowerCase().includes(q);
      if (!matchTitle && !matchSummary && !matchCat) return false;
    }

    return true;
  });

  const displayedArticles = limit ? filteredArticles.slice(0, limit) : filteredArticles;

  // Separate featured article if available
  const featuredArticle = !searchQuery && selectedCategory === 'All'
    ? displayedArticles.find(a => a.isFeatured) || displayedArticles[0]
    : null;

  const secondaryArticles = featuredArticle
    ? displayedArticles.filter(a => a.id !== featuredArticle.id)
    : displayedArticles;

  const getCategoryBadgeStyle = (category: MalpasNewsCategory) => {
    switch (category) {
      case 'Match Report':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Junior Academy':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Club News':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case '1st XI':
      case '2nd XI':
      case 'Sunday XI':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header & Controls Section */}
      {showTitle && (
        <div className="glass-panel rounded-2xl p-5 border border-malpas-blue/40 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-malpas-blue/30 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                <Newspaper className="w-6 h-6 text-amber-400 shrink-0" />
                <span>Malpas CC News Feed & Match Reports</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                Official headlines, match summaries, highlights & club announcements from The Recreation Ground
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-malpas-navy/90 border border-malpas-blue/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-malpas-blue text-white border border-blue-400 shadow-md scale-[1.02]'
                    : 'bg-malpas-navy/70 text-gray-300 hover:text-white hover:bg-malpas-blue/30 border border-malpas-blue/20'
                }`}
              >
                {cat === 'Match Report' && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
                {cat === 'Junior Academy' && <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
                {cat === 'Club News' && <Award className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Featured Headline Article (Hero Card) */}
      {featuredArticle && (
        <div
          onClick={() => setActiveArticle(featuredArticle)}
          className="group relative cursor-pointer overflow-hidden rounded-2xl glass-panel border border-amber-400/40 shadow-2xl hover:border-amber-400 transition-all duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[320px]">
            {/* Image Banner Container */}
            <div className="lg:col-span-7 relative min-h-[220px] lg:min-h-full overflow-hidden bg-malpas-navy">
              <Image
                src={featuredArticle.imageUrl}
                alt={featuredArticle.title}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-malpas-navy via-malpas-navy/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-malpas-navy/90" />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider bg-amber-500 text-black px-2.5 py-1 rounded-md shadow-lg">
                  <Flame className="w-3.5 h-3.5 fill-black" />
                  Featured Story
                </span>
                <span className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-md border backdrop-blur-md ${getCategoryBadgeStyle(featuredArticle.category)}`}>
                  {featuredArticle.category}
                </span>
              </div>
            </div>

            {/* Content Details Container */}
            <div className="lg:col-span-5 p-6 flex flex-col justify-between bg-malpas-card/90 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-gray-300">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    {featuredArticle.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    {featuredArticle.author}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-300 transition-colors leading-tight">
                  {featuredArticle.title}
                </h3>

                {featuredArticle.subtitle && (
                  <p className="text-xs sm:text-sm font-semibold text-amber-200/90 italic">
                    {featuredArticle.subtitle}
                  </p>
                )}

                <p className="text-xs sm:text-sm text-gray-300 line-clamp-3 leading-relaxed">
                  {featuredArticle.summary}
                </p>
              </div>

              {/* Match Highlights Pills if Match Report */}
              {featuredArticle.matchHighlights && (
                <div className="bg-black/50 p-3 rounded-xl border border-amber-500/30 space-y-1.5">
                  <div className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> Key Match Performances
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {featuredArticle.matchHighlights.map((hl, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold bg-malpas-navy/90 text-white px-2 py-0.5 rounded border border-malpas-blue/40"
                      >
                        <strong className="text-amber-300">{hl.label}:</strong> {hl.performer}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2 flex items-center justify-between border-t border-malpas-blue/30">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveArticle(featuredArticle);
                  }}
                  className="min-h-[48px] px-5 py-2.5 bg-malpas-blue hover:bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 border border-blue-400/50 transition-all shadow-md group-hover:shadow-amber-500/20"
                >
                  <span>Read Full Story</span>
                  <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </button>

                {featuredArticle.scoreSummary && (
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                      {featuredArticle.scoreSummary.result}
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      {featuredArticle.scoreSummary.awayScore}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {secondaryArticles.map(article => (
          <div
            key={article.id}
            onClick={() => setActiveArticle(article)}
            className="group cursor-pointer bg-malpas-card/80 hover:bg-malpas-dark rounded-2xl border border-malpas-blue/30 hover:border-amber-400/60 p-4 shadow-lg flex flex-col justify-between transition-all duration-300 space-y-4"
          >
            <div className="space-y-3">
              {/* Image Container */}
              <div className="relative h-44 w-full rounded-xl overflow-hidden bg-malpas-navy">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-malpas-navy/90 via-transparent to-transparent" />

                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border backdrop-blur-md ${getCategoryBadgeStyle(article.category)}`}>
                    {article.category}
                  </span>
                  {article.teamId && (
                    <span className="text-[10px] font-bold uppercase bg-black/60 text-gray-200 px-2 py-0.5 rounded border border-white/20">
                      {article.teamId === '1st_xi' ? '1st XI' : article.teamId === '2nd_xi' ? '2nd XI' : 'Sunday XI'}
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="flex items-center gap-2 text-[11px] text-gray-300">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{article.date}</span>
                <span>•</span>
                <span>{article.author}</span>
              </div>

              <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                {article.title}
              </h4>

              <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
                {article.summary}
              </p>
            </div>

            {/* Score & Highlights Breakdown */}
            <div className="space-y-3 pt-2 border-t border-malpas-blue/20">
              {article.scoreSummary && (
                <div className="bg-black/40 p-2.5 rounded-xl border border-malpas-blue/30 text-xs flex items-center justify-between">
                  <div className="font-mono font-bold text-amber-300">
                    {article.scoreSummary.awayScore || article.scoreSummary.homeScore}
                  </div>
                  <div className="text-[11px] font-bold text-emerald-400 line-clamp-1">
                    {article.scoreSummary.result}
                  </div>
                </div>
              )}

              {article.matchHighlights && article.matchHighlights.length > 0 && (
                <div className="space-y-1">
                  {article.matchHighlights.slice(0, 2).map((hl, idx) => (
                    <div key={idx} className="text-[11px] text-gray-300 flex items-center gap-1 truncate">
                      <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                      <strong className="text-white shrink-0">{hl.label}:</strong>
                      <span className="text-amber-200 truncate">{hl.performer}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Read Story Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveArticle(article);
                }}
                className="w-full min-h-[44px] px-3 py-2 bg-malpas-navy hover:bg-malpas-blue text-gray-200 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-malpas-blue/40 transition-colors"
              >
                <span>Read Full Report</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {displayedArticles.length === 0 && (
        <div className="glass-panel p-12 text-center rounded-2xl border border-malpas-blue/30 space-y-3">
          <Newspaper className="w-10 h-10 text-amber-400/60 mx-auto" />
          <p className="text-base font-bold text-white">No articles found matching your criteria</p>
          <p className="text-xs text-gray-400">Try adjusting your category filter or search query.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-malpas-blue text-white text-xs font-bold rounded-xl border border-blue-400"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Full Article Modal View */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-malpas-card border border-malpas-blue/50 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 p-5 sm:p-7 relative">
            {/* Close Button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors z-10 border border-white/20"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Image */}
            <div className="relative h-56 sm:h-72 w-full rounded-xl overflow-hidden bg-malpas-navy">
              <Image
                src={activeArticle.imageUrl}
                alt={activeArticle.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-malpas-card via-malpas-card/30 to-transparent" />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-md border backdrop-blur-md ${getCategoryBadgeStyle(activeArticle.category)}`}>
                  {activeArticle.category}
                </span>
                {activeArticle.teamId && (
                  <span className="text-xs font-bold uppercase bg-black/70 text-amber-300 px-3 py-1 rounded-md border border-amber-400/30">
                    {activeArticle.teamId === '1st_xi' ? 'Malpas 1st XI' : activeArticle.teamId === '2nd_xi' ? 'Malpas 2nd XI' : 'Sunday XI'}
                  </span>
                )}
              </div>
            </div>

            {/* Article Headline & Meta */}
            <div className="space-y-3 border-b border-malpas-blue/30 pb-4">
              <div className="flex items-center gap-4 text-xs font-semibold text-gray-300">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Calendar className="w-4 h-4" />
                  {activeArticle.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-blue-400">
                  <User className="w-4 h-4" />
                  {activeArticle.author}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {activeArticle.title}
              </h2>

              {activeArticle.subtitle && (
                <p className="text-sm font-semibold text-amber-300 italic">
                  {activeArticle.subtitle}
                </p>
              )}
            </div>

            {/* Score Summary Banner if Match Report */}
            {activeArticle.scoreSummary && (
              <div className="bg-black/60 p-4 rounded-xl border border-amber-400/40 space-y-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-extrabold uppercase text-amber-400 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4" /> Match Scoreboard Summary
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-500/40">
                    {activeArticle.scoreSummary.result}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-mono font-bold text-white pt-1">
                  <div>Innings 1: <span className="text-amber-300">{activeArticle.scoreSummary.homeScore}</span></div>
                  <div>Innings 2: <span className="text-amber-300">{activeArticle.scoreSummary.awayScore}</span></div>
                </div>
              </div>
            )}

            {/* Key Performers Box */}
            {activeArticle.matchHighlights && activeArticle.matchHighlights.length > 0 && (
              <div className="bg-malpas-navy/90 p-4 rounded-xl border border-malpas-blue/40 space-y-2">
                <div className="text-xs font-extrabold uppercase text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Outstanding Individual Performers
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeArticle.matchHighlights.map((hl, idx) => (
                    <div key={idx} className="bg-black/40 p-2 rounded-lg border border-malpas-blue/30 text-xs">
                      <span className="text-gray-400 block">{hl.label}</span>
                      <span className="font-bold text-white text-sm">{hl.performer}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full Story Paragraphs */}
            <div className="space-y-4 text-gray-200 text-sm sm:text-base leading-relaxed font-sans border-b border-malpas-blue/30 pb-6">
              {activeArticle.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Footer with Social Share */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase text-gray-300">Share Story</span>
              </div>

              <SocialShareButtons
                matchTitle={activeArticle.title}
                battingTeamName="Malpas CC"
                bowlingTeamName="Opponent"
                totalRuns={184}
                wickets={6}
                oversCompleted={38}
                ballsInCurrentOver={2}
                venue="Wrexham Road"
                customText={`📰 *Malpas CC News: ${activeArticle.title}*\n\nRead the full report on the official Malpas CC Portal: https://malpascc.netlify.app`}
              />

              <button
                onClick={() => setActiveArticle(null)}
                className="min-h-[48px] px-6 py-2.5 bg-malpas-blue hover:bg-blue-600 text-white font-bold text-xs rounded-xl border border-blue-400 transition-all w-full sm:w-auto"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
