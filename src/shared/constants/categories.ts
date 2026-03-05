// OFFHOOK — Excuse Categories & Buckets
export interface ExcuseCategory {
    id: string;
    label: string;
    icon: string;
    description: string;
}

export const EXCUSE_CATEGORIES: ExcuseCategory[] = [
    { id: 'traffic', label: 'Traffic', icon: '🚗', description: 'Road & commute excuses' },
    { id: 'health', label: 'Health', icon: '🏥', description: 'Medical & health issues' },
    { id: 'family', label: 'Family', icon: '👨‍👩‍👧', description: 'Family emergencies & events' },
    { id: 'weather', label: 'Weather', icon: '🌧️', description: 'Weather-related disruptions' },
    { id: 'tech_failure', label: 'Tech Issue', icon: '💻', description: 'Device & connectivity failures' },
    { id: 'work_conflict', label: 'Work', icon: '💼', description: 'Professional conflicts & meetings' },
    { id: 'power_outage', label: 'Power', icon: '⚡', description: 'Electricity & power failures' },
    { id: 'errand', label: 'Errand', icon: '🏃', description: 'Urgent tasks & errands' },
    { id: 'emergency', label: 'Emergency', icon: '🚨', description: 'Urgent unexpected events' },
    { id: 'schedule_clash', label: 'Schedule', icon: '📅', description: 'Calendar conflicts & clashes' },
];

export const TONES = [
    { id: 'professional', label: 'Professional', icon: '👔' },
    { id: 'casual', label: 'Casual', icon: '😎' },
    { id: 'dramatic', label: 'Dramatic', icon: '🎭' },
    { id: 'funny', label: 'Funny', icon: '😂' },
    { id: 'sympathetic', label: 'Sympathetic', icon: '😔' },
] as const;

export const SITUATION_TYPES = [
    { id: 'work', label: 'Work', icon: '💼' },
    { id: 'family', label: 'Family', icon: '🏠' },
    { id: 'social', label: 'Social', icon: '🎉' },
    { id: 'romantic', label: 'Romantic', icon: '💕' },
    { id: 'academic', label: 'Academic', icon: '📚' },
] as const;

export const URGENCY_LEVELS = [
    { id: 'low', label: 'Low', color: '#00F5C4' },
    { id: 'medium', label: 'Medium', color: '#FFD93D' },
    { id: 'high', label: 'High', color: '#FF8C42' },
    { id: 'emergency', label: 'Emergency', color: '#FF6B6B' },
] as const;

export const RELATIONSHIP_TYPES = [
    { id: 'boss', label: 'Boss', icon: '👨‍💼' },
    { id: 'colleague', label: 'Colleague', icon: '🤝' },
    { id: 'partner', label: 'Partner', icon: '💑' },
    { id: 'parent', label: 'Parent', icon: '👨‍👧' },
    { id: 'friend', label: 'Friend', icon: '✌️' },
    { id: 'teacher', label: 'Teacher', icon: '👩‍🏫' },
    { id: 'client', label: 'Client', icon: '🤵' },
    { id: 'other', label: 'Other', icon: '👤' },
] as const;

export const SENSITIVITY_LEVELS = [
    { id: 'relaxed', label: 'Relaxed', description: 'Easy-going, rarely questions excuses' },
    { id: 'moderate', label: 'Moderate', description: 'Occasionally skeptical' },
    { id: 'strict', label: 'Strict', description: 'Very observant, hard to fool' },
] as const;
