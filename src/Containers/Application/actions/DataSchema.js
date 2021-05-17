class UserSchema {
    constructor({
        email,
        displayName,
    }) {
        this.email = email;
        this.classes = [];
        this.displayName = displayName;
    }
    getUserData = () => {
        return {
            email: this.email,
            myclass: this.classes,
            displayName: this.displayName,
        };
    }
    createNewUser = () => {
        return {
            email: this.email,
            myclass: this.classes,
            displayName: this.displayName,
        };
    }
};

export const Schema = {
    UserSchema,
}