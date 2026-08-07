import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

/**
 * Weekly recipe newsletter — runs every Monday at 10:00 UTC and emails the
 * "recipe of the week" to all subscribers (see newsletter.ts).
 */
const crons = cronJobs();

crons.weekly(
  "Weekly recipe newsletter",
  {
    dayOfWeek: "monday",
    hourUTC: 10,
  },
  api.newsletter.sendWeeklyNewsletter,
);

export default crons;
