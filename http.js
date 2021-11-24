const express = require('express');
const api = express();

require('./user')(api);
require('./city')(api);

api.listen(3000);
