// Shared webinar event data — single source of truth for details that repeat
// across the hero, event-info cards, final CTA and countdown timers.

export const webinar = {
  brand: "Home2U",
  title: "Сделки за милиони",
  subtitle: "Формулата зад рекордния успех",
  speaker: "Ралица Ценова",
  date: "18.06.2026г.",
  time: "18:00",
  location: "Онлайн в Zoom",
  duration: "60 мин.",
  // ISO start for the live countdown. June in Bulgaria is EEST (UTC+3).
  startISO: "2026-06-18T18:00:00+03:00",
  ctaLabel: "Запиши се БЕЗПЛАТНО",
} as const;
