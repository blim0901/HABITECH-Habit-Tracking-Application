import {DateTime} from "luxon";

export default function valuesToPercentage(target, current) {

    return Math.floor(100 * (current / target));
}

export function today() {
    return DateTime.local().toSQLDate();
}