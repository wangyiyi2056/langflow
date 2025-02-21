import { useTranslation } from "react-i18next";

export const timeElapsed = (dateTimeString: string | undefined): string => {
  const { t } = useTranslation();
  if (!dateTimeString) {
    return "";
  }

  const givenDate = new Date(dateTimeString);
  const now = new Date();

  let diffInMs = Math.abs(now.getTime() - givenDate.getTime());

  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30); // Approximate
  const years = Math.floor(months / 12);

  if (years > 0) {
    return years === 1 ? `${years} ${t("mainPage.time.YEAR")}` : `${years} ${t("mainPage.time.YEARS")}`;
  } else if (months > 0) {
    return months === 1 ? `${months} ${t("mainPage.time.MONTH")}` : `${months} ${t("mainPage.time.MONTHS")}`;
  } else if (days > 0) {
    return days === 1 ? `${days} ${t("mainPage.time.DAY")}` : `${days} ${t("mainPage.time.DAYS")}`;
  } else if (hours > 0) {
    return hours === 1 ? `${hours} ${t("mainPage.time.HOUR")}` : `${hours} ${t("mainPage.time.HOURS")}`;
  } else if (minutes > 0) {
    return minutes === 1 ? `${minutes} ${t("mainPage.time.MINUTE")}` : `${minutes} ${t("mainPage.time.MINUTES")}`;
  } else {
    return `${t("mainPage.time.LESS_THAN_A_MINUTE")}`;
  }
};
