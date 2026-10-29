// Mindful Moments: small interactions for the website.
document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.textContent = isOpen ? "✕" : "☰";
    });
  }

  // Dashboard date
  const dateElement = document.getElementById("today-date");
  if (dateElement) {
    dateElement.textContent = new Date().toLocaleDateString(undefined, {
      weekday: "short", month: "short", day: "numeric", year: "numeric"
    });
  }

  // Mood tracker. Entries stay in this browser using localStorage.
  const moodButtons = [...document.querySelectorAll(".mood-choice")];
  const moodForm = document.getElementById("mood-form");
  const noteInput = document.getElementById("mood-note");
  const message = document.getElementById("mood-message");
  const history = document.getElementById("mood-history");
  const totalCheckins = document.getElementById("total-checkins");
  const latestMood = document.getElementById("latest-mood");
  const clearButton = document.getElementById("clear-moods");
  const moodEmojis = { Great: "😊", Good: "🙂", Okay: "😐", Low: "😔", Stressed: "😣" };
  let selectedMood = "";
  const STORAGE_KEY = "mindfulMomentsMoodEntries";

  function readEntries() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  }

  function renderEntries() {
    if (!history) return;
    const entries = readEntries();
    history.replaceChildren();
    if (entries.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "Your saved check-ins will appear here.";
      history.appendChild(empty);
    } else {
      entries.slice(0, 5).forEach((entry) => {
        const item = document.createElement("div");
        item.className = "history-item";
        const emoji = document.createElement("span");
        emoji.className = "history-emoji";
        emoji.textContent = moodEmojis[entry.mood] || "♡";
        const copy = document.createElement("div");
        copy.className = "history-copy";
        const title = document.createElement("strong");
        title.textContent = entry.mood;
        const time = document.createElement("time");
        time.textContent = new Date(entry.date).toLocaleString();
        copy.append(title, time);
        if (entry.note) {
          const note = document.createElement("p");
          note.textContent = entry.note;
          copy.appendChild(note);
        }
        item.append(emoji, copy);
        history.appendChild(item);
      });
    }
    if (totalCheckins) totalCheckins.textContent = String(entries.length);
    if (latestMood) latestMood.textContent = entries.length ? entries[0].mood : "Not yet";
  }

  moodButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedMood = button.dataset.mood || "";
      moodButtons.forEach((other) => {
        const active = other === button;
        other.classList.toggle("selected", active);
        other.setAttribute("aria-pressed", String(active));
      });
      if (message) message.textContent = "";
    });
  });

  if (moodForm) {
    moodForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!selectedMood) {
        if (message) message.textContent = "Please choose a mood first.";
        return;
      }
      const entries = readEntries();
      entries.unshift({
        mood: selectedMood,
        note: noteInput ? noteInput.value.trim() : "",
        date: new Date().toISOString()
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 50)));
        if (message) message.textContent = "Your check-in has been saved in this browser.";
        if (noteInput) noteInput.value = "";
        selectedMood = "";
        moodButtons.forEach((button) => {
          button.classList.remove("selected");
          button.setAttribute("aria-pressed", "false");
        });
        renderEntries();
      } catch {
        if (message) message.textContent = "This browser could not save your entry. Check your browser storage settings.";
      }
    });
  }

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      if (!confirm("Clear all mood check-ins saved in this browser? This cannot be undone.")) return;
      localStorage.removeItem(STORAGE_KEY);
      if (message) message.textContent = "Your local mood history has been cleared.";
      renderEntries();
    });
  }
  renderEntries();

  // Gentle breathing timer: 4-second inhale and 6-second exhale, no breath holds.
  const startButton = document.getElementById("breath-start");
  const stopButton = document.getElementById("breath-stop");
  const circle = document.getElementById("breath-circle");
  const phaseText = document.getElementById("breath-phase");
  const countText = document.getElementById("breath-count");
  const instruction = document.getElementById("breath-instruction");
  let breathingTimer = null;
  let phaseTimer = null;
  let breathingRunning = false;

  function stopBreathing() {
    breathingRunning = false;
    clearTimeout(breathingTimer);
    clearInterval(phaseTimer);
    breathingTimer = null;
    phaseTimer = null;
    if (circle) circle.classList.remove("inhale", "exhale");
    if (phaseText) phaseText.textContent = "Ready?";
    if (countText) countText.textContent = "At your own pace";
    if (instruction) instruction.textContent = "Sit comfortably and begin when you're ready.";
    if (startButton) { startButton.disabled = false; startButton.textContent = "Start exercise"; }
    if (stopButton) stopButton.disabled = true;
  }

  function runPhase(name, duration, className, next) {
    if (!breathingRunning) return;
    if (circle) circle.classList.remove("inhale", "exhale");
    if (circle && className) circle.classList.add(className);
    if (phaseText) phaseText.textContent = name;
    if (instruction) instruction.textContent = name === "Breathe in"
      ? "Gently breathe in through your nose, if comfortable."
      : "Let your breath out slowly. Don't force it.";
    let remaining = duration;
    if (countText) countText.textContent = `${remaining} seconds`;
    clearInterval(phaseTimer);
    phaseTimer = setInterval(() => {
      remaining -= 1;
      if (countText) countText.textContent = `${Math.max(remaining, 0)} seconds`;
    }, 1000);
    breathingTimer = setTimeout(() => {
      clearInterval(phaseTimer);
      next();
    }, duration * 1000);
  }

  function startBreathing() {
    if (breathingRunning) return;
    breathingRunning = true;
    if (startButton) { startButton.disabled = true; startButton.textContent = "Exercise in progress"; }
    if (stopButton) stopButton.disabled = false;
    const cycle = () => {
      runPhase("Breathe in", 4, "inhale", () => {
        runPhase("Breathe out", 6, "exhale", cycle);
      });
    };
    cycle();
  }
  if (startButton) startButton.addEventListener("click", startBreathing);
  if (stopButton) stopButton.addEventListener("click", stopBreathing);
});