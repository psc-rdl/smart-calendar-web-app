import express, { Request, Response } from "express";
const router = express.Router();
import {google} from "googleapis";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../utils/secrets";

let uploadedTasks: Array<{ summary: string; description: string; startTime: string; endTime: string }> = [];
let currentEvents: Array<{ summary: string; description: string; startTime: string; endTime: string }> = [];


function getCalendarClient(accessToken: string) {
  const auth = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, "http://localhost:3001/auth/google/redirect"); //redirect URI needs to be added?
  auth.setCredentials({ access_token: accessToken });
  return google.calendar({ version: "v3", auth });
}

interface TransformedEvent {
  summary: string;
  description: string;
  startTime: string;
  endTime: string;
}

function transformCalendarEvents(apiEvents: any[]): TransformedEvent[] {
  return apiEvents.map(event => ({
    summary: event.summary || '',
    description: event.description || '',
    startTime: event.start?.dateTime || event.start?.date || '',
    endTime: event.end?.dateTime || event.end?.date || ''
  }));
}

// GET upcoming events
router.get("/get-events", async (req: Request, res: Response) => {
  try {
    const accessToken = (req.user as any)?.accessToken;
    if (!accessToken) {
      res.status(401).send({ message: "Not authenticated" });
      return;
    }

    const calendar = getCalendarClient(accessToken);
    const now = new Date();
    const oneWeekLater = new Date();
    oneWeekLater.setDate(now.getDate() + 7);

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: oneWeekLater.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    currentEvents = transformCalendarEvents(response.data.items || []);
    res.json(currentEvents);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to fetch calendar events" });
  }
});


router.post('/save-tasks', async (req: Request, res: Response) => {
  try {
    const parsedEvents = req.body;

    if (!Array.isArray(parsedEvents)) {
      res.status(400).send('Uploaded JSON must be an array');
      return; 
    }

    for (const event of parsedEvents) {
      const { summary, description, startTime, endTime } = event;
      if (!summary || !startTime || !endTime) {
        res.status(400).send('Each event must have summary, startTime, and endTime');
        return;
      }
    }

    uploadedTasks = parsedEvents;

    res.status(200).send('Events added and stored temporarily.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing events');
  }
});

// POST create new events
router.post("/set-events", async (req: Request, res: Response) => {
  try {
    const accessToken = (req.user as any)?.accessToken;
    if (!accessToken) {
      res.status(401).send({ message: "Not authenticated" });
      return;
    }
    const createdEvents = [];

    const calendar = getCalendarClient(accessToken);
    for (const event of uploadedTasks) {
      const { summary, description, startTime, endTime } = event;
      const calendarFormat = {
        summary,
        description,
        start: { dateTime: startTime },
        end: { dateTime: endTime },
      }
      try {
        const response = await calendar.events.insert({
          calendarId: "primary",
          requestBody: calendarFormat,
        });
        createdEvents.push(response.data);
      } catch (error) {
        if (error instanceof Error) {
          createdEvents.push(error.message);
        } else {
          createdEvents.push(String(error));
        }
      }
    }
    uploadedTasks = [];
    res.json(createdEvents);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to create calendar event" });
  }
});

export default router;