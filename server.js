const express = require("express");
// import passport and passport-jwt modules
const passport = require("passport");
const cors = require("cors")
const passportConfig = require("./config/passport");
const sequelize = require('./config/keys').sequelize
const AuthRouter = require('./routes/auth')
const AttendanceAuth = require('./routes/personsAttendance')
const ExcelDownloadRouter = require('./routes/downloadExcel')


const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);
// Passport middleware
app.use(passport.initialize());
app.use(cors())

// Passport config
passportConfig(passport);

sequelize.sync().then(() => {
  console.log("Successfully Connected to the Database");
}).catch((err)=>{
  console.log('Error occurred while connecting to the DB: ', err)
});


app.use('/api/auth', AuthRouter)
app.use('/api/attendance', AttendanceAuth)
app.use('/api/excel', ExcelDownloadRouter)

// add a basic route
app.get("/", function(req, res) {
  res.json({ message: "Express is up!" });
});

// Listeinng to the app
app.listen(8000, function() {
  console.log(`Express is running on port 8000`);
});
