import { useEffect, useState } from 'react';
import { publicApi } from '../../services/api.js';

const fallbackText = 'GET 25% OFF ON YOUR FIRST ORDER - BUY 3 ITEMS & GET 30% OFF - FREE SHIPPING ON PREPAID ORDERS - ';

export default function OfferStrip() {
  const [text, setText] = useState(fallbackText);

  useEffect(() => {
    publicApi.getOffers()
      .then((offers) => {
        const offerText = offers.map((offer) => offer.text).filter(Boolean).join(' - ');
        if (offerText) setText(`${offerText} - `);
      })
      .catch(() => setText(fallbackText));
  }, []);

  return (
    <div className="overflow-hidden bg-ritual-brown py-2 text-xs font-semibold uppercase text-ritual-card">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        <span className="px-4">{text.repeat(2)}</span>
        <span className="px-4" aria-hidden="true">{text.repeat(2)}</span>
      </div>
    </div>
  );
}
