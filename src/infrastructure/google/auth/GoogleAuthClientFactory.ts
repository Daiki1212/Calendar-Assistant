import {JWT} from "google-auth-library";

export class GoogleAuthClientFactory {
    public constructor(
        private readonly email: string,
        private readonly privateKey: string,
    ) {}

    public create(): JWT {
        return new JWT({
            email: this.email,
            key: this.privateKey,
            scopes: ['https://www.googleapis.com/auth/calendar.events'],
        });
    }
}