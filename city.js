const e = require("express");

module.exports = async function (api) {
    const bdd = await require("./mysql");

    class CityControler {
        async list() {
            const cities = await bdd.query("SELECT * FROM city");

            return cities;
        }

        async getOrCreateCity(name) {
            const getId = await bdd.query(
                `SELECT id FROM city WHERE name = "${name}"`
            );
            const createByName = await bdd.query(
                `INSERT INTO city (name) VALUES "${name}"`
            );

            return [getId, createByName];
        }
    }

    const city = new CityControler();

    api.get("/city", async (req, res) => {
        const getId = await city.getId(req.query.name);
        const createByName = await city.createByName(req.query.name);
        let result;
        let city_id;

        if (getId < 0) {
            result = { success: false, errMessage: "city unavailable" };
        } else {
            city_id = createByName[0]["id"];
            result = { success: true, errMessage: "city created" };
        }

        // res.send([await city.list(), result]);
        res.send(city_id);
    });

    return new CityControler();
};
