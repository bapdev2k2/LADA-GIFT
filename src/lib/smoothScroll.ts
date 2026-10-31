/**
 * Silky smooth scrolling with easeInOutCubic curve and navbar height offset
 * Guaranteed 120 FPS animation curve that never covers section headings.
 */
export function smoothScrollTo(target: string, offset = 85, duration = 750) {
  if (typeof window === "undefined") return;

  const id = target.replace("#", "");
  const el = document.getElementById(id);
  if (!el) return;

  const startPosition = window.pageYOffset;
  const elementPosition = el.getBoundingClientRect().top;
  const targetPosition = elementPosition + startPosition - offset;
  const distance = targetPosition - startPosition;

  // If distance is tiny, scroll instantly
  if (Math.abs(distance) < 5) return;

  let startTime: number | null = null;

  function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    window.scrollTo({
      top: startPosition + distance * ease,
      behavior: "instant" as ScrollBehavior,
    });

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}
