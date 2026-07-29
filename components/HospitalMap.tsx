'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const HospitalMap: React.FC = () => {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    // 1. Try IP-based Geolocation first
    fetch('https://get.geojs.io/v1/ip/geo.json')
      .then(r => r.json())
      .then(ipData => {
        const lat = ipData.latitude;
        const lng = ipData.longitude;
        const city = ipData.city || 'Unknown Location';
        
        return fetch(`/api/hospitals?lat=${lat}&lng=${lng}&address=${encodeURIComponent(city)}`);
      })
      .then(r => r.json())
      .then(d => {
        setHospitals(d.hospitals || []);
        setLocationName(d.queryLocation || '');
      })
      .catch(() => {
        // Fallback if IP lookup fails
        fetch('/api/hospitals?address=Islamabad')
          .then(r => r.json())
          .then(d => {
            setHospitals(d.hospitals || []);
            setLocationName(d.queryLocation || '');
          })
          .catch(() => {});
      });

    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetch(`/api/hospitals?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`)
            .then(r => r.json())
            .then(d => {
              setHospitals(d.hospitals || []);
              setLocationName(d.queryLocation || '');
            })
            .catch(() => {});
        },
        () => {}
      );
    }
  }, []);

  if (hospitals.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: '100%',
        maxWidth: 'var(--content-width)',
        margin: 'var(--space-8) auto 0',
      }}
    >
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-light)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-5) var(--space-6)',
          borderBottom: '1px solid var(--border-light)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span style={{ font: 'var(--text-small-medium)', color: 'var(--text-primary)' }}>
              Nearby Emergency Facilities
            </span>
            {locationName && (
              <span style={{ font: 'var(--text-caption)', color: 'var(--text-tertiary)' }}>
                · {locationName}
              </span>
            )}
          </div>
          <a
            href={`https://www.google.com/maps/search/emergency+hospitals+near+${encodeURIComponent(locationName)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              font: 'var(--text-caption)',
              color: 'var(--accent)',
              textDecoration: 'none',
            }}
          >
            View all on Maps →
          </a>
        </div>

        {/* Hospital List */}
        <div>
          {hospitals.map((h: any, i: number) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 'var(--space-4)',
                padding: 'var(--space-4) var(--space-6)',
                borderBottom: i < hospitals.length - 1 ? '1px solid var(--border-light)' : 'none',
                transition: 'background var(--duration-fast) ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-alt)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  font: 'var(--text-small-medium)',
                  color: 'var(--text-primary)',
                  marginBottom: 2,
                }}>
                  {h.name}
                </div>
                <div style={{
                  font: 'var(--text-caption)',
                  color: 'var(--text-tertiary)',
                }}>
                  {h.address}
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                flexShrink: 0,
              }}>
                <span style={{
                  font: 'var(--text-caption)',
                  color: 'var(--accent)',
                  whiteSpace: 'nowrap',
                }}>
                  {h.distance}
                </span>
                <a
                  href={h.googleMapsUrl || `https://www.google.com/maps/search/${encodeURIComponent(h.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: 'var(--space-1) var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    font: 'var(--text-caption)',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'all var(--duration-fast) ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.color = 'var(--accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  Directions
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
