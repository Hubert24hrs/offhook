// OFFHOOK — Mock AI Engine
// Generates realistic excuse responses for development without API keys

import { ExcuseContext, ExcuseResponse } from './prompt_builder';

const MOCK_EXCUSES: Record<string, ExcuseResponse[]> = {
    traffic: [
        {
            excuse_text: "There's been a major accident on the highway — traffic is completely backed up for miles. I've been sitting here for over 40 minutes and it doesn't look like it's clearing anytime soon. I'm so sorry, I'll be there as soon as I can.",
            delivery_tip: "Send via text immediately. Sound frustrated but calm. Add a photo of traffic if possible.",
            best_send_time: "Right now — the earlier you communicate, the more believable it is",
            risk_score: 18,
            risk_reason: "Traffic incidents are common and difficult to verify. Very safe excuse.",
            supporting_context: "Traffic congestion is reported during this time in your area",
            follow_up_suggestion: "Just started moving again — ETA about 20 minutes. Thanks for understanding 🙏",
            category_used: "traffic",
            cultural_tags: ["urban", "commuter", "relatable"],
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            excuse_text: "I'm stuck behind a road closure — they're doing emergency utility work and diverted everyone. I had no idea until I was already on the route. GPS is showing a 35-minute detour. I'll keep you updated.",
            delivery_tip: "Call instead of text for higher impact. Let your voice sound slightly annoyed at the situation.",
            best_send_time: "Send within next 5 minutes",
            risk_score: 22,
            risk_reason: "Road closures happen but can sometimes be verified online",
            supporting_context: "Utility work is common in urban areas during weekdays",
            follow_up_suggestion: "Finally got through — what a nightmare. On my way now!",
            category_used: "traffic",
            cultural_tags: ["urban", "infrastructure", "genuine frustration"],
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ],
    health: [
        {
            excuse_text: "I woke up with a terrible migraine and I can barely keep my eyes open. I've taken some painkillers but I think I need to rest for a few hours. I'm really sorry about this.",
            delivery_tip: "Send a short voice note — speak slowly and softly to sell the migraine. Don't overexplain.",
            best_send_time: "Morning, before expected meeting/event time",
            risk_score: 15,
            risk_reason: "Health issues are personal and rarely questioned. Very safe.",
            supporting_context: "Weather changes can trigger migraines — consistent with current conditions",
            follow_up_suggestion: "Feeling a bit better now. The meds are kicking in. I'll check in later.",
            category_used: "health",
            cultural_tags: ["universal", "empathy-inducing", "unverifiable"],
            expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ],
    family: [
        {
            excuse_text: "My mom just called — there's a situation at home she needs help with urgently. I need to head over there right now. I'll explain more later but it's a family thing I can't skip.",
            delivery_tip: "Keep it vague. Family emergencies don't need details. Sound slightly worried but in control.",
            best_send_time: "Immediately",
            risk_score: 12,
            risk_reason: "Family emergencies are universally respected and rarely probed for details.",
            supporting_context: "Family obligations are the most universally accepted excuse type",
            follow_up_suggestion: "Everything's sorted now. False alarm mostly but had to be there. Thanks for understanding.",
            category_used: "family",
            cultural_tags: ["family-first", "respectful", "universal"],
            expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ],
    weather: [
        {
            excuse_text: "It's absolutely pouring here and the streets are flooding. I can't safely drive in this — there's standing water everywhere and I've already seen two cars stuck. I'll head out as soon as it eases up.",
            delivery_tip: "Send with a window/windshield photo showing rain. Let the weather do the convincing.",
            best_send_time: "Right now while it's still raining",
            risk_score: 10,
            risk_reason: "Weather is instantly verifiable AND works in your favor — they can check and confirm it's raining.",
            supporting_context: "Current weather conditions support this excuse",
            follow_up_suggestion: "Rain is letting up a bit. Going to try heading out now. 🌧️",
            category_used: "weather",
            cultural_tags: ["safety-first", "verifiable", "high-credibility"],
            expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ],
    tech_failure: [
        {
            excuse_text: "My laptop just crashed and won't turn back on — I think the battery died or it overheated. I'm trying to recover it but I might need to take it in. Can we reschedule?",
            delivery_tip: "Send from your phone (not the device that supposedly crashed). Sound stressed but practical.",
            best_send_time: "Within 10 minutes of missed commitment",
            risk_score: 25,
            risk_reason: "Tech failures are common but the person might expect you to find alternatives quickly.",
            supporting_context: "Tech device failures increase during warm weather periods",
            follow_up_suggestion: "Got it working again after a hard reset. Lost some work but back online now.",
            category_used: "tech_failure",
            cultural_tags: ["modern", "professional", "relatable"],
            expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ],
    power_outage: [
        {
            excuse_text: "Power just went out in my area — the whole block is dark. No ETA from the power company yet. I can't charge my devices and I'm conserving battery. I'll update you when it's back.",
            delivery_tip: "Short message. Don't be too chatty — you're supposedly conserving battery.",
            best_send_time: "Immediately",
            risk_score: 20,
            risk_reason: "Power outages are area-wide and verifiable, but work in your favor if real.",
            supporting_context: "Power interruptions are common during peak usage hours",
            follow_up_suggestion: "Power's back! Was out for about 2 hours. What did I miss?",
            category_used: "power_outage",
            cultural_tags: ["infrastructure", "believable", "low-risk"],
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ],
    work_conflict: [
        {
            excuse_text: "My manager just dropped an urgent deadline on me — we have a critical client presentation tomorrow and I need to get this done tonight. I'm really sorry, I had no idea this was coming.",
            delivery_tip: "Sound genuinely apologetic. Mention you'll make it up to them. Keep the work details vague.",
            best_send_time: "Late afternoon or early evening for maximum believability",
            risk_score: 20,
            risk_reason: "Work obligations are widely understood. Slightly higher risk if the person knows your work schedule.",
            supporting_context: "End-of-week and end-of-quarter work surges are common",
            follow_up_suggestion: "Finally done. That was intense. Let's definitely reschedule — I owe you one!",
            category_used: "work_conflict",
            cultural_tags: ["professional", "workaholic", "empathy-inducing"],
            expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ],
    errand: [
        {
            excuse_text: "I got caught up handling something for my landlord — there's a plumbing issue in my apartment and I had to wait for the repair guy. It took way longer than expected.",
            delivery_tip: "Sound like it's already resolved or resolving. Don't make it sound ongoing unless you need more time.",
            best_send_time: "Daytime, preferably before noon",
            risk_score: 28,
            risk_reason: "Home maintenance is believable but might raise questions about timing.",
            supporting_context: "Home repairs and maintenance are common unexpected disruptions",
            follow_up_suggestion: "All fixed now! What a hassle. I'm free for the rest of the day.",
            category_used: "errand",
            cultural_tags: ["domestic", "adult-life", "relatable"],
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ],
    emergency: [
        {
            excuse_text: "Something urgent just came up — I can't go into details right now but I need to handle it immediately. I'll call you as soon as I can. Please understand.",
            delivery_tip: "Be brief and serious. The vagueness IS the excuse. Don't elaborate even if pressed initially.",
            best_send_time: "Send immediately — urgency justifies any time",
            risk_score: 35,
            risk_reason: "Vague emergencies work once but create expectation for explanation later.",
            supporting_context: "Emergency situations require immediate attention — brevity is expected",
            follow_up_suggestion: "Hey, everything is okay now. It was a bit of a scare but sorted. Sorry for being cryptic earlier.",
            category_used: "emergency",
            cultural_tags: ["serious", "one-time-use", "high-impact"],
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ],
    schedule_clash: [
        {
            excuse_text: "I just realized I double-booked myself — I completely forgot I had a dentist appointment at the same time. It's been on my calendar for weeks and I can't reschedule it again. Can we move to tomorrow?",
            delivery_tip: "Sound genuinely embarrassed about the double-booking. Propose an alternative time immediately.",
            best_send_time: "At least 1-2 hours before the commitment",
            risk_score: 22,
            risk_reason: "Schedule conflicts are common and relatable. Safe if you don't overuse with the same person.",
            supporting_context: "Calendar management issues affect most adults regularly",
            follow_up_suggestion: "Dentist done ✅ Tomorrow works great for me — same time?",
            category_used: "schedule_clash",
            cultural_tags: ["professional", "organized-chaos", "relatable"],
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ],
};

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export async function generateMockExcuse(context: ExcuseContext): Promise<ExcuseResponse> {
    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    const categoryExcuses = MOCK_EXCUSES[context.category] || MOCK_EXCUSES.traffic;
    let excuse = getRandomItem(categoryExcuses!);

    // Personalize with contact name
    excuse = {
        ...excuse,
        excuse_text: excuse.excuse_text,
        delivery_tip: excuse.delivery_tip.replace(
            /the person/gi,
            context.contactName
        ),
    };

    // Adjust risk based on context
    let riskAdjustment = 0;
    if (context.urgency === 'emergency') riskAdjustment -= 5;
    if (context.urgency === 'low') riskAdjustment += 10;
    if (context.relationship === 'boss' || context.relationship === 'partner') riskAdjustment += 8;

    excuse.risk_score = Math.max(1, Math.min(100, excuse.risk_score + riskAdjustment));

    return excuse;
}
