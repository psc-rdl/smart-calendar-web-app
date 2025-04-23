import express, {Request, Response} from 'express';
import "./services/passport";
import session from "express-session";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.listen(3001, () => console.log('listening on: 3001'));

