/* ---------- Confetti ---------- */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let pieces = [], running = false;
const colors = ["#1f4fd1", "#e3b23c", "#b5412f", "#2f7f73", "#ffffff"];

function resize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener("resize", resize);
resize();

function burst(count = 140) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < count; i++) {
    pieces.push({
      x: innerWidth / 2, y: innerHeight * 0.45,
      vx: (Math.random() - 0.5) * 14, vy: Math.random() * -13 - 3,
      w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
      r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
      c: colors[Math.floor(Math.random() * colors.length)], life: 160 + Math.random() * 60
    });
  }
  if (!running) { running = true; requestAnimationFrame(tick); }
}

function tick() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  pieces = pieces.filter(p => p.life > 0 && p.y < innerHeight + 20);
  for (const p of pieces) {
    p.vy += 0.35; p.vx *= 0.99;
    p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
    ctx.save();
    ctx.translate(p.x, p.y); ctx.rotate(p.r);
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  }
  if (pieces.length) requestAnimationFrame(tick);
  else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
}

/* ---------- Party button ---------- */
document.getElementById("party").addEventListener("click", () => {
  burst(200);
  document.getElementById("cake-h").scrollIntoView({ behavior: "smooth", block: "center" });
});

/* ---------- Candles ---------- */
const candles = [...document.querySelectorAll(".candle")];
const wish = document.getElementById("wish");
const cakeHint = document.getElementById("cake-hint");
candles.forEach((c, i) => c.addEventListener("click", () => {
  if (c.classList.contains("out")) return;
  c.classList.add("out");
  c.setAttribute("aria-label", `Candle ${i + 1}, blown out`);
  if (candles.every(x => x.classList.contains("out"))) {
    wish.hidden = false;
    cakeHint.textContent = "All candles out!";
    burst(180);
  }
}));

/* ---------- Flip cards ---------- */
document.querySelectorAll(".flip").forEach(card =>
  card.addEventListener("click", () => {
    const on = card.classList.toggle("on");
    card.setAttribute("aria-pressed", on);
  })
);

/* ---------- Chess moves (birthday wishes) ---------- */
const moves = [
  "Knight to a new year: may every jump land somewhere wonderful.",
  "Pawn to the last rank: small steps are becoming big things.",
  "Castling: a safe, happy year with people who have your back.",
  "Bishop on the diagonal: may surprises come from unexpected angles.",
  "Queen takes all the worries. Today, no one touches your joy.",
  "Checkmate on every challenge this year. Well played, Medha!"
];
let m = -1;
const moveEl = document.getElementById("move");
document.getElementById("moveBtn").addEventListener("click", () => {
  m = (m + 1) % moves.length;
  moveEl.textContent = moves[m];
  if (m === moves.length - 1) burst(120);
});

/* ---------- Photo fallback ---------- */
const img = document.querySelector(".photo-frame img");
img.addEventListener("error", () => { img.style.display = "none"; });
