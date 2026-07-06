import { format, formatDistance, sub } from "date-fns";
import { enUS } from "date-fns/locale";

export const useDate = () => {
  const locale = enUS;

  const getFullDate = ({
    date,
    includeTime = false,
  }: {
    date: string | Date;
    includeTime?: boolean;
  }) => {
    const ensuredDate = new Date(date);

    if (isNaN(ensuredDate.getTime())) {
      return "";
    }

    const timeFormat = includeTime ? "p" : "";

    return format(ensuredDate, `PP ${timeFormat}`, {
      locale,
    });
  };

  function getRelativeDate(date: string | Date): string {
    const now = new Date();

    return formatDistance(sub(new Date(date), { minutes: 0 }), now, {
      addSuffix: true,
      locale,
    });
  }

  return {
    getFullDate,
    getRelativeDate,
  };
};
