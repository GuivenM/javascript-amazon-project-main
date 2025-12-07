export function isWeekend(date) {
    if (date.format('dddd') === 'Saturday' || date.format('dddd') === "Sunday") {
        return "Today is a weekend!!!";
    }
    return "Work day😮‍💨"
}

export default isWeekend;