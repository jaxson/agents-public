// State
let committees = [];
let committeesMap = {};
let meetingsOffset = 0;
let speechesOffset = 0;
const LIMIT = 20;

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  const page = detectPage();
  if (page === "index") {
    initIndex();
  } else if (page === "meeting") {
    initMeeting();
  }
});

function detectPage() {
  if (window.location.pathname.includes("meeting.html")) return "meeting";
  return "index";
}

// NAV
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }
}

// COMMITTEES
async function loadCommittees() {
  try {
    const res = await fetch("/api/committees");
    const data = await res.json();
    committees = data.objects || [];
    committees.sort((a, b) => {
      const nameA = (a.name && a.name.en) || a.slug || "";
      const nameB = (b.name && b.name.en) || b.slug || "";
      return nameA.localeCompare(nameB);
    });
    committees.forEach((c) => {
      const slug = extractSlug(c.url);
      const name = (c.name && c.name.en) || (c.short_name && c.short_name.en) || slug;
      committeesMap[slug] = name;
    });
  } catch (err) {
    console.error("Failed to load committees:", err);
  }
}

function extractSlug(url) {
  if (!url) return "";
  const parts = url.replace(/\/$/, "").split("/");
  return parts[parts.length - 1];
}

function getCommitteeName(committeeUrl) {
  const slug = extractSlug(committeeUrl);
  return committeesMap[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// INDEX PAGE
async function initIndex() {
  await loadCommittees();
  populateFilter();
  loadMeetings();

  document.getElementById("committee-filter").addEventListener("change", (e) => {
    meetingsOffset = 0;
    document.getElementById("meetings-list").innerHTML = "";
    loadMeetings();
  });

  document.getElementById("load-more").addEventListener("click", () => {
    loadMeetings(true);
  });
}

function populateFilter() {
  const select = document.getElementById("committee-filter");
  if (!select) return;
  committees.forEach((c) => {
    const slug = extractSlug(c.url);
    const name = (c.name && c.name.en) || (c.short_name && c.short_name.en) || slug;
    const opt = document.createElement("option");
    opt.value = slug;
    opt.textContent = name;
    select.appendChild(opt);
  });
}

async function loadMeetings(append) {
  const list = document.getElementById("meetings-list");
  const wrap = document.getElementById("load-more-wrap");
  const countEl = document.getElementById("meeting-count");
  const filter = document.getElementById("committee-filter").value;

  if (!append) {
    list.innerHTML = '<div class="loading"><div class="spinner"></div><div class="loading-text">Loading meetings...</div></div>';
  }

  let url = `/api/meetings?limit=${LIMIT}&offset=${meetingsOffset}`;
  if (filter) url += `&committee=${filter}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const meetings = data.objects || [];

    if (!append) list.innerHTML = "";

    if (meetings.length === 0 && meetingsOffset === 0) {
      list.innerHTML = '<div class="empty-state">No meetings found.</div>';
      wrap.style.display = "none";
      countEl.textContent = "";
      return;
    }

    meetings.forEach((m) => list.appendChild(renderMeetingCard(m)));
    meetingsOffset += meetings.length;

    const total = data.pagination && data.pagination.total_count;
    if (total) {
      countEl.textContent = `${Math.min(meetingsOffset, total)} of ${total}`;
    }

    wrap.style.display = meetings.length < LIMIT ? "none" : "block";
  } catch (err) {
    if (!append) list.innerHTML = '<div class="empty-state">Failed to load meetings. Please try again.</div>';
    console.error(err);
  }
}

function renderMeetingCard(meeting) {
  const a = document.createElement("a");
  a.className = "meeting-card";
  a.href = `meeting.html?path=${encodeURIComponent(meeting.url)}`;

  const date = new Date(meeting.date + "T12:00:00");
  const month = date.toLocaleDateString("en-CA", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();

  const committeeName = getCommitteeName(meeting.committee_url || meeting.committee);

  let badges = "";
  if (meeting.in_camera) {
    badges += '<span class="badge badge-camera">In Camera</span>';
  }
  if (meeting.has_evidence !== false) {
    badges += '<span class="badge badge-evidence">Evidence</span>';
  }

  a.innerHTML = `
    <div class="meeting-date">
      <span class="month">${month}</span>
      <span class="day">${day}</span>
      <span class="year">${year}</span>
    </div>
    <div class="meeting-info">
      <div class="meeting-committee">${escapeHtml(committeeName)}</div>
      <div class="meeting-number">Meeting #${meeting.number || "—"}</div>
      ${badges ? `<div class="meeting-badges">${badges}</div>` : ""}
    </div>
  `;
  return a;
}

// MEETING DETAIL PAGE
async function initMeeting() {
  const params = new URLSearchParams(window.location.search);
  const path = params.get("path");
  if (!path) {
    document.getElementById("meeting-header").innerHTML = '<div class="empty-state">No meeting specified.</div>';
    return;
  }

  await loadCommittees();
  loadMeetingDetail(path);
}

async function loadMeetingDetail(path) {
  const headerEl = document.getElementById("meeting-header");
  try {
    const res = await fetch(`/api/meeting-detail?path=${encodeURIComponent(path)}`);
    const meeting = await res.json();

    const committeeName = getCommitteeName(meeting.committee_url || meeting.committee);
    const date = meeting.date
      ? new Date(meeting.date + "T12:00:00").toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })
      : "";

    document.title = `${committeeName} — ${date} — OpenParlBrief`;

    let linksHtml = "";
    if (meeting.minutes_url) {
      linksHtml += `<a href="${meeting.minutes_url}" target="_blank">Minutes</a>`;
    }
    if (meeting.notice_url) {
      linksHtml += `<a href="${meeting.notice_url}" target="_blank">Notice</a>`;
    }
    if (meeting.webcast_url) {
      linksHtml += `<a href="${meeting.webcast_url}" target="_blank">Webcast</a>`;
    }
    const sourceUrl = `https://openparliament.ca${path}`;
    linksHtml += `<a href="${sourceUrl}" target="_blank">View on openparliament.ca</a>`;

    let badges = "";
    if (meeting.in_camera) badges += '<span class="badge badge-camera">In Camera</span>';

    headerEl.innerHTML = `
      <div class="meeting-header">
        <h1>${escapeHtml(committeeName)}</h1>
        <div class="meeting-meta">
          <span>${date}</span>
          <span>Meeting #${meeting.number || "—"}</span>
          <span>Session ${meeting.session || "—"}</span>
        </div>
        ${badges ? `<div class="meeting-badges" style="margin-bottom:1rem;">${badges}</div>` : ""}
        ${linksHtml ? `<div class="meeting-links">${linksHtml}</div>` : ""}
      </div>
    `;

    // Load speeches if evidence exists
    if (meeting.in_camera) {
      document.getElementById("no-evidence").style.display = "block";
      document.getElementById("no-evidence").textContent = "This meeting was held in camera. No public evidence is available.";
    } else {
      loadSpeeches(path);
    }
  } catch (err) {
    headerEl.innerHTML = '<div class="empty-state">Failed to load meeting details.</div>';
    console.error(err);
  }
}

async function loadSpeeches(documentPath, append) {
  const section = document.getElementById("speeches-section");
  const list = document.getElementById("speeches-list");
  const wrap = document.getElementById("speeches-load-more-wrap");
  const btn = document.getElementById("speeches-load-more");

  if (!append) {
    section.style.display = "block";
    list.innerHTML = '<div class="loading"><div class="spinner"></div><div class="loading-text">Loading evidence...</div></div>';
  }

  try {
    const res = await fetch(`/api/speeches?document=${encodeURIComponent(documentPath)}&limit=${LIMIT}&offset=${speechesOffset}`);
    const data = await res.json();
    const speeches = data.objects || [];

    if (!append) list.innerHTML = "";

    if (speeches.length === 0 && speechesOffset === 0) {
      section.style.display = "none";
      document.getElementById("no-evidence").style.display = "block";
      return;
    }

    speeches.forEach((s) => list.appendChild(renderSpeech(s)));
    speechesOffset += speeches.length;

    wrap.style.display = speeches.length < LIMIT ? "none" : "block";

    // Bind load more
    btn.onclick = () => loadSpeeches(documentPath, true);
  } catch (err) {
    if (!append) {
      list.innerHTML = "";
      section.style.display = "none";
      document.getElementById("no-evidence").style.display = "block";
      document.getElementById("no-evidence").textContent = "Failed to load evidence.";
    }
    console.error(err);
  }
}

function renderSpeech(speech) {
  const div = document.createElement("div");
  div.className = "speech-block" + (speech.procedural ? " procedural" : "");

  const speaker = (speech.attribution && speech.attribution.en) || "—";
  const content = (speech.content && speech.content.en) || "";
  const time = speech.time || "";

  let speakerHtml;
  if (speech.politician_url) {
    speakerHtml = `<a href="https://openparliament.ca${speech.politician_url}" target="_blank">${escapeHtml(speaker)}</a>`;
  } else {
    speakerHtml = escapeHtml(speaker);
  }

  div.innerHTML = `
    <div class="speech-speaker">${speakerHtml}</div>
    ${time ? `<div class="speech-time">${time}</div>` : ""}
    <div class="speech-content">${content}</div>
  `;
  return div;
}

// UTILS
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
