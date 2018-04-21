import { GB2260 } from './identity.data';

export const extractInfoFromIdentity = (number: string) => {
    return {
        addrCode: number.substring(0, 6),
        birthday: number.substring(6, 14)
    };
};

export const isValidAddr = (addr: string) => {
    return GB2260[addr] !== undefined;
};

export const getAddrByCode = (code: string) => {
    const province = GB2260[code.substring(0, 2) + '0000'];
    const city = GB2260[code.substring(0, 4) + '00'].replace(province, '');
    const district = GB2260[code].replace(province + city, '');
    return {province, city, district};
};


