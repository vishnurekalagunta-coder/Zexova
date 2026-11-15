import React from 'react';
import { MapPin, Phone, Clock, Star, ShieldCheck, Navigation } from 'lucide-react';
import { Shop } from '../types';

interface Props {
  shop: Shop;
  onSelectOnMap?: (shop: Shop) => void;
}

export const StoreCard: React.FC<Props> = ({ shop, onSelectOnMap }) => {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`;

  return (
    <div className="bg-white dark:bg-[#111114] rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] hover:border-zinc-300 dark:hover:border-white/20 overflow-hidden transition-all duration-300 flex flex-col md:flex-row shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)]">
      
      {/* Store Thumbnail */}
      <div className="md:w-48 h-40 md:h-auto relative bg-zinc-100/80 dark:bg-[#18181b] flex-shrink-0">
        <img
          src={shop.imageUrl}
          alt={shop.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {shop.distanceKm && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/90 dark:bg-black/80 border border-zinc-200 dark:border-white/10 text-black dark:text-white text-[10px] font-bold backdrop-blur-sm shadow-sm">
            {shop.distanceKm} km away
          </span>
        )}
      </div>

      {/* Store Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white dark:bg-[#111114]">
        <div>
          {/* Header & Badges */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-black dark:text-white text-base">
                  {shop.name}
                </h3>
                {shop.isVerified && (
                  <span title="Verified Merchant">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                {shop.category}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 bg-zinc-50 dark:bg-black px-2 py-1 rounded-lg border border-zinc-200 dark:border-white/10">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span className="text-xs font-bold text-black dark:text-white">{shop.rating}</span>
              <span className="text-[10px] text-zinc-500">({shop.reviewsCount})</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
            {shop.description}
          </p>

          {/* Details (Address, Hours, Phone) */}
          <div className="mt-3 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
              <span className="truncate">{shop.address}, {shop.city} - {shop.zipCode}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
              <span>{shop.openingHours}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
              <a href={`tel:${shop.phone}`} className="hover:text-black dark:hover:text-white transition">
                {shop.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-white/5 flex items-center justify-between gap-3">
          {onSelectOnMap && (
            <button
              onClick={() => onSelectOnMap(shop)}
              className="text-xs font-semibold text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white underline flex items-center gap-1"
            >
              <span>View On Map</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black shadow-sm transition"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StoreCard;
