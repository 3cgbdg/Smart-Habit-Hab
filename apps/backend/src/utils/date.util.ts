export const DateUtils = {
  getTodayDateString: () => {
    return new Date().toISOString().split('T')[0];
  },
  getSevenDaysAgoDateString: () => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    return sevenDaysAgo.toISOString().split('T')[0];
  },
  getFirstDayOfMonthDateString: () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split('T')[0];
    return firstDayOfMonth;
  },
  getLastDayOfMonthDateString: () => {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0];
    return lastDayOfMonth;
  },
};
