const {
  createUser,
  candidateNameController,
  statusController,
  findAllDataController,
} = require("../controllers/UserControllers");

const router = require("express").Router();

router.post("/createUsers", createUser);

router.post("/createCandidate", candidateNameController);

router.post("/changeStatus", statusController);

router.post("/getdata", findAllDataController);

module.exports = router;
