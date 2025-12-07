
import dayJs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {isWeekend as isSatSun} from './day.js';

const today = dayJs();

const dayFive = today.add(5, 'days');
const dayFiveString = dayFive.format('MMMM D');
console.log(dayFiveString);

const oneMonthAfter = today.add(1, 'months');
const oneMonthAfterString = oneMonthAfter.format('MMMM D');
console.log(oneMonthAfterString);

const oneMonthBefore = today.subtract(1, 'months');
const oneMonthBeforeString = oneMonthBefore.format('MMMM D')
console.log(oneMonthBeforeString);

console.log(today.format('dddd'));

console.log(isSatSun(today));
console.log(isSatSun(dayFive));
console.log(isSatSun(oneMonthAfter));
console.log(isSatSun(oneMonthBefore));