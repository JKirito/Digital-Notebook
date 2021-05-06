class UserSchema {
    constructor({
        email,
    }) {
        this.email = email;
    }
    getUserData = () => {
        return {
            email: this.email,
        };
    }
    createNewUser = () => {
        return {
            email: this.email,
        };
    }
};

export const Schema = {
    UserSchema,
}