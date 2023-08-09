const db = require("../config/database");

//create User Controllers
const createUser = async (req, res) => {
  try {
    const { Uid, name } = req.body;
    if (!Uid || !name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required please fill all the field",
      });
    }
    const sqlInsert = "INSERT INTO user_table (Uid, name) VALUES (?,?)";
    db.query(sqlInsert, [Uid, name], (err, result) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: "Error inserting data into database",
        });
      } else {
        const insertedData = {
          Uid: Uid,
          name: name,
        };
        res.status(200).json({
          success: true,
          data: insertedData,
          message: "Data inserted successfully",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

//add candidate controllers
const candidateNameController = async (req, res) => {
  try {
    const { Uid, candidate_name } = req.body;
    if (!Uid || !candidate_name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const sqlInsert =
      "INSERT INTO candidate_table(Uid,candidate_name) VALUES (?,?)";
    db.query(sqlInsert, [Uid, candidate_name], (err, result) => {
      if (err) {
        res.status(500).json({
          success: false,
          error: "Error inserting data into database" + err,
        });
      } else {
        const insertedData = {
          cid: result.insertId,
          Uid: Uid,
          candidate_name: candidate_name,
        };
        res.status(200).json({
          success: true,
          data: insertedData,
          message: "Data inserted successfully",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: "Internal server error",
    });
  }
};

//add Status Controller
const statusController = async (req, res) => {
  try {
    const { cid, status, statusUpdate } = req.body;

    // Validate input fields
    if (!cid || !status || !statusUpdate) {
      return res.status(400).json({
        success: false,
        message: "All fields are required, please fill all the fields",
      });
    }

    const sqlInsert =
      "INSERT INTO status_table(cid, status, statusUpdate) VALUES (?,?,?)";

    db.query(sqlInsert, [cid, status, statusUpdate], (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({
          success: false,
          error: "Error inserting data into database",
        });
      } else {
        const insertedData = {
          cid: cid,
          status: status,
          statusUpdate: statusUpdate,
        };

        res.status(200).json({
          success: true,
          data: insertedData,
          message: "Data inserted successfully",
        });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

//find All data Controller
const findAllDataController = async (req, res) => {
  try {
    const { Uid } = req.body;
    if (!Uid) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const getCidQuery = "SELECT cid FROM candidate_table WHERE Uid = ?";
    const getStatusCountQuery = `
      SELECT
        COUNT(*) AS TotalCandidates,
        SUM(CASE WHEN s.status = 'joined' THEN 1 ELSE 0 END) AS Joined,
        SUM(CASE WHEN s.status = 'interview' THEN 1 ELSE 0 END) AS Interview
      FROM candidate_table c
      LEFT JOIN status_table s ON c.cid = s.cid
      WHERE c.Uid = ?;
    `;

    db.query(getCidQuery, [Uid], (err, cidResults) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: "Error retrieving data from database",
          error: "Internal server error",
        });
      } else {
        if (cidResults.length === 0) {
          res.status(404).json({
            success: false,
            message: "User not found or no candidates created",
            error: "Data not found",
          });
        } else {
          db.query(getStatusCountQuery, [Uid], (err, countResults) => {
            if (err) {
              res.status(500).json({
                success: false,
                message: "Error retrieving data from database",
                error: "Internal server error",
              });
            } else {
              const { TotalCandidates, Joined, Interview } = countResults[0];
              res.status(200).json({
                Uid,
                TotalCandidates,
                Joined,
                Interview,
              });
            }
          });
        }
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Export the controller for use in your routes
module.exports = {
  findAllDataController,
};

module.exports = {
  createUser,
  candidateNameController,
  statusController,
  findAllDataController,
};
