import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Schedule data cleanup at 1:00 AM PT (8:00 AM UTC)
crons.daily(
  "cleanup-data",
  {
    hourUTC: 8, // 1:00 AM PT = 8:00 AM UTC
    minuteUTC: 0,
  },
  internal.cleanup.clearAllData
);

export default crons;
