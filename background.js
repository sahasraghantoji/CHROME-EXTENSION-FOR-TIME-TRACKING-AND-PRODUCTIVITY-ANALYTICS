let currentSite = null;
let startTime = null;

function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function sendData(site, time) {
  fetch("http://localhost:5000/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ website: site, timeSpent: time })
  }).catch(err => console.log("Server not running"));
}

function track(url) {
  const domain = getDomain(url);
  if (!domain) return;

  const now = Date.now();

  if (currentSite && startTime) {
    const duration = Math.floor((now - startTime) / 1000);
    if (duration > 0) {
      sendData(currentSite, duration);
    }
  }

  currentSite = domain;
  startTime = now;
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  track(tab.url);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    track(tab.url);
  }
});