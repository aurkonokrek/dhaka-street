import { useMemo } from "react";

const ITEMS = ["🥟", "☕", "🍗", "🍔", "🌶️", "🍟", "🥤"];

// Pre-shuffled positions so same items don't cluster
const DESKTOP_SPANS = (() => {
  const arr: { item: string; left: number; size: number; dur: number; delay: number; opacity: number }[] = [];
  // Build 35 items: 5 of each
  const items: string[] = [];
  ITEMS.forEach((i) => {
    for (let k = 0; k < 5; k++) items.push(i);
  });
  // Deterministic shuffle (seeded)
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  for (let i = 0; i < items.length; i++) {
    arr.push({
      item: items[i],
      left: +(1 + rand() * 98).toFixed(2),
      size: Math.round(18 + rand() * 20),
      dur: +(6 + rand() * 8).toFixed(2),
      delay: +(-12 * rand()).toFixed(2),
      opacity: +(0.07 + rand() * 0.04).toFixed(3),
    });
  }
  return arr;
})();

export function FoodRain() {
  const spans = useMemo(() => DESKTOP_SPANS, []);
  return (
    <div id="food-rain" aria-hidden="true">
      {spans.map((s, i) => (
        <span
          key={i}
          data-rain-index={i}
          style={{
            left: `${s.left}%`,
            fontSize: `${s.size}px`,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
            ["--item-opacity" as string]: s.opacity,
          }}
        >
          {s.item}
        </span>
      ))}
    </div>
  );
}
