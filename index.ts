import express, { Express } from "express";
import ejs from "ejs";
import dotenv from "dotenv";
import path from "path";
import { connect } from "./database";
import session from "./session";
import { secureMiddleware } from "./session";
import { loginRouter } from "./routes/loginRouter";
import { homeRouter } from "./routes/homeRouter";
import { registrationRouter } from "./routes/registrationRouter";
import { fetchAndSaveCharacters } from "./fetchCharacters";


dotenv.config();

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session);
app.set("views", path.join(__dirname, "views"));
app.set("port", process.env.PORT || 3000);

// Routes
app.use(loginRouter());
app.use(homeRouter());
app.use(registrationRouter());

(async () => {
    try {
        await connect();
        console.log("Connected to the database");

        const apiKey = "https://fortnite-api.com/v2/cosmetics/br/search/all?type=outfit&api_key=3ca10d0e-b9d0-4dac-9940-14a45dcd9572"; 
        if (apiKey) {
            await fetchAndSaveCharacters();
            console.log("Characters fetched and saved to the database");
        } else {
            console.error("Fortnite API key not found. Characters not fetched.");
        }

        app.listen(app.get("port"), () => {
            console.log("Server started on http://localhost:" + app.get('port'));
        });
    } catch (error) {
        console.error("Error starting the application:", error);
        process.exit(1);
    }
})();






// app.get("/", async (req, res) => {
//     res.render("index", { errorMessage: null });
// });

// app.get("/login", async (req, res) => {
//     if (req.session.user) {
//         res.render("landing-page", { user: req.session.user });
//     } else {
//         res.render("login", { errorMessage: null });
//     }
// });

// app.get('/landing-page', secureMiddleware, (req, res) => {
//     res.render('landing-page', { user: req.session.user });
// });

// app.get('/registration', secureMiddleware, (req, res) => {
//     res.render('registration', { user: req.session.user });
// });

// app.get('/homepage_fortnite', secureMiddleware, (req, res) => {
//     res.render('homepage_fortnite', { user: req.session.user });
// });

// app.get('/blacklist_detail', secureMiddleware, (req, res) => {
//     res.render('blacklist_detail', { user: req.session.user });
// });

// app.get('/blacklisted_characters', secureMiddleware, (req, res) => {
//     res.render('blacklisted_characters', { user: req.session.user });
// });

// app.get('/character_detail', secureMiddleware, (req, res) => {
//     res.render('character_detail', { user: req.session.user });
// });

// app.get('/characters', secureMiddleware, (req, res) => {
//     res.render('characters', { user: req.session.user });
// });

// app.get('/favorite_characters', secureMiddleware, (req, res) => {
//     res.render('favorite_characters', { user: req.session.user });
// });

// app.get('/favorite_detail', secureMiddleware, (req, res) => {
//     res.render('favorite_detail', { user: req.session.user });
// });

// app.get('/user-profile', secureMiddleware, (req, res) => {
//     res.render('user-profile', { user: req.session.user });
// });

// app.get("/logout", async (req, res) => {
//     req.session.destroy(() => {
//         res.redirect("/");
//     });
// });