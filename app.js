const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken')

// Importing the mongoose library, which allows interaction with MongoDB
const userModel = require('./Model/user')
const bcrypt = require('bcrypt')

// Set the view engine to ejs
app.set('view engine', 'ejs');
// Middleware to parse the incoming request body
app.use(express.json());
// Middleware to parse the incoming request body
app.use(express.urlencoded({ extended: true }));
// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname + '/public')));
// Middleware to parse the incoming cookies
app.use(cookieParser())


app.get('/', (req, res) => {
    res.render('index');
})

app.post('/create', (req, res) => {
    let { username, email, password, age } = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let createdUser = await userModel.create({
                username,
                email,
                password: hash,
                age
            });

            // Generating a JWT token with the user's email and a secret key
            let token = jwt.sign({ email }, "secretkey");
            // Setting the token as a cookie in the response
            res.cookie("token", token);
            // Sending the created user object in the response
            res.send(createdUser);
        })
    })


});
app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', async (req, res) => {
    let user = await userModel.findOne({ email: req.body.email });
    if (!user) res.send("Invalid email or password");

    bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (result) {
            let token = jwt.sign({email: user.email},"secretkey");
            res.cookie("token", token);
            res.send("Welcome Back!");
        } else {
            res.send("Invalid email or password");
        }
    })

})

app.get('/logout', (req, res) => {
    // Clearing the token cookie by setting it to an empty string
    res.cookie("token", "");
    // Redirecting the user back to the home page
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});