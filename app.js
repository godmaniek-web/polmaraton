const plan = [
  [
    { name: "Bieg 1", km: 5, title: "5 km spokojnie", details: "Tempo 6:10–6:30/km" },
    { name: "Bieg 2 + przebieżki", km: 5, title: "5 km + 4×15 s", details: "6:10–6:30/km · przebieżki 4:50–5:10/km" },
    { name: "Długi bieg", km: 7, title: "7 km długo", details: "Tempo 6:25–6:50/km" }
  ],
  [
    { name: "Bieg 1", km: 5, title: "5 km spokojnie", details: "Tempo 6:10–6:30/km" },
    { name: "Bieg 2", km: 6, title: "6 km spokojnie", details: "Tempo 6:10–6:35/km" },
    { name: "Długi bieg", km: 8, title: "8 km długo", details: "Tempo 6:25–6:50/km" }
  ],
  [
    { name: "Bieg 1", km: 6, title: "6 km spokojnie", details: "Tempo 6:10–6:35/km" },
    { name: "Bieg 2 + przebieżki", km: 6, title: "6 km + 4×20 s", details: "6:10–6:35/km · przebieżki 4:50–5:10/km" },
    { name: "Długi bieg", km: 10, title: "10 km długo", details: "Tempo 6:25–6:55/km" }
  ],
  [
    { name: "Bieg 1", km: 6, title: "6 km spokojnie", details: "Tempo 6:10–6:35/km" },
    { name: "Bieg 2", km: 7, title: "7 km spokojnie", details: "Tempo 6:10–6:35/km" },
    { name: "Długi bieg", km: 12, title: "12 km długo", details: "Tempo 6:25–6:55/km" }
  ],
  [
    { name: "Bieg 1", km: 6, title: "6 km spokojnie", details: "Tempo 6:10–6:35/km" },
    { name: "Bieg 2 + przebieżki", km: 7, title: "7 km + 5×20 s", details: "6:10–6:35/km · przebieżki 4:50–5:10/km" },
    { name: "Długi bieg", km: 14, title: "14 km długo", details: "Tempo 6:30–7:00/km" }
  ],
  [
    { name: "Bieg 1", km: 7, title: "7 km spokojnie", details: "Tempo 6:10–6:35/km" },
    { name: "Bieg 2", km: 8, title: "8 km spokojnie", details: "Tempo 6:10–6:35/km" },
    { name: "Długi bieg", km: 15.5, title: "15–16 km długo", details: "Tempo 6:30–7:00/km" }
  ],
  [
    { name: "Bieg 1", km: 6, title: "6 km bardzo lekko", details: "Tempo 6:30–6:55/km" },
    { name: "Bieg 2 + przebieżki", km: 6, title: "6 km + 4×15 s", details: "6:30–6:55/km · przebieżki 4:55–5:15/km" },
    { name: "Długi bieg", km: 12, title: "12 km długo", details: "Tempo 6:35–7:00/km" }
  ],
  [
    { name: "Bieg 1", km: 7, title: "7 km spokojnie", details: "Tempo 6:10–6:35/km" },
    { name: "Bieg szybszy", km: 8, title: "8 km z tempem", details: "6 km 6:10–6:35/km + 2 km 5:45–5:55/km" },
    { name: "Długi bieg", km: 17.5, title: "17–18 km długo", details: "Tempo 6:30–7:05/km" }
  ],
  [
    { name: "Bieg 1", km: 6, title: "6 km spokojnie", details: "Tempo 6:15–6:40/km" },
    { name: "Bieg 2 + przebieżki", km: 6, title: "6 km + 4×15 s", details: "6:20–6:45/km · przebieżki 4:55–5:15/km" },
    { name: "Długi bieg", km: 13.5, title: "13–14 km długo", details: "Tempo 6:35–7:00/km" }
  ],
  [
    { name: "Bieg 1", km: 5, title: "5 km bardzo lekko", details: "Tempo 6:30–6:55/km" },
    { name: "Rozruch", km: 3.5, title: "3–4 km rozruchu", details: "Tempo 6:35–7:00/km" },
    { name: "Półmaraton", km: 21.1, title: "PÓŁMARATON", details: "Zaufaj przygotowaniu. Biegnij mądrze.", race: true }
  ]
];

const STORAGE_KEY = "nocny-polmaraton-progress-v1";
const DATE_KEY = "nocny-polmaraton-race-date";
let progress = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

const $ = (selector) => document.querySelector(selector);
const pad = (number) => String(number).padStart(2, "0");
const idFor = (weekIndex, workoutIndex) => `w${weekIndex + 1}-${workoutIndex + 1}`;
const formatDate = (date, long = false) =>
  new Intl.DateTimeFormat("pl-PL", long
    ? { day: "numeric", month: "long" }
    : { day: "2-digit", month: "short" }).format(date);

function dateOnly(value) {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getRaceDate() {
  return dateOnly(`${$("#raceDate").value}T12:00:00`);
}

function getPlanStart() {
  const race = getRaceDate();
  const start = new Date(race);
  start.setDate(start.getDate() - 68);
  return start;
}

function workoutDate(weekIndex, workoutIndex) {
  const start = getPlanStart();
  const date = new Date(start);
  const offsets = [0, 2, 5];
  date.setDate(start.getDate() + weekIndex * 7 + offsets[workoutIndex]);
  if (weekIndex === 9 && workoutIndex === 2) return getRaceDate();
  return date;
}

function currentWeekIndex() {
  const today = dateOnly(new Date());
  const start = getPlanStart();
  const difference = Math.floor((today - start) / 86400000);
  return Math.max(0, Math.min(9, Math.floor(difference / 7)));
}

function totalPlannedDistance() {
  return plan.flat().reduce((sum, workout) => sum + workout.km, 0);
}

function render() {
  const container = $("#weeks");
  const current = currentWeekIndex();
  container.innerHTML = "";

  plan.forEach((week, weekIndex) => {
    const completed = week.filter((_, workoutIndex) => progress[idFor(weekIndex, workoutIndex)]?.completed).length;
    const startDate = workoutDate(weekIndex, 0);
    const endDate = workoutDate(weekIndex, 2);
    const article = document.createElement("article");
    article.className = `week ${weekIndex === current ? "current" : ""}`;
    article.innerHTML = `
      <div class="week-head">
        <span class="week-number">${pad(weekIndex + 1)}</span>
        <div>
          <h3>TYDZIEŃ ${weekIndex + 1}</h3>
          <p>${formatDate(startDate)} — ${formatDate(endDate)}</p>
        </div>
        <span class="week-progress">${completed}/3 wykonane</span>
      </div>
      <div class="workouts">
        ${week.map((workout, workoutIndex) => {
          const id = idFor(weekIndex, workoutIndex);
          const saved = progress[id] || {};
          const result = saved.completed
            ? `<span class="result">${saved.distance ? `${saved.distance} km` : "Wykonano"}${saved.time ? ` · ${saved.time} min` : ""}${saved.mood ? ` · ${saved.mood}` : ""}</span>`
            : "";
          return `
            <button class="workout ${saved.completed ? "done" : ""} ${workout.race ? "race-workout" : ""}" data-id="${id}" type="button">
              <span class="date">${formatDate(workoutDate(weekIndex, workoutIndex), true)}</span>
              <b>${workout.name}</b>
              <span class="details">${workout.title}<br>${workout.details}</span>
              ${result}
            </button>`;
        }).join("")}
      </div>`;
    container.appendChild(article);
  });

  document.querySelectorAll(".workout").forEach((button) =>
    button.addEventListener("click", () => openWorkout(button.dataset.id)));
  updateSummary();
}

function getNextWorkout() {
  const now = dateOnly(new Date());
  const all = plan.flatMap((week, weekIndex) =>
    week.map((workout, workoutIndex) => ({
      ...workout,
      id: idFor(weekIndex, workoutIndex),
      weekIndex,
      workoutIndex,
      date: workoutDate(weekIndex, workoutIndex)
    })));
  return all.find((workout) => !progress[workout.id]?.completed && workout.date >= now)
    || all.find((workout) => !progress[workout.id]?.completed)
    || null;
}

function updateSummary() {
  const completedEntries = Object.values(progress).filter((item) => item.completed);
  const total = plan.flat().length;
  const percent = Math.round((completedEntries.length / total) * 100);
  const actualDistance = completedEntries.reduce((sum, item) => sum + (Number(item.distance) || 0), 0);
  $("#doneCount").textContent = completedEntries.length;
  $("#totalCount").textContent = total;
  $("#progressPercent").textContent = `${percent}%`;
  $("#progressRing").style.setProperty("--progress", `${percent * 3.6}deg`);
  $("#distanceSummary").textContent = `${actualDistance.toFixed(actualDistance % 1 ? 1 : 0)} z ${totalPlannedDistance().toFixed(1)} km za Tobą`;

  const days = Math.ceil((getRaceDate() - dateOnly(new Date())) / 86400000);
  $("#daysLeft").textContent = Math.max(0, days);

  const next = getNextWorkout();
  if (!next) {
    $("#nextLabel").textContent = "PLAN UKOŃCZONY";
    $("#nextDate").textContent = "";
    $("#nextType").textContent = "BRAWO!";
    $("#nextTitle").textContent = "Wszystkie treningi wykonane";
    $("#nextPace").textContent = "Teraz czas cieszyć się efektem pracy.";
    $("#quickComplete").hidden = true;
    return;
  }
  $("#nextLabel").textContent = "NAJBLIŻSZY TRENING";
  $("#nextDate").textContent = formatDate(next.date, true);
  $("#nextType").textContent = `TYDZIEŃ ${next.weekIndex + 1} · ${next.name}`;
  $("#nextTitle").textContent = next.title;
  $("#nextPace").textContent = next.details;
  $("#quickComplete").hidden = false;
  $("#quickComplete").dataset.id = next.id;
}

function openWorkout(id) {
  const [weekPart, workoutPart] = id.replace("w", "").split("-").map(Number);
  const workout = plan[weekPart - 1][workoutPart - 1];
  const saved = progress[id] || {};
  $("#workoutId").value = id;
  $("#dialogWeek").innerHTML = `<span></span> TYDZIEŃ ${weekPart} · ${formatDate(workoutDate(weekPart - 1, workoutPart - 1), true)}`;
  $("#dialogTitle").textContent = workout.name;
  $("#dialogPlan").textContent = `${workout.title} — ${workout.details}`;
  $("#actualDistance").value = saved.distance || "";
  $("#actualTime").value = saved.time || "";
  $("#notes").value = saved.notes || "";
  $("#completed").checked = Boolean(saved.completed);
  document.querySelectorAll('input[name="mood"]').forEach((radio) => {
    radio.checked = radio.value === saved.mood;
  });
  $("#workoutDialog").showModal();
}

$("#workoutForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const id = $("#workoutId").value;
  progress[id] = {
    distance: $("#actualDistance").value,
    time: $("#actualTime").value,
    mood: document.querySelector('input[name="mood"]:checked')?.value || "",
    notes: $("#notes").value.trim(),
    completed: $("#completed").checked
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  $("#workoutDialog").close();
  render();
});

$("#quickComplete").addEventListener("click", () => {
  const id = $("#quickComplete").dataset.id;
  progress[id] = { ...(progress[id] || {}), completed: true };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  render();
});

$("#raceDate").addEventListener("change", () => {
  localStorage.setItem(DATE_KEY, $("#raceDate").value);
  render();
});

$("#resetButton").addEventListener("click", () => {
  if (!confirm("Wyczyścić wszystkie zapisane wyniki i odznaczyć treningi?")) return;
  progress = {};
  localStorage.removeItem(STORAGE_KEY);
  render();
});

const savedDate = localStorage.getItem(DATE_KEY);
if (savedDate) $("#raceDate").value = savedDate;
render();
