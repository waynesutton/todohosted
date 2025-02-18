import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Schedule data cleanup at 12:01 AM PT (8:01 AM UTC)
crons.daily(
  "cleanup-data",
  {
    hourUTC: 8,
    minuteUTC: 1,
  },
  internal.cleanup.clearAllData
);

export default crons;
