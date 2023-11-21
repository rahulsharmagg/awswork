const express = require("express")
const router = express.Router()
const cors = require("cors")
const apiRoutes = require("./api.route")

/* You can modify according to limiting api users */
var corsOptions = {
	origin : "*"
}

router.options("/api/", cors(corsOptions))
router.use('/api/', cors(corsOptions), apiRoutes)

module.exports = router