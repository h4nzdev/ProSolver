// ── NAVIGATION ────────────────────────────────────────────────────
function go(id) {
  document
    .querySelectorAll(".feature")
    .forEach((f) => f.classList.remove("active"));
  document
    .querySelectorAll(".pill")
    .forEach((p) => p.classList.remove("active"));

  const feat = document.getElementById(id);
  if (feat) feat.classList.add("active");

  const pill = document.querySelector(`[data-target="${id}"]`);
  if (pill) pill.classList.add("active");

  // Home pill stays highlighted only on home
  const homeBtn = document.getElementById("home-pill-btn");
  homeBtn.classList.toggle("active", id === "home");

  const isHome = id === "home";
  const heroStrip = document.getElementById("hero-strip");
  const toolsLabel = document.getElementById("tools-label");
  const viewToolsBar = document.getElementById("view-tools-bar");

  heroStrip.style.display = isHome ? "" : "none";
  toolsLabel.style.display = isHome ? "" : "none";
  viewToolsBar.style.display = isHome ? "" : "none";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".pill").forEach((pill) => {
  pill.addEventListener("click", () => go(pill.dataset.target));
});

// ── BASIC CALCULATOR ──────────────────────────────────────────────
let calcState = { display: "0", operator: null, prev: null, waitNext: false };
function calcInput(key) {
  const d = document.getElementById("calc-display");
  const s = calcState;
  if (key === "C") {
    s.display = "0";
    s.operator = null;
    s.prev = null;
    s.waitNext = false;
  } else if (key === "±") {
    s.display = s.display.startsWith("-")
      ? s.display.slice(1)
      : "-" + s.display;
  } else if (key === "%") {
    s.display = String(parseFloat(s.display) / 100);
  } else if (["+", "−", "×", "÷"].includes(key)) {
    s.prev = parseFloat(s.display);
    s.operator = key;
    s.waitNext = true;
  } else if (key === "=") {
    if (s.operator && s.prev !== null) {
      const cur = parseFloat(s.display);
      let res;
      if (s.operator === "+") res = s.prev + cur;
      else if (s.operator === "−") res = s.prev - cur;
      else if (s.operator === "×") res = s.prev * cur;
      else if (s.operator === "÷") res = cur === 0 ? "Error" : s.prev / cur;
      s.display =
        res === "Error" ? "Error" : String(parseFloat(res.toFixed(10)));
      s.operator = null;
      s.prev = null;
      s.waitNext = false;
    }
  } else if (key === ".") {
    if (s.waitNext) {
      s.display = "0.";
      s.waitNext = false;
    } else if (!s.display.includes(".")) s.display += ".";
  } else {
    if (s.waitNext || s.display === "0") {
      s.display = key;
      s.waitNext = false;
    } else s.display += key;
  }
  d.textContent = s.display;
}

// ── BASIC STEP-BY-STEP ────────────────────────────────────────────
function doBasic(op) {
  const a = parseFloat(document.getElementById("basic-a").value);
  const b = parseFloat(document.getElementById("basic-b").value);
  const r = document.getElementById("basic-result");
  r.className = "result-box";
  const needsB = ["add", "sub", "mul", "div", "mod", "pow"];
  if (needsB.includes(op) && (isNaN(a) || isNaN(b))) {
    r.textContent = "Enter values for both A and B.";
    r.className = "result-box error";
    return;
  }
  if ((op === "sqrt" || op === "abs") && isNaN(a)) {
    r.textContent = "Enter a value for A.";
    r.className = "result-box error";
    return;
  }
  let res, label;
  if (op === "add") {
    res = a + b;
    label = `${a} + ${b} = ${res}`;
  } else if (op === "sub") {
    res = a - b;
    label = `${a} − ${b} = ${res}`;
  } else if (op === "mul") {
    res = a * b;
    label = `${a} × ${b} = ${res}`;
  } else if (op === "div") {
    if (b === 0) {
      r.textContent = "Division by zero is undefined.";
      r.className = "result-box error";
      return;
    }
    res = a / b;
    label = `${a} ÷ ${b} = ${res}\nQuotient: ${Math.trunc(res)}   Remainder: ${a % b}`;
  } else if (op === "mod") {
    if (b === 0) {
      r.textContent = "Modulo by zero is undefined.";
      r.className = "result-box error";
      return;
    }
    res = a % b;
    label = `${a} mod ${b} = ${res}`;
  } else if (op === "pow") {
    res = Math.pow(a, b);
    label = `${a}^${b} = ${res}`;
  } else if (op === "sqrt") {
    if (a < 0) {
      r.textContent = "√ of negative number is not real.";
      r.className = "result-box error";
      return;
    }
    res = Math.sqrt(a);
    label = `√${a} = ${res}`;
  } else if (op === "abs") {
    res = Math.abs(a);
    label = `|${a}| = ${res}`;
  }
  r.textContent = label;
}

// ── PRIME THEORY ──────────────────────────────────────────────────
function isPrime(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) if (n % i === 0) return false;
  return true;
}
function checkPrime() {
  const n = parseInt(document.getElementById("prime-check-n").value);
  const r = document.getElementById("prime-check-result");
  if (isNaN(n) || n < 1) {
    r.textContent = "Please enter a positive integer.";
    r.className = "result-box error";
    return;
  }
  r.className = "result-box";
  r.textContent = isPrime(n)
    ? `✓  ${n} is a prime number.`
    : `✗  ${n} is not a prime number.`;
}
function primeFactorize() {
  let n = parseInt(document.getElementById("prime-factor-n").value);
  const r = document.getElementById("prime-factor-result");
  if (isNaN(n) || n < 2) {
    r.textContent = "Enter an integer ≥ 2.";
    r.className = "result-box error";
    return;
  }
  r.className = "result-box";
  const orig = n,
    factors = [];
  for (let d = 2; d * d <= n; d++) {
    while (n % d === 0) {
      factors.push(d);
      n /= d;
    }
  }
  if (n > 1) factors.push(n);
  const groups = {};
  factors.forEach((f) => (groups[f] = (groups[f] || 0) + 1));
  const expr = Object.entries(groups)
    .map(([b, e]) => (e > 1 ? `${b}^${e}` : `${b}`))
    .join(" × ");
  r.textContent = `${orig} = ${expr}`;
}
function listPrimes() {
  const n = parseInt(document.getElementById("prime-list-n").value);
  const r = document.getElementById("prime-list-result");
  if (isNaN(n) || n < 2) {
    r.textContent = "Enter an integer ≥ 2.";
    r.className = "result-box error";
    return;
  }
  r.className = "result-box";
  const primes = [];
  for (let i = 2; i <= Math.min(n, 10000); i++) if (isPrime(i)) primes.push(i);
  r.textContent = `Found ${primes.length} prime(s):\n${primes.join(", ")}`;
}

// ── EUCLIDEAN ─────────────────────────────────────────────────────
function runEuclidean() {
  let a = parseInt(document.getElementById("euc-a").value);
  let b = parseInt(document.getElementById("euc-b").value);
  const r = document.getElementById("euc-result");
  if (isNaN(a) || isNaN(b) || a < 1 || b < 1) {
    r.textContent = "Enter two positive integers.";
    r.className = "result-box error";
    return;
  }
  r.className = "result-box";
  const oa = a,
    ob = b,
    steps = [];
  function gcd(a, b) {
    while (b !== 0) {
      steps.push(`${a} = ${Math.floor(a / b)} × ${b} + ${a % b}`);
      [a, b] = [b, a % b];
    }
    return a;
  }
  const g = gcd(a, b);
  r.textContent = `GCD(${oa}, ${ob}) = ${g}\nLCM(${oa}, ${ob}) = ${(oa * ob) / g}\n\nSteps:\n${steps.join("\n")}`;
}

// ── LOGIC EVALUATOR ───────────────────────────────────────────────
function evalLogic() {
  const exprRaw = document.getElementById("logic-expr").value.trim();
  const varsRaw = document.getElementById("logic-vars").value.trim();
  const r = document.getElementById("logic-result");
  if (!exprRaw) {
    r.textContent = "Please enter an expression.";
    r.className = "result-box error";
    return;
  }
  try {
    const vars = {};
    varsRaw.split(",").forEach((part) => {
      const [k, v] = part.split("=").map((s) => s.trim().toLowerCase());
      if (k) vars[k] = v === "true" || v === "1";
    });
    const result = evaluateExpr(exprRaw, vars);
    r.className = "result-box";
    const varList = Object.entries(vars)
      .map(([k, v]) => `${k} = ${v}`)
      .join(", ");
    r.textContent = `With [${varList}]\n\n${exprRaw}\n⟹  ${result}`;
  } catch (e) {
    r.textContent = "Error: " + e.message;
    r.className = "result-box error";
  }
}
function evaluateExpr(expr, vars) {
  let s = expr
    .toUpperCase()
    .replace(/\bAND\b/g, "&&")
    .replace(/\bOR\b/g, "||")
    .replace(/\bNOT\b/g, "!");
  Object.entries(vars).forEach(([k, v]) => {
    s = s.replace(
      new RegExp("\\b" + k.toUpperCase() + "\\b", "g"),
      v ? "true" : "false",
    );
  });
  s = s.replace(
    /(\w+|\([^)]+\))\s*IMPLIES\s*(\w+|\([^)]+\))/g,
    (_, a, b) => `(!${a}||${b})`,
  );
  s = s.replace(
    /(\w+|\([^)]+\))\s*IFF\s*(\w+|\([^)]+\))/g,
    (_, a, b) => `(${a}===${b})`,
  );
  s = s.replace(/\bXOR\b/g, "^");
  return new Function('"use strict"; return (' + s + ")")();
}

// ── SET OPERATIONS ────────────────────────────────────────────────
function parseSet(id) {
  return new Set(
    document
      .getElementById(id)
      .value.split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
}
function doSet(op) {
  const A = parseSet("set-a"),
    B = parseSet("set-b"),
    r = document.getElementById("set-result");
  r.className = "result-box";
  let result, label;
  if (op === "union") {
    result = new Set([...A, ...B]);
    label = "A ∪ B";
  } else if (op === "intersect") {
    result = new Set([...A].filter((x) => B.has(x)));
    label = "A ∩ B";
  } else if (op === "diff-ab") {
    result = new Set([...A].filter((x) => !B.has(x)));
    label = "A − B";
  } else if (op === "diff-ba") {
    result = new Set([...B].filter((x) => !A.has(x)));
    label = "B − A";
  } else if (op === "sym-diff") {
    result = new Set([
      ...[...A].filter((x) => !B.has(x)),
      ...[...B].filter((x) => !A.has(x)),
    ]);
    label = "A △ B";
  }
  const sorted = [...result].sort((a, b) =>
    isNaN(a) || isNaN(b) ? a.localeCompare(b) : Number(a) - Number(b),
  );
  r.textContent = `${label} = { ${sorted.join(", ")} }   |   Cardinality: ${result.size}`;
}

// ── COMBINATORICS ─────────────────────────────────────────────────
function factorial(n) {
  if (n < 0) throw new Error("No factorial for negative numbers");
  if (n === 0 || n === 1) return BigInt(1);
  let r = BigInt(1);
  for (let i = 2; i <= n; i++) r *= BigInt(i);
  return r;
}
function doComb(type) {
  const n = parseInt(document.getElementById("comb-n").value),
    k = parseInt(document.getElementById("comb-k").value),
    r = document.getElementById("comb-result"),
    f = document.getElementById("comb-formula");
  r.className = "result-box";
  try {
    if (type === "fact") {
      if (isNaN(n) || n < 0)
        throw new Error("Enter a non-negative integer for n");
      f.textContent = `${n}!`;
      r.textContent = factorial(n).toString();
    } else if (type === "perm") {
      if (isNaN(n) || isNaN(k) || k > n) throw new Error("Ensure 0 ≤ k ≤ n");
      f.textContent = `P(${n},${k}) = ${n}! / (${n}-${k})!`;
      r.textContent = (factorial(n) / factorial(n - k)).toString();
    } else {
      if (isNaN(n) || isNaN(k) || k > n) throw new Error("Ensure 0 ≤ k ≤ n");
      f.textContent = `C(${n},${k}) = ${n}! / (${k}! × (${n}-${k})!)`;
      r.textContent = (
        factorial(n) /
        (factorial(k) * factorial(n - k))
      ).toString();
    }
  } catch (e) {
    r.textContent = "Error: " + e.message;
    r.className = "result-box error";
  }
}

// ── STATISTICS ────────────────────────────────────────────────────
function calcStats() {
  const raw = document.getElementById("stat-data").value;
  const nums = raw
    .split(",")
    .map((s) => parseFloat(s.trim()))
    .filter((n) => !isNaN(n));
  const container = document.getElementById("stat-result");
  if (nums.length === 0) {
    container.innerHTML =
      '<div class="result-box error">Enter at least one number.</div>';
    return;
  }
  const sorted = [...nums].sort((a, b) => a - b);
  const n = nums.length;
  const mean = nums.reduce((a, b) => a + b, 0) / n;
  const mid = Math.floor(n / 2);
  const median = n % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  const freq = {};
  nums.forEach((x) => (freq[x] = (freq[x] || 0) + 1));
  const maxF = Math.max(...Object.values(freq));
  const modes = Object.entries(freq)
    .filter(([_, v]) => v === maxF)
    .map(([k]) => k);
  const variance = nums.reduce((s, x) => s + (x - mean) ** 2, 0) / n;
  const stddev = Math.sqrt(variance);
  const range = sorted[n - 1] - sorted[0];
  container.innerHTML = `<div class="stats-grid"><div class="stat-cell"><span class="stat-label">Count</span><span class="stat-val">${n}</span></div><div class="stat-cell"><span class="stat-label">Mean</span><span class="stat-val">${mean.toFixed(4)}</span></div><div class="stat-cell"><span class="stat-label">Median</span><span class="stat-val">${median}</span></div><div class="stat-cell"><span class="stat-label">Mode</span><span class="stat-val">${modes.join(", ")}</span></div><div class="stat-cell"><span class="stat-label">Std Dev (σ)</span><span class="stat-val">${stddev.toFixed(4)}</span></div><div class="stat-cell"><span class="stat-label">Variance (σ²)</span><span class="stat-val">${variance.toFixed(4)}</span></div><div class="stat-cell"><span class="stat-label">Range</span><span class="stat-val">${range}</span></div><div class="stat-cell"><span class="stat-label">Min / Max</span><span class="stat-val">${sorted[0]} / ${sorted[n - 1]}</span></div></div>`;
}

// ── PERCENTAGES ───────────────────────────────────────────────────
function calcPct(type) {
  if (type === "of") {
    const x = parseFloat(document.getElementById("pct-x").value),
      y = parseFloat(document.getElementById("pct-y").value),
      r = document.getElementById("pct-of-result");
    if (isNaN(x) || isNaN(y)) {
      r.textContent = "Enter valid numbers.";
      r.className = "result-box error";
      return;
    }
    r.className = "result-box";
    r.textContent = `${x}% of ${y} = ${((x / 100) * y).toFixed(6).replace(/\.?0+$/, "")}`;
  } else if (type === "what") {
    const x = parseFloat(document.getElementById("pct-x2").value),
      y = parseFloat(document.getElementById("pct-y2").value),
      r = document.getElementById("pct-what-result");
    if (isNaN(x) || isNaN(y) || y === 0) {
      r.textContent = "Enter valid numbers (Y ≠ 0).";
      r.className = "result-box error";
      return;
    }
    r.className = "result-box";
    r.textContent = `${x} is ${((x / y) * 100).toFixed(4)}% of ${y}`;
  } else {
    const a = parseFloat(document.getElementById("pct-a").value),
      b = parseFloat(document.getElementById("pct-b").value),
      r = document.getElementById("pct-change-result");
    if (isNaN(a) || isNaN(b) || a === 0) {
      r.textContent = "Enter valid numbers (A ≠ 0).";
      r.className = "result-box error";
      return;
    }
    r.className = "result-box";
    const change = ((b - a) / Math.abs(a)) * 100;
    r.textContent = `${a} → ${b} : ${change >= 0 ? "+" : ""}${change.toFixed(4)}% ${change >= 0 ? "increase" : "decrease"}`;
  }
}

// ── TRUTH TABLES ──────────────────────────────────────────────────
function genTruthTable() {
  const exprRaw = document.getElementById("tt-expr").value.trim();
  const container = document.getElementById("tt-result");
  if (!exprRaw) {
    container.innerHTML =
      '<div class="result-box error">Enter an expression.</div>';
    return;
  }
  const varMatches = exprRaw.match(/\b[a-z]\b/gi);
  if (!varMatches) {
    container.innerHTML =
      '<div class="result-box error">No variables found.</div>';
    return;
  }
  const vars = [...new Set(varMatches.map((v) => v.toLowerCase()))].sort();
  if (vars.length > 4) {
    container.innerHTML =
      '<div class="result-box error">Maximum 4 variables supported.</div>';
    return;
  }
  const rows = [];
  const count = 1 << vars.length;
  for (let i = 0; i < count; i++) {
    const assignment = {};
    vars.forEach((v, idx) => {
      assignment[v] = !!(i & (1 << (vars.length - 1 - idx)));
    });
    let result;
    try {
      result = evaluateExpr(exprRaw, assignment);
    } catch (e) {
      result = "ERR";
    }
    rows.push({ assignment, result });
  }
  let html = `<table class="tt-table"><thead><tr>`;
  vars.forEach((v) => (html += `<th>${v}</th>`));
  html += `<th>${exprRaw}</th></tr></thead><tbody>`;
  rows.forEach((row) => {
    html += "<tr>";
    vars.forEach((v) => {
      const val = row.assignment[v];
      html += `<td class="${val ? "true-val" : "false-val"}">${val ? "T" : "F"}</td>`;
    });
    html += `<td class="${row.result ? "true-val" : "false-val"}">${row.result ? "T" : "F"}</td>`;
    html += "</tr>";
  });
  html += "</tbody></table>";
  container.innerHTML = html;
}

// ── FRACTIONS ─────────────────────────────────────────────────────
function gcdNum(a, b) {
  return b === 0 ? a : gcdNum(b, a % b);
}
function doFrac(op) {
  const n1 = parseInt(document.getElementById("frac-n1").value),
    d1 = parseInt(document.getElementById("frac-d1").value),
    n2 = parseInt(document.getElementById("frac-n2").value),
    d2 = parseInt(document.getElementById("frac-d2").value),
    r = document.getElementById("frac-result");
  if ([n1, d1, n2, d2].some(isNaN) || d1 === 0 || d2 === 0) {
    r.textContent = "Enter valid fractions (denominators ≠ 0).";
    r.className = "result-box error";
    return;
  }
  r.className = "result-box";
  let rn, rd;
  if (op === "+") {
    rn = n1 * d2 + n2 * d1;
    rd = d1 * d2;
  } else if (op === "-") {
    rn = n1 * d2 - n2 * d1;
    rd = d1 * d2;
  } else if (op === "*") {
    rn = n1 * n2;
    rd = d1 * d2;
  } else {
    if (n2 === 0) {
      r.textContent = "Cannot divide by zero.";
      r.className = "result-box error";
      return;
    }
    rn = n1 * d2;
    rd = d1 * n2;
  }
  if (rd < 0) {
    rn = -rn;
    rd = -rd;
  }
  const g = gcdNum(Math.abs(rn), Math.abs(rd));
  rn /= g;
  rd /= g;
  const opSymbol = { "+": "＋", "-": "−", "*": "×", "/": "÷" }[op];
  r.textContent = `${n1}/${d1} ${opSymbol} ${n2}/${d2} = ${rn}/${rd}${rd === 1 ? ` = ${rn}` : ` ≈ ${(rn / rd).toFixed(6).replace(/\.?0+$/, "")}`}`;
}
