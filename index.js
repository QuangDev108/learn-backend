const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();

const db = require('./config/database');
db.connect();

const systemConfig = require('./config/system');

const routeAdmin = require(`./routes/admin/index.router`);
const routes = require('./routes/client/index.route');

const app = express();
const port = process.env.PORT;

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', './views');
app.set('view engine', 'pug');


//Flash
app.use(cookieParser('ABCDEFGHIJKLMNOPQRSTUVWXYZ'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
//End flash

app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static('public'));

//Routes
routeAdmin(app);
routes(app);

app.listen(port, () => {  
  console.log(`Server đang chạy tại http://localhost:${port}`);
});