// server.js

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./mongo.js")
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth.js')
const app = express();
const PORT = 5000;
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());
mongoose.connect(`mongodb://localhost:27017/EmployeeDB
.employees`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((User)=>{console.log("mongoDb connection successfull")}).catch((error) =>{console.log("error")});


app.post("/register", (req, res) => {
  const { name, email, phone ,password } = req.body;

  const newUser = new User({
    name,
    email,
    phone,
    password
  });

  newUser
    .save()
    .then((User) => res.json(User))
    .catch((err) => console.log(err));
});


app.get('/users/:id', (req, res) => {
    User.findById(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
      })
      .catch((error) => {
        res.status(500).json({ message: 'Internal server error', error });
      });
  });


  app.get('/users', (req, res) => {
    User.find()
      .then((users) => {
        res.json(users);
      })
      .catch((error) => {
        res.status(500).json({ message: 'Internal server error', error });
      });
  });





  // Update a user by ID
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const {name, email, phone, address } = req.body;
  
    User.findByIdAndUpdate(id, { name, email, phone, address }, { new: true })
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
      })
      .catch((error) => {
        res.status(500).json({ message: 'Internal server error', error });
      });
  });
  
  // Delete a user by ID
  app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
  
    User.findByIdAndDelete(id)
      .then((deletedUser) => {
        if (!deletedUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
      })
      .catch((error) => {
        res.status(500).json({ message: 'Internal server error', error });
      });
  });



  app.post('/login', (req, res) => {
    
    User.findOne({email : req.body.email })
      .then((user) => {
            if(user && user.password === req.body.password) {
           user = user.toJSON();
            delete user.password;
            var token = jwt.sign(user, 'alokKey');
            user.token = token;
          res.status(200).json(user);
        } else {
            res.status(500).json('user email or password is incorrect');
        }

      
      })
      .catch((error) => {
        res.status(500).json({ message: 'Internal server error', error });
      });
  });


// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
