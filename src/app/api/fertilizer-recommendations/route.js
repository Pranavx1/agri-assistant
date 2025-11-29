import { NextResponse } from "next/server";

const fertilizerCatalog = {
  urea: {
    id: "urea",
    name: "Urea",
    npk: "46-0-0",
    focuses: ["nitrogen"],
    release: "fast",
    soilTypes: ["Loamy", "Clay", "Silty", "Laterite"],
    crops: ["Rice", "Wheat", "Maize", "Sugarcane"],
    reason: "Highly concentrated nitrogen source that rapidly supports vegetative growth.",
    application: "Broadcast evenly and incorporate with irrigation. Avoid direct contact with seedlings.",
  },
  ammoniumSulphate: {
    id: "ammoniumSulphate",
    name: "Ammonium Sulphate",
    npk: "20-0-0 + 24S",
    focuses: ["nitrogen"],
    release: "moderate",
    soilTypes: ["Sandy", "Chalky"],
    crops: ["Tea", "Coffee", "Rice"],
    reason: "Supplies nitrogen and sulphur while gently acidifying alkaline soils.",
    application: "Band near the root zone. Ideal for alkaline fields that need sulphur as well as nitrogen.",
  },
  calciumNitrate: {
    id: "calciumNitrate",
    name: "Calcium Nitrate",
    npk: "15.5-0-0 + 18.8Ca",
    focuses: ["nitrogen"],
    release: "fast",
    soilTypes: ["Peaty", "Sandy", "Chalky"],
    crops: ["Tomatoes", "Potatoes", "Banana"],
    reason: "Provides immediately available nitrate nitrogen plus calcium for fruit set and tuber quality.",
    application: "Use through fertigation or as a foliar spray during flowering and fruit set.",
  },
  dap: {
    id: "dap",
    name: "Di-Ammonium Phosphate (DAP)",
    npk: "18-46-0",
    focuses: ["nitrogen", "phosphorus"],
    release: "moderate",
    soilTypes: ["Loamy", "Clay", "Silty"],
    crops: ["Rice", "Wheat", "Maize", "Soybean"],
    reason: "Balanced nitrogen and high phosphorus for strong rooting and initial vigor.",
    application: "Place 5 cm below the seed at sowing or side dress early in the season.",
  },
  singleSuperPhosphate: {
    id: "singleSuperPhosphate",
    name: "Single Super Phosphate (SSP)",
    npk: "0-16-0 + 12S + Ca",
    focuses: ["phosphorus"],
    release: "moderate",
    soilTypes: ["Loamy", "Clay", "Laterite"],
    crops: ["Groundnut", "Soybean", "Sugarcane"],
    reason: "Boosts phosphorus along with sulphur and calcium for nodulation and root growth.",
    application: "Apply as basal dose or side dressing around the root zone.",
  },
  rockPhosphate: {
    id: "rockPhosphate",
    name: "Rock Phosphate",
    npk: "0-30-0",
    focuses: ["phosphorus"],
    release: "slow",
    soilTypes: ["Peaty", "Laterite", "Loamy"],
    crops: ["Tea", "Coffee", "Banana"],
    reason: "Slow-release phosphorus source ideal for acidic soils.",
    application: "Incorporate deeply well before planting for long-term availability.",
  },
  mop: {
    id: "mop",
    name: "Muriate of Potash (MOP)",
    npk: "0-0-60",
    focuses: ["potassium"],
    release: "fast",
    soilTypes: ["Loamy", "Clay", "Silty"],
    crops: ["Rice", "Wheat", "Sugarcane"],
    reason: "High-analysis potassium source for stronger stalks and disease tolerance.",
    application: "Apply at earthing up or at the onset of reproductive stages.",
  },
  sop: {
    id: "sop",
    name: "Sulfate of Potash (SOP)",
    npk: "0-0-50 + 17S",
    focuses: ["potassium"],
    release: "moderate",
    soilTypes: ["Sandy", "Peaty", "Chalky"],
    crops: ["Tomatoes", "Potatoes", "Tea", "Coffee", "Banana"],
    reason: "Chloride-free potassium source that also supplies sulphur for quality produce.",
    application: "Ideal for chloride-sensitive crops; apply through drip or as band placement.",
  },
  npkBalance: {
    id: "npkBalance",
    name: "Complex NPK 17-17-17",
    npk: "17-17-17",
    focuses: ["nitrogen", "phosphorus", "potassium"],
    release: "moderate",
    soilTypes: ["Loamy", "Clay", "Silty"],
    crops: ["Maize", "Cotton", "Tomatoes"],
    reason: "Balanced NPK complex for correcting multiple nutrient gaps simultaneously.",
    application: "Apply as basal dose or split into two dressings during early growth stage.",
  },
  npkHighK: {
    id: "npkHighK",
    name: "Complex NPK 12-32-16",
    npk: "12-32-16",
    focuses: ["phosphorus", "potassium"],
    release: "moderate",
    soilTypes: ["Sandy", "Laterite", "Peaty"],
    crops: ["Soybean", "Groundnut", "Banana"],
    reason: "Higher phosphorus and potassium complex for reproductive and fruiting phases.",
    application: "Use prior to flowering or bunch initiation to support fruit load.",
  },
  vermicompost: {
    id: "vermicompost",
    name: "Vermicompost",
    npk: "1-1-1 (approx)",
    focuses: ["organic"],
    release: "slow",
    soilTypes: [],
    crops: [],
    reason: "Improves soil biology and moisture retention while supplying mild, balanced nutrition.",
    application: "Incorporate into topsoil or use as mulch around the root zone.",
  },
  neemCake: {
    id: "neemCake",
    name: "Neem Cake",
    npk: "4-1-2 (approx)",
    focuses: ["organic", "nitrogen"],
    release: "slow",
    soilTypes: ["Sandy", "Loamy"],
    crops: ["Rice", "Vegetables"],
    reason: "Adds organic matter, slowly releases nitrogen, and suppresses soil pests.",
    application: "Blend with soil before planting or broadcast between rows and incorporate lightly.",
  },
};

const soilGuidance = {
  Loamy: "Loamy soils respond well to split applications; maintain moisture to prevent nutrient leaching.",
  Sandy: "Sandy soils drain quickly; prefer slow-release or split doses tied to irrigation.",
  Clay: "Clay holds nutrients but can waterlog; ensure proper drainage before heavy feeding.",
  Silty: "Silty fields are fertile but prone to crusting; incorporate fertilizers shallowly.",
  Peaty: "Peaty soils are acidic and rich in organic matter; supplement with calcium and controlled-release sources.",
  Chalky: "Chalky soils are alkaline; choose acidifying fertilizers and add organic matter to improve structure.",
  Laterite: "Lateritic soils tie up phosphorus; combine soluble P sources with organics for better uptake.",
};

const cropTargets = {
  Default: {
    nitrogen: [20, 35],
    phosphorus: [12, 25],
    potassium: [15, 30],
    guidance: "Maintain balanced nutrition and supply organic matter to sustain microbial life.",
  },
  Rice: {
    nitrogen: [25, 45],
    phosphorus: [15, 30],
    potassium: [20, 35],
    guidance: "Rice demands strong nitrogen splits across tillering and panicle initiation stages.",
  },
  Wheat: {
    nitrogen: [24, 40],
    phosphorus: [14, 28],
    potassium: [18, 32],
    guidance: "Protect tillering nitrogen and avoid late heavy doses that reduce grain protein.",
  },
  Maize: {
    nitrogen: [30, 50],
    phosphorus: [16, 30],
    potassium: [20, 35],
    guidance: "Split nitrogen between planting and knee-high; support with balanced base fertilizer.",
  },
  Cotton: {
    nitrogen: [24, 38],
    phosphorus: [14, 26],
    potassium: [25, 40],
    guidance: "Avoid heavy early nitrogen to prevent vegetative flush; potassium drives boll retention.",
  },
  Sugarcane: {
    nitrogen: [50, 80],
    phosphorus: [20, 35],
    potassium: [40, 60],
    guidance: "Use ratoon-friendly nitrogen sources and keep potassium up during grand growth stage.",
  },
  Potatoes: {
    nitrogen: [25, 40],
    phosphorus: [20, 35],
    potassium: [35, 55],
    guidance: "Prioritize potassium for tuber bulking; avoid chloride on quality-sensitive varieties.",
  },
  Tomatoes: {
    nitrogen: [20, 32],
    phosphorus: [18, 32],
    potassium: [35, 55],
    guidance: "Maintain steady potassium to manage fruit quality and disease tolerance.",
  },
  Soybean: {
    nitrogen: [18, 30],
    phosphorus: [20, 35],
    potassium: [20, 35],
    guidance: "Support nodulation with phosphorus and sulphur; avoid excessive nitrogen.",
  },
  Groundnut: {
    nitrogen: [18, 28],
    phosphorus: [22, 36],
    potassium: [22, 36],
    guidance: "Calcium and phosphorus at pegging are vital for pod fill; maintain moderate nitrogen.",
  },
  Tea: {
    nitrogen: [22, 36],
    phosphorus: [14, 24],
    potassium: [22, 32],
    guidance: "Tea prefers acidic media and frequent light nitrogen; supply sulphur with potassium.",
  },
  Coffee: {
    nitrogen: [24, 38],
    phosphorus: [16, 26],
    potassium: [28, 42],
    guidance: "Shade-grown coffee needs steady potassium alongside calcium for berry fill.",
  },
  Banana: {
    nitrogen: [35, 55],
    phosphorus: [18, 30],
    potassium: [50, 70],
    guidance: "Banana requires heavy potassium with supplemental calcium and magnesium through the cycle.",
  },
};

const classifyNutrient = (value, [min, max]) => {
  if (value === undefined || value === null) {
    return { level: "unknown", severity: "", range: [min, max], value };
  }
  const span = max - min;
  const buffer = Math.max(3, Math.round(span * 0.25));
  if (value < min) {
    const deficit = min - value;
    return {
      level: "low",
      severity: deficit > buffer ? "severe" : "moderate",
      range: [min, max],
      value,
    };
  }
  if (value > max) {
    const excess = value - max;
    return {
      level: "high",
      severity: excess > buffer ? "severe" : "moderate",
      range: [min, max],
      value,
    };
  }
  return { level: "adequate", severity: "", range: [min, max], value };
};

const addRecommendation = (list, fertilizer, customReason) => {
  if (!fertilizer) return;
  if (list.has(fertilizer.id)) {
    const existing = list.get(fertilizer.id);
    if (customReason && !existing.reason.includes(customReason)) {
      existing.reason += ` ${customReason}`;
    }
    return;
  }
  list.set(fertilizer.id, {
    name: fertilizer.name,
    npk: fertilizer.npk,
    reason: customReason ? `${fertilizer.reason} ${customReason}` : fertilizer.reason,
    application: fertilizer.application,
  });
};

const chooseFertilizers = ({ nutrient, status, soilType, crop, fertilizerPool }) => {
  const matches = Object.values(fertilizerPool)
    .filter((fert) => fert.focuses.includes(nutrient))
    .map((fert) => {
      let score = 1;
      if (!fert.soilTypes?.length || fert.soilTypes.includes(soilType)) score += 2;
      if (!fert.crops?.length || fert.crops.includes(crop)) score += 2;
      if (status.severity === "severe" && fert.release === "fast") score += 1;
      if (status.severity === "moderate" && fert.release === "slow") score += 1;
      return { fert, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  const rangeText = `${status.range[0]}-${status.range[1]}`;
  const severityText = status.severity ? `${status.severity} ` : "";
  const valueText = status.value === undefined ? "" : `Current reading ${status.value} vs target ${rangeText}.`;

  return matches.map(({ fert }) => ({
    fert,
    reason: `Detected ${severityText}${nutrient.toUpperCase()} deficiency. ${valueText}`.trim(),
  }));
};

export async function POST(request) {
  try {
    const payload = await request.json();
    const npk = payload?.npk;
    const soilType = payload?.soilType;
    const crop = payload?.crop;

    if (!npk || !soilType || !crop) {
      return NextResponse.json(
        { error: "Invalid data: NPK, soilType, and crop are required." },
        { status: 400 }
      );
    }

    const targets = cropTargets[crop] || cropTargets.Default;
    const nitrogenStatus = classifyNutrient(npk.nitrogen, targets.nitrogen);
    const phosphorusStatus = classifyNutrient(npk.phosphorus, targets.phosphorus);
    const potassiumStatus = classifyNutrient(npk.potassium, targets.potassium);

    const recommendations = new Map();

    if (nitrogenStatus.level === "low") {
      chooseFertilizers({
        nutrient: "nitrogen",
        status: nitrogenStatus,
        soilType,
        crop,
        fertilizerPool: fertilizerCatalog,
      }).forEach(({ fert, reason }) => addRecommendation(recommendations, fert, reason));
    }

    if (phosphorusStatus.level === "low") {
      chooseFertilizers({
        nutrient: "phosphorus",
        status: phosphorusStatus,
        soilType,
        crop,
        fertilizerPool: fertilizerCatalog,
      }).forEach(({ fert, reason }) => addRecommendation(recommendations, fert, reason));
    }

    if (potassiumStatus.level === "low") {
      chooseFertilizers({
        nutrient: "potassium",
        status: potassiumStatus,
        soilType,
        crop,
        fertilizerPool: fertilizerCatalog,
      }).forEach(({ fert, reason }) => addRecommendation(recommendations, fert, reason));
    }

    const multipleLow = [nitrogenStatus, phosphorusStatus, potassiumStatus].filter((s) => s.level === "low").length;

    if (multipleLow >= 2) {
      addRecommendation(
        recommendations,
        multipleLow === 3 ? fertilizerCatalog.npkBalance : fertilizerCatalog.dap,
        "Balanced NPK complex suggested because multiple nutrients are below the desired range."
      );
      if (multipleLow >= 2 && potassiumStatus.level === "low") {
        addRecommendation(
          recommendations,
          fertilizerCatalog.npkHighK,
          "Additional high K complex recommended to lift phosphorus and potassium together."
        );
      }
    }

    if (recommendations.size === 0) {
      addRecommendation(
        recommendations,
        fertilizerCatalog.vermicompost,
        "Current NPK levels are within the target range; use organic amendments to maintain soil health."
      );
    }

    addRecommendation(
      recommendations,
      fertilizerCatalog.vermicompost,
      "Organic matter improves nutrient use efficiency and moisture retention."
    );

    if (soilType === "Sandy" || soilType === "Loamy") {
      addRecommendation(
        recommendations,
        fertilizerCatalog.neemCake,
        "Slow release nitrogen source aligns with quick-draining soils and supports microbial activity."
      );
    }

    const cautionNotes = [];
    if (nitrogenStatus.level === "high") {
      cautionNotes.push(
        `Nitrogen is above the target window (${nitrogenStatus.value} vs ${nitrogenStatus.range.join("-")}). Delay high-N fertilizers until readings fall.`
      );
    }
    if (phosphorusStatus.level === "high") {
      cautionNotes.push(
        `Phosphorus is elevated (${phosphorusStatus.value} vs ${phosphorusStatus.range.join("-")}). Switch to low-P sources to avoid lock-up.`
      );
    }
    if (potassiumStatus.level === "high") {
      cautionNotes.push(
        `Potassium exceeds the recommended window (${potassiumStatus.value} vs ${potassiumStatus.range.join("-")}). Hold potassic fertilizers temporarily.`
      );
    }

    const notesSegments = [soilGuidance[soilType], targets.guidance, ...cautionNotes].filter(Boolean);

    return NextResponse.json({
      fertilizers: Array.from(recommendations.values()),
      notes: notesSegments.join(" ") || "Monitor soil tests regularly to fine-tune nutrient scheduling.",
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}