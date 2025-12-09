export function isWeekend(date) {
    if (date.format('dddd') === 'Saturday') {
        return date.add(2, 'days');
    } else if (date.format('dddd') === "Sunday") {
        return date.add(1, 'days');
    }
    return date;
}

export default isWeekend;
