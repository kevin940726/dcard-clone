import { useMemo } from 'react';

export default function ReadableDateTime({ dateTime, ...props }) {
  const createdDate = useMemo(() => new Date(dateTime), [dateTime]);

  const readableDateTime = useMemo(() => {
    const dateString = `${
      createdDate.getMonth() + 1
    }月${createdDate.getDate()}日 ${String(createdDate.getHours()).padStart(
      2,
      '0'
    )}:${String(createdDate.getMinutes()).padStart(2, '0')}`;

    if (createdDate.getFullYear() === new Date().getFullYear()) {
      return dateString;
    }

    return `${createdDate.getFullYear()}年${dateString}`;
  }, [createdDate]);

  return (
    <time
      dateTime={createdDate.toISOString()}
      title={createdDate.toLocaleString()}
      {...props}
    >
      {readableDateTime}
    </time>
  );
}
