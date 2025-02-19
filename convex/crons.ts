import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Schedule data cleanup every 5 hours starting at 12:00 PM PT (8:00 PM UTC)
crons.interval("cleanup-data", { hours: 5 }, internal.cleanup.clearAllData, {});

export default crons;
