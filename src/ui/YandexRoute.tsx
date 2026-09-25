import { Icon } from "./Icon";

/**
 * Studio address used to build the Yandex Maps route link.
 * PLACEHOLDER: neither archive you sent included a real studio address, so this
 * is a stand-in string. Replace it with the actual address (or "lat,lon")
 * before publishing — everything else below works unchanged once you do.
 */
export const STUDIO_ADDRESS = "Москва, UNIQUE Detailing";

/**
 * Builds a real Yandex Maps "build a route" link: rtext=~<destination> with an
 * empty origin (the "~" with nothing before it) tells Yandex to route from the
 * visitor's current location, exactly like the "Проложить маршрут" button on
 * yandex.ru/maps does. Opens in a new tab — no API key needed for this.
 */
export function buildYandexRouteUrl(address: string = STUDIO_ADDRESS): string {
  const dest = encodeURIComponent(address);
  return `https://yandex.ru/maps/?rtext=~${dest}&rtt=auto`;
}

/**
 * A compact, colourful card styled after the Yandex Maps route panel
 * (signature yellow route button, red destination pin, muted road-map
 * background) with a button that opens a real Yandex Maps route to the
 * studio in a new tab.
 */
export function YandexRouteCard({ address = STUDIO_ADDRESS }: { address?: string }) {
  return (
    <div className="yandex-card">
      <div className="yandex-card-map" aria-hidden="true">
        <svg viewBox="0 0 320 140" width="100%" height="100%" preserveAspectRatio="none">
          <rect width="320" height="140" fill="#eef1e8" />
          <path d="M0 40 L320 30" stroke="#f5c344" strokeWidth="7" />
          <path d="M0 95 L320 110" stroke="#fff" strokeWidth="10" />
          <path d="M0 95 L320 110" stroke="#c9cfd6" strokeWidth="1" />
          <path d="M60 0 L90 140" stroke="#cfe0c8" strokeWidth="14" />
          <path d="M230 0 L210 140" stroke="#bfe3ea" strokeWidth="18" />
          <path d="M20 120 C 90 60, 190 40, 300 20" stroke="#ff4433" strokeWidth="3.5" strokeDasharray="1 8" strokeLinecap="round" fill="none" />
          <circle cx="20" cy="120" r="5" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
          <path d="M300 20c0-6-5-11-11-11s-11 5-11 11c0 8 11 18 11 18s11-10 11-18Z" fill="#ff4433" />
        </svg>
      </div>
      <div className="yandex-card-body">
        <div className="yandex-card-title">
          <Icon name="pin" size={16} />
          <span>{address}</span>
        </div>
        <p className="yandex-card-note">Построим маршрут до студии в Яндекс Картах — от вашего текущего местоположения.</p>
        <a className="yandex-route-btn" href={buildYandexRouteUrl(address)} target="_blank" rel="noopener noreferrer">
          <Icon name="route" size={16} />
          Проложить маршрут
        </a>
      </div>
    </div>
  );
}
