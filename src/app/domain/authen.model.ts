import { User } from './user.model';
import { Whoops } from './whoops.model';

export interface Authen {
    user?: User;
    token?: string;
    err?: Whoops;
}
