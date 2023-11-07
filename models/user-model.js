const bcrypt = require('bcryptjs');
const db = require('../data/database');
const mongodb = require('mongodb');

class User {
    constructor(email, password, fullname, street, postal, city) {
        this.email = email;
        this.password = password;
        this.name = fullname;
        this.address = {
            street: street,
            postal: postal,
            city: city
        };
    }

    static findUserById(userId) {
        const uid = new mongodb.ObjectId(userId);

        return db.getDb().collection('users').findOne({_id: uid}, { projection: { password: 0 } })
    }

    getUserWithSameEmail() {
        return db.getDb().collection('users').findOne({ email: this.email });
    }

    async isUserExistAlready() {
        const existingUser = await this.getUserWithSameEmail();
        if (existingUser) return true;
    }

    isPasswordsMatch(hashedPassword) {
        return bcrypt.compare(this.password, hashedPassword);
    }

    async signup() {
        await db.getDb().collection('users').insertOne({
            email: this.email,
            password: await bcrypt.hash(this.password, 12),
            name: this.name,
            address: this.address
        });
    }
}

module.exports = User;