const e = require('express');

module.exports = async function (api) {

    const bdd = await require('./mysql');

    class CityControler {
        
        async list() {
            const cities = await bdd.query('SELECT * FROM city');

            return cities;
        }

        async getCity(name) {
            const getCityId = await bdd.query(`SELECT id FROM city WHERE name = "${name}"`);

            return getCityId;
        }

        async createCity(name) {
            const createCity = await bdd.query(`INSERT INTO city (name) VALUES "${name}"`);ù

            return createCity;
        }
    }

    const city = new CityControler();


    api.get('/city', async (req, res) => {
        const getCityId = await city.getCityId(req.query.name);
        const createCity = await city.createCity(req.query.name);

        if (getCityId.length > 0) {
            result = {success: true, errMessage: ""};
        } else {
            result = {success: false, errMessage: "city unavailable"};
        }

        res.send([await city.list(), result]);
    });

    return new CityControler();
}