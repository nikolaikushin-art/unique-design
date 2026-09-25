import { useEffect, type ReactNode } from "react";
import { Icon } from "./Icon";
import type { ViewId } from "../store/useStudioStore";

export function Modal({ onClose, children, wide = false }: { onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={wide ? { width: "min(100%, 620px)" } : undefined} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Закрыть">
          <Icon name="close" size={15} />
        </button>
        {children}
      </div>
    </div>
  );
}

export function Toast({ message }: { message: string | null }) {
  return <div className={`toast${message ? " is-visible" : ""}`} role="status" aria-live="polite">{message}</div>;
}

const navItems: { id: ViewId; label: string; icon: "home" | "car" | "grid" | "user" }[] = [
  { id: "studio", label: "Студия", icon: "car" },
  { id: "vehicles", label: "Автомобили", icon: "grid" },
  { id: "saved", label: "Конфигурации", icon: "home" },
  { id: "profile", label: "Профиль", icon: "user" },
];

export function BottomNav({ active, onSelect }: { active: ViewId; onSelect: (v: ViewId) => void }) {
  return (
    <nav className="bottom-nav" aria-label="Основная навигация">
      {navItems.map((item) => (
        <button key={item.id} className={`bottom-nav-item${active === item.id ? " is-active" : ""}`} onClick={() => onSelect(item.id)}>
          <Icon name={item.icon} size={19} />
          {item.label}
        </button>
      ))}
    </nav>
  );
}

export function TopBar({ active, savedCount, onSelect, onProfile, onRoute, logoSrc }: { active: ViewId; savedCount: number; onSelect: (v: ViewId) => void; onProfile: () => void; onRoute: () => void; logoSrc: string }) {
  return (
    <header className="topbar">
      <a className="brand" href="#" onClick={(e) => { e.preventDefault(); onSelect("welcome"); }} aria-label="UNIQUE Visual Studio — на главную">
        <img src={logoSrc} alt="UNIQUE Detailing" />
        <span className="brand-divider" />
        <span className="brand-product">VISUAL STUDIO</span>
      </a>
      <nav className="topnav" aria-label="Главная навигация">
        <button className={`topnav-link${active === "studio" ? " is-active" : ""}`} onClick={() => onSelect("studio")}>Студия</button>
        <button className={`topnav-link${active === "vehicles" ? " is-active" : ""}`} onClick={() => onSelect("vehicles")}>Мои автомобили</button>
        <button className={`topnav-link${active === "saved" ? " is-active" : ""}`} onClick={() => onSelect("saved")}>
          Конфигурации <span className="nav-count">{savedCount}</span>
        </button>
      </nav>
      <div className="topbar-actions">
        <button className="icon-button yandex-topbar-btn" onClick={onRoute} aria-label="Как добраться — Яндекс Карты" title="Как добраться (Яндекс Карты)">
          <Icon name="pin" size={17} />
        </button>
        <button className="icon-button" onClick={onProfile} aria-label="Профиль" title="Профиль">
          <Icon name="profile" size={17} />
        </button>
        <span className="locale">RU</span>
      </div>
    </header>
  );
}
