export class sign_in  {
    email?: string;
    password?: string;
    rememberMe?: boolean;

    constructor(data?: Partial <sign_in>) {
        this.email = data?.email;
        this.password = data?.password;
        this.rememberMe = data?.rememberMe;
    }
}