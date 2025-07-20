import { getUserActivityLogs } from "../services/activityServices.js";

async function handleUserActivityLogs(req, res, next) {
  try {
    const { id: userId } = req.user;
    const logs = await getUserActivityLogs(userId);
    res.status(200).json({ logs });
  } catch (error) {
    next(error);
  }
}

export { handleUserActivityLogs };