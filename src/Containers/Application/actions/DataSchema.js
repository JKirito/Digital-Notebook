class UserSchema {
    constructor({
        email,
    }) {
        this.email = email;
        this.classes = [];
    }
    getUserData = () => {
        return {
            email: this.email,
            myclass: this.classes,
        };
    }
    createNewUser = () => {
        return {
            email: this.email,
            myclass: this.classes,
        };
    }
};

export const Schema = {
    UserSchema,
}