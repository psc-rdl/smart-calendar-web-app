import express, { Request, Response } from "express";
const router = express.Router();
import {google} from "googleapis";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../utils/secrets";

function getCalendarClient(accessToken: string) {
    const auth = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, "http://localhost:3001/auth/google/redirect"); //redirect URI needs to be added?
    auth.setCredentials({ access_token: accessToken });
    return google.calendar({ version: "v3", auth });
}

// GET upcoming events
router.get("/calendar", async (req: Request, res: Response) => {
  try {
    const accessToken = (req.user as any)?.accessToken;
    if (!accessToken) {
      res.status(401).send({ message: "Not authenticated" });
      return;
    }

    const calendar = getCalendarClient(accessToken);
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    res.json(response.data.items);
    console.log(res);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to fetch calendar events" });
  }
});

// POST create new event
router.post("/calendar", async (req: Request, res: Response) => {
  try {
    const accessToken = (req.user as any)?.accessToken;
    if (!accessToken) {
      res.status(401).send({ message: "Not authenticated" });
      return;
    }

    const { summary, description, startTime, endTime } = req.body;

    const calendar = getCalendarClient(accessToken);
    const event = {
      summary,
      description,
      start: { dateTime: startTime },
      end: { dateTime: endTime },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to create calendar event" });
  }
});

export default router;