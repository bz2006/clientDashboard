import cron from 'node-cron';
import { deleteExpiredStaticMedia, deleteShortTrips, getExpiredUnitsDetails } from '../DBControllers/AutoJobs.js';

// cron.schedule('*/30 * * * *', async () => {
//   console.log("doing cron job");
//   await deleteShortTrips()
// });

// cron.schedule('30 0 * * *', async () => {
//   console.log("doing cron expired job");
//   const det=await getExpiredUnitsDetails()
//   console.log(det);
  
// });

cron.schedule('*/2 * * * *', async () => {
  await deleteExpiredStaticMedia()
});

export default cron;
