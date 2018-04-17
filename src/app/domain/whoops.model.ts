export interface Whoops {
    timestamp?: Date;
    status?: string;
    error?: string;
    exception?: string;
    message?: string;
    path?: string;
}
