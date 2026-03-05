// OFFHOOK — Risk Scorer
// Calculates risk score based on multiple real-world factors

interface RiskFactors {
    category: string;
    contactRelationship: string;
    timesUsedWithContact: number;
    timesUsedCategory: number;
    daysSinceLastExcuseWithContact: number;
    urgency: string;
    isVerifiable: boolean;
}

const CATEGORY_BASE_RISK: Record<string, number> = {
    traffic: 15,
    health: 12,
    family: 10,
    weather: 8,
    tech_failure: 22,
    work_conflict: 18,
    power_outage: 16,
    errand: 25,
    emergency: 30,
    schedule_clash: 20,
};

const RELATIONSHIP_MULTIPLIER: Record<string, number> = {
    boss: 1.4,
    partner: 1.5,
    parent: 1.3,
    colleague: 1.1,
    friend: 0.8,
    teacher: 1.2,
    client: 1.3,
    other: 1.0,
};

export function calculateRiskScore(factors: RiskFactors): {
    score: number;
    reason: string;
    breakdown: { factor: string; impact: number }[];
} {
    const breakdown: { factor: string; impact: number }[] = [];
    let score = CATEGORY_BASE_RISK[factors.category] || 20;
    breakdown.push({ factor: 'Base category risk', impact: score });

    // Relationship multiplier
    const relMultiplier = RELATIONSHIP_MULTIPLIER[factors.contactRelationship] || 1.0;
    const relImpact = Math.round(score * (relMultiplier - 1));
    score = Math.round(score * relMultiplier);
    if (relImpact !== 0) {
        breakdown.push({ factor: `${factors.contactRelationship} relationship`, impact: relImpact });
    }

    // Repetition penalty
    if (factors.timesUsedWithContact > 0) {
        const repPenalty = factors.timesUsedWithContact * 8;
        score += repPenalty;
        breakdown.push({ factor: `Used ${factors.timesUsedWithContact}x with this contact`, impact: repPenalty });
    }

    // Category overuse
    if (factors.timesUsedCategory > 3) {
        const catPenalty = (factors.timesUsedCategory - 3) * 5;
        score += catPenalty;
        breakdown.push({ factor: 'Category overused recently', impact: catPenalty });
    }

    // Recency penalty
    if (factors.daysSinceLastExcuseWithContact < 3) {
        const recencyPenalty = 15;
        score += recencyPenalty;
        breakdown.push({ factor: 'Recent excuse to same contact', impact: recencyPenalty });
    } else if (factors.daysSinceLastExcuseWithContact < 7) {
        const recencyPenalty = 8;
        score += recencyPenalty;
        breakdown.push({ factor: 'Excuse within last week to same contact', impact: recencyPenalty });
    }

    // Urgency modifier
    if (factors.urgency === 'emergency') {
        score -= 5;
        breakdown.push({ factor: 'Emergency urgency (forgiven more)', impact: -5 });
    } else if (factors.urgency === 'low') {
        score += 5;
        breakdown.push({ factor: 'Low urgency (more scrutiny)', impact: 5 });
    }

    // Clamp
    score = Math.max(1, Math.min(100, score));

    // Generate reason
    let reason = '';
    if (score <= 25) reason = 'This excuse is very safe. Low chance of suspicion.';
    else if (score <= 50) reason = 'Moderate risk. Should work but be mindful of delivery.';
    else if (score <= 75) reason = 'High risk. The contact may be skeptical. Consider alternatives.';
    else reason = 'Dangerous! High chance of being caught. Strongly recommend a different excuse.';

    return { score, reason, breakdown };
}
