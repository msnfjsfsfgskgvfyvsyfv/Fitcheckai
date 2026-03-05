const STORAGE_KEY = 'fitcheck_daily';
const FREE_LIMIT = 2;

function getToday() {
  return new Date().toISOString().split('T')[0];
}

export function getUsageToday() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (data.date !== getToday()) return 0;
    return data.count || 0;
  } catch {
    return 0;
  }
}

export function incrementUsage() {
  const today = getToday();
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  if (data.date !== today) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: 1 }));
    return 1;
  }
  data.count = (data.count || 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data.count;
}

export function hasReachedLimit() {
  return getUsageToday() >= FREE_LIMIT;
}

export function getRemainingChecks() {
  return Math.max(0, FREE_LIMIT - getUsageToday());
}
