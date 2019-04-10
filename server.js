var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var path = require('path');

app.use(express.static(path.join(__dirname, './static')));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var session = require('express-session');
app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

const flash = require('express-flash');
app.use(flash());

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dog_dashboard');

var DashboardSchema = new mongoose.Schema({
    pic: { type: String },
    name: { type: String, required: "Please Enter a Name!", trim: true, minlength: 2 },
    age: { type: Number, required: "Please Enter an Age!", trim: true },
    activities: { type: String, required: "Please Enter Favorite Activities!", trim: true, minlength: 2 },
    fav_food: { type: String, required: "Please Enter Favorite Treat!", trim: true, minlength: 2 },
}, { timestamps: true });

mongoose.model('Dog', DashboardSchema); // We are setting this Schema in our Models as 'User'
var Dog = mongoose.model('Dog')

/////////////Routes//////////////
app.get('/', function (req, res) { ///////Render Index Page ///////////

    Dog.find({}, function (err, dogs) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('index', { alldogs: dogs });
        }

    })

})

app.get('/dog/new', function (req, res) { /////////Render Add Dog Page//////////

    res.render('new_dog');

})

app.get('/dog/:id', function (req, res) { /////////Render Dog Info Page////////

    var thisid = req.params.id;
    
    Dog.findOne({_id: thisid}, function(err, doginfo) {
        if(err) 
        {
            console.log(err);
        }
        else
        {
            res.render('dog_info', {thisdog:doginfo})
        }

    })
})

app.get('/dog/edit/:id', function (req, res) { //////////Render Edit Info Page//////////

    var thisid = req.params.id;

    Dog.findOne({_id: thisid}, function(err, doginfo) {
        if(err) 
        {
            console.log(err);
        }
        else
        {
            res.render('edit_info', {thisdog:doginfo})
        }
    })
})

app.get('/dog/destroy/:id', function (req, res){
    
    Dog.remove({_id:req.params.id}, function(err){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect('/');
        }
    })
})
app.post('/add_dog', function (req, res) { ///////Processing for adding dog/////////
    console.log("POST DATA", req.body);

    dog = new Dog({ pic: req.body.pic, name: req.body.name, age: req.body.age, activities: req.body.activities, fav_food: req.body.fav_food });

    dog.save(function (err) {
        if (err) {
            // if there is an error upon saving, use console.log to see what is in the err object 
            console.log("We have an error!", err);
            // adjust the code below as needed to create a flash message with the tag and content you would like
            for (var key in err.errors) {
                req.flash('registration', err.errors[key].message);
            }
            // redirect the user to an appropriate route
            res.redirect('/dog/new');
        }
        else {
            console.log('successfully added a DOG!');
            res.redirect('/');
        }
    });
});

app.post('/edit_dog/:id', function (req, res) {
    var thisid = req.params.id;

    Dog.findOne({_id:thisid}, function(err, thisdog){
        thisdog.pic = req.body.pic
        thisdog.name = req.body.name
        thisdog.age = req.body.age
        thisdog.activities = req.body.activities
        thisdog.fav_food = req.body.fav_food

        thisdog.save(function(err){
            if(err)
            {
                console.log("We have an error!");
                console.log(err);

            }
            else
            {
                console.log('Dog information has been succesfully updated!')
                res.redirect('/dog/' + thisid)
            }
            
        })
    })
})
app.listen(5000, function () {
    console.log("listening on port 5000");
})
