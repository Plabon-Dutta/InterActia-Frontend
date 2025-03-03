export class sign_up  {
    name?: string;
    email?: string;
    password?: string;
    confirm_password?: string;
    termsAccepted?: boolean;

    constructor(data?: Partial <sign_up>) {
        this.name = data?.name;
        this.email = data?.email;
        this.password = data?.password;
        this.confirm_password = data?.confirm_password;
        this.termsAccepted = data?.termsAccepted;
    }
}