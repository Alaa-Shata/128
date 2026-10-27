/**
 * Shared pour state — written by the ProductJourney scroll timeline (so it is
 * deterministic per scroll position and reverses on scroll-up), read every frame
 * by the CoffeeStream renderer.
 */
export const pour = {
  flow: 0, // 0..1 how much coffee is leaving the cup (stream thickness)
  reach: 0, // 0..1 how far the freshly poured stream has fallen from the lip
  cup: 1, // 0..1 how strongly the stream is still anchored to the cup's lip
};
