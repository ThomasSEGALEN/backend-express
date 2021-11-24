const e = require("express");

module.exports = async function (api) {
    const bdd = await require("./mysql");
    const CityControler = await require("./city")(api);

    class UserControler {
        async list() {
            const users = await bdd.query("SELECT * FROM users");

            return users;
        }

        async findByEmail(email) {
            const verifiedUser = await bdd.query(
                `SELECT email, password FROM users WHERE email = "${email}"`
            );

            return verifiedUser;
        }

        async createUser(email, password, lastname, firstname) {
            const createUser = await bdd.query(
                `INSERT INTO users (email, password, lastname, firstname) VALUES ("${email}", "${password}", "${lastname}", "${firstname}", "${city}")`
            );

            return createUser;
        }
    }

    const user = new UserControler();

    api.get("/users", async (req, res) => {
        res.send(await user.list());
    });

    api.get("/users/login", async (req, res) => {
        const verifiedUser = await user.findByEmail(req.query.email);
        let result;

        if (verifiedUser.length > 0) {
            if (verifiedUser[0]["password"] === req.query.password) {
                result = { success: true, errMessage: "" };
            } else {
                result = { success: false, errMessage: "wrong password" };
            }
        } else {
            result = { success: false, errMessage: "wrong email" };
        }

        res.send(result);
    });

    api.get("/users/create", async (req, res) => {
        const createUser = await user.createUser(
            req.query.email,
            req.query.password,
            req.query.lastname,
            req.query.firstname,
            getOrCreateCity(req.query.city)
        );
        let result;

        if (createUser.length > 0) {
            if (user[0]["email"] === req.query.email) {
                result = { success: false, errMessage: "email already used" };
            } else if (createUser[0]["password"] < 5) {
                result = {
                    success: false,
                    errMessage: "password not enough characters",
                };
            } else {
                result = { success: true, errMessage: "" };
            }
        }

        res.send(result);
    });

    return new UserControler();
};
