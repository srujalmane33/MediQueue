/**
 * MediQueue AI Service Wrapper
 * Provides modular prediction hooks for queue times, crowd analysis,
 * and automated symptom-to-specialization mapping.
 */

// Heuristic-based wait time estimator (15 mins per patient)
// Can be replaced with a ML regression model later
export const estimateWaitingTime = (peopleAhead) => {
  const baseMinutes = 15;
  const variance = Math.floor(Math.random() * 5) - 2; // -2 to +2 mins variance
  return Math.max(5, peopleAhead * baseMinutes + variance);
};

// Predict crowd density based on day of week and hour of day
// Can be linked to historic occupancy dataset later
export const predictCrowdLevel = (dayOfWeek, hourOfDay) => {
  // Peak hospital hours: 9 AM - 12 PM, 4 PM - 6 PM
  // Peak days: Monday (1), Tuesday (2)
  const isPeakHour = (hourOfDay >= 9 && hourOfDay <= 12) || (hourOfDay >= 16 && hourOfDay <= 18);
  const isPeakDay = dayOfWeek === 1 || dayOfWeek === 2;

  if (isPeakHour && isPeakDay) {
    return { level: "Critical", score: 92, status: "Expect delays of up to 45 mins" };
  } else if (isPeakHour || isPeakDay) {
    return { level: "High", score: 75, status: "Moderately busy" };
  } else if (hourOfDay >= 20 || hourOfDay <= 7) {
    return { level: "Low", score: 18, status: "Quick consultations" };
  } else {
    return { level: "Medium", score: 45, status: "Normal queue speeds" };
  }
};

// Simple keyword-based symptom scanner to recommend doctor specialities
// Can be updated with NLP/GPT models later
export const analyzeSymptoms = (symptomsText = "") => {
  const text = symptomsText.toLowerCase();
  
  if (text.includes("heart") || text.includes("chest") || text.includes("cardiac") || text.includes("bp")) {
    return { specialty: "Cardiologist", confidence: 0.9 };
  }
  if (text.includes("child") || text.includes("kid") || text.includes("baby") || text.includes("pediatric")) {
    return { specialty: "Pediatrician", confidence: 0.95 };
  }
  if (text.includes("skin") || text.includes("rash") || text.includes("acne") || text.includes("itch")) {
    return { specialty: "Dermatologist", confidence: 0.88 };
  }
  if (text.includes("bone") || text.includes("fracture") || text.includes("joint") || text.includes("muscle") || text.includes("backpain")) {
    return { specialty: "Orthopedist", confidence: 0.85 };
  }
  if (text.includes("brain") || text.includes("nerve") || text.includes("headache") || text.includes("seizure")) {
    return { specialty: "Neurologist", confidence: 0.82 };
  }
  
  return { specialty: "General Physician", confidence: 0.5 };
};

// Filter and sort doctor profiles based on symptom analysis and rating
export const recommendDoctors = (symptomsText, doctorList = []) => {
  const analysis = analyzeSymptoms(symptomsText);
  
  return doctorList
    .map((doc) => {
      let score = doc.rating || 4.5;
      
      // Match specialty
      if (doc.specialization.toLowerCase() === analysis.specialty.toLowerCase()) {
        score += 5.0; // Boost matching specialties
      }
      
      return { doctor: doc, matchScore: score, recommended: score > 7.0 };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
};
