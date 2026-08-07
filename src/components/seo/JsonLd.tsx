import React from 'react';
import { MALPAS_FIXTURES } from '@/services/malpasData';

export function JsonLd() {
  const sportsClubSchema = {
    '@context': 'https://schema.org',
    '@type': 'SportsClub',
    name: 'Malpas Cricket Club',
    alternateName: 'M.D.S.C. Malpas',
    url: 'https://malpas.play-cricket.com',
    logo: 'https://malpas.play-cricket.com/badge.jpg',
    image: 'https://malpas.play-cricket.com/badge.jpg',
    description: 'Official Malpas Cricket Club (Cheshire) portal with 1st XI, 2nd XI & Sunday XI fixtures, player statistics, 2D scoring and 3D WebGL innings simulation.',
    foundingDate: '1924',
    sport: 'Cricket',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'The Recreation Ground, Wrexham Road',
      addressLocality: 'Malpas',
      addressRegion: 'Cheshire',
      postalCode: 'SY14 8ER',
      addressCountry: 'GB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '53.0185',
      longitude: '-2.7667',
    },
    memberOf: {
      '@type': 'SportsOrganization',
      name: 'Cheshire Cricket League',
    },
  };

  const sportsEventsSchema = MALPAS_FIXTURES.map(f => ({
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `Malpas CC vs ${f.opponent}`,
    startDate: `${f.date}T${f.time}:00Z`,
    location: {
      '@type': 'Place',
      name: f.ground,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Malpas',
        addressRegion: 'Cheshire',
        addressCountry: 'GB',
      },
    },
    competitor: [
      {
        '@type': 'SportsTeam',
        name: 'Malpas Cricket Club',
      },
      {
        '@type': 'SportsTeam',
        name: f.opponent,
      },
    ],
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsClubSchema) }}
      />
      {sportsEventsSchema.map((evt, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(evt) }}
        />
      ))}
    </>
  );
}
