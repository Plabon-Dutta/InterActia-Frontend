export class quick_contact  {
    full_name?: string;
    email?: string;
    phone?: string;
    reason?: string;
    message?: string;

    constructor(data?: Partial <quick_contact>) {
        this.full_name = data?.full_name;
        this.email = data?.email;
        this.phone = data?.phone;
        this.reason = data?.reason;
        this.message = data?.message;
    }
}