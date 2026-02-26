const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Mongoose automatically looks for the plural, lowercased version of your model name.
// Thus, for the example, the model Employee is for the employees collection in the database.
const employeeSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Employee", employeeSchema);
