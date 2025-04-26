import dotenv from 'dotenv';
dotenv.config({ path: '../.env'});
import express, {Request, Response} from 'express';
import "./services/passport";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import authRoutes from './routes/auth';
import { CURRENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from './utils/secrets';

const app = express();

app.use(session({
  secret: CURRENT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use('/auth', authRoutes);

app.listen(3001, () => console.log('listening on: 3001'));

