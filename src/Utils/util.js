import dayjs from "dayjs";

// export function getMonth(month = dayjs().month()) {
//     month = Math.floor(month);
//     const year = dayjs().year();
//     const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
//     let currentMonthCount = 0 - firstDayOfTheMonth;
//     const daysMatrix = new Array(5).fill([]).map(() => {
//         return new Array(7).fill(null).map(() => {
//             currentMonthCount++;
//             return dayjs(new Date(year, month, currentMonthCount));
//         });
//     });
//     return daysMatrix;
// }


export function getMonth(month = dayjs().month()) {
    month = Math.floor(month);
    const year = dayjs().year();
    let firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
    let currentMonthCount = 0 - firstDayOfTheMonth;
    let daysInMonth = dayjs(new Date(year, month + 1, 0)).date();

    let weeksNeeded = Math.ceil((daysInMonth + firstDayOfTheMonth) / 7);
    const daysMatrix = new Array(weeksNeeded).fill([]).map(() => {
        return new Array(7).fill(null).map(() => {
            currentMonthCount++;
            return dayjs(new Date(year, month, currentMonthCount));
        });
    });
    return daysMatrix;
}
