import React from 'react';

interface OSMMapProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  height?: string;
  className?: string;
}

const OSMMap: React.FC<OSMMapProps> = ({
  latitude,
  longitude,
  address,
  height = '200px',
  className = ''
}) => {
  if (!latitude || !longitude) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-gray-500">No location data available</p>
      </div>
    );
  }

  // Tạo URL cho OpenStreetMap
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.005}%2C${latitude - 0.005}%2C${longitude + 0.005}%2C${latitude + 0.005}&layer=mapnik&marker=${latitude}%2C${longitude}`;

  return (
    <div className={className}>
      <iframe
        src={osmUrl}
        width="100%"
        height={height}
        style={{ border: 0, borderRadius: '4px' }}
        allowFullScreen={false}
        loading="lazy"
        title="Location Map"
      />
      {address && (
        <p className="mt-1 text-xs text-gray-600">{address}</p>
      )}
    </div>
  );
};

export default OSMMap;