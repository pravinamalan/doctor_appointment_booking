export const formatDateTime = (dateString, timeString) => {
    const date = new Date(dateString); // Convert to Date object

    const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    let [hours, minutes] = timeString.split(':');
    let period = 'AM';

    if (hours >= 12) {
        period = 'PM';
        if (hours > 12) hours -= 12;
    } else if (hours === '00') {
        hours = 12;
    }

    const formattedTime = `${hours}:${minutes} ${period}`;

    return `${formattedDate} | ${formattedTime}`;
};

export function formatDate(slotDate) {
    const date = new Date(slotDate);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);
    return formattedDate;
}

export function formatAge(dob) {
    if (!dob) return "Null";
    const age = Math.floor((new Date() - new Date(dob).getTime()) / 3.15576e10);
    return age;
}
