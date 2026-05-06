
/**
 * Formats a date string into a localized format with the timezone name/abbreviation.
 */
export function formatLocalTime(dateStr: string) {
    if (!dateStr) return "TBD";
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) return "Invalid Date";

    try {
        // Format: "Month Day, Year, Hour:Min AM/PM Timezone"
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZoneName: 'short'
        }).format(date);
    } catch (e) {
        // Fallback for environments where Intl styles might fail
        return date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });
    }
}

/**
 * Returns a relative time string (e.g., "Starting in 2 hours")
 */
export function getRelativeTime(dateStr: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) return "";

    const now = new Date();
    const diffMs = date.getTime() - now.getTime();

    if (diffMs < 0) {
        // Simple past check
        const absoluteMs = Math.abs(diffMs);
        if (absoluteMs < 60000) return "Started just now";
        const mins = Math.floor(absoluteMs / 60000);
        if (mins < 60) return `Started ${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `Started ${hours}h ago`;
        return "Started in the past";
    }

    const diffMins = Math.ceil(diffMs / 60000);
    if (diffMins < 60) return `Starting in ${diffMins}m`;

    const diffHours = Math.ceil(diffMs / (60000 * 60));
    if (diffHours < 24) return `Starting in ${diffHours}h`;

    const diffDays = Math.ceil(diffMs / (60000 * 60 * 24));
    return `Starting in ${diffDays}d`;
}
