import { city_data } from './area.data';

export const getProvinces = () => {
    const provinces = [];
    for (const province in city_data) {
        if (city_data.hasOwnProperty(province)) {
            provinces.push(province);
        }
    }
    return provinces;
};

export const getCitiesByProvince = (province: string) => {
    if (!province || !city_data[province]) {
        return [];
    } else {
        const cities = [];
        const values = city_data[province];
        for (const city in values) {
            if (values.hasOwnProperty(city)) {
                cities.push(city);
            }
        }
        return cities;
    }
};

export const getDiscritsByCity = (province: string, city: string) => {
    if (!province || !city_data[province] || !city_data[province][city]) {
        return [];
    } else {
        return city_data[province][city];
    }
};
