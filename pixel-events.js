/* PageView is sent by the Meta Pixel snippet in each HTML page. */
window.trackMetaEvent = function (eventName, parameters) {
  if (typeof window.fbq !== 'function') return;
  try {
    window.fbq('track', eventName, parameters || {});
  } catch (error) {
    // Tracking must never interrupt the customer journey.
  }
};
