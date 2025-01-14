
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

const express = require('express');
const router = express.Router()

const config = require('../../config')
const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : config.MYSQL_HOST,
  port     : config.MYSQL_PORT,
  user     : config.MYSQL_USER,
  password : config.MYSQL_PASSWORD,
  database : config.MYSQL_DB_NAME,
});
 
connection.connect();

router.get('/example1/user/:id', 
(req, res) => {
    let userId = req.params.id;
    let sql = "SELECT * FROM users WHERE id = ?";

    try {
        PreparedStatement pstmt = connection.prepareStatement(sql);
        pstmt.setString(1, userId);

        ResultSet resultSet = pstmt.executeQuery();

        // Convert ResultSet to JSON
        List<Map<String, Object>> resultList = new ArrayList<>();
        ResultSetMetaData metaData = resultSet.getMetaData();
        int columnCount = metaData.getColumnCount();

        while (resultSet.next()) {
            Map<String, Object> row = new HashMap<>();
            for (int i = 1; i <= columnCount; i++) {
                String columnName = metaData.getColumnName(i);
                Object columnValue = resultSet.getObject(i);
                row.put(columnName, columnValue);
            }
            resultList.add(row);
        }

        // Close resources
        resultSet.close();
        pstmt.close();

        // Send JSON response
        res.json(resultList);
    } catch (SQLException e) {
        // Handle SQL exceptions
        res.status(500).json({ error: "Database error occurred" });
    }
}
);
})

router.get('/example2/user/:id',  (req,res) => {
    let userId = req.params.id;
    connection.query("SELECT * FROM users WHERE id=" + userId,(err, result) => {
        res.json(result);
    });
})

router.get('/example3/user/:id',  (req,res) => {
    let userId = req.params.id;
    connection.query({
        sql : "SELECT * FROM users WHERE id=" +userId
    },(err, result) => {
        res.json(result);
    });
})


module.exports = router
