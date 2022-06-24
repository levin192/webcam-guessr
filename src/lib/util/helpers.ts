interface Coordinates {
    lat: number;
    lon: number;
}


const randomEntry = (entries: string[]) => {
    return entries[Math.floor(Math.random() * entries.length)]
}

async function fetchApiContent(obj: any, resultProp: string): Promise<string[]> {
    return obj.fetchApiContent().then((data: any) => {
        return data.result[resultProp];
    });
}

// https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
const getDistanceInKm = (coordinatesOne: Coordinates, coordinatesTwo: Coordinates) => {
    const lat1 = coordinatesOne.lat
    const lat2 = coordinatesTwo.lat
    const lon1 = coordinatesOne.lon
    const lon2 = coordinatesTwo.lon
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return Math.floor(distance)
}

const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180)
}
const valuesToArray = (inputObject: object) => {
    return (Object.keys(inputObject) as (keyof typeof inputObject)[])
        .map((key: string) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return inputObject[key];
        });
}

export {randomEntry, getDistanceInKm, valuesToArray, fetchApiContent}