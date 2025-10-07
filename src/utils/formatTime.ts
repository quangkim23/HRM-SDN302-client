export function formatTime(dateString: any) {
  const date = new Date(dateString);

  // Lấy ngày, tháng, năm
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;

  return ` ${hours}:${minutes} ${ampm} ${day}/${month}/${year}`;
}
