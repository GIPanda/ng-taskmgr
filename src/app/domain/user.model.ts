export enum IdentityType {
    IdCard = 0,
    Insurance,
    Passport,
    Military,
    Other
}

export interface Identity {
    number: string;
    type: IdentityType;
}

export interface Address {
    province: string;
    city: string;
    district: string;
    street?: string;
}

export interface User {
    id?: string;
    email: string;
    password: string;
    name: string;
    avatar?: string;
    projectIds?: string[];
    address?: Address;
    Identity?: Identity;
    birthday?: string;
}
