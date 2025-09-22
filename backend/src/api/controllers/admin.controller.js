const db = require('../../config/db');

class AdminController {
  static async approveFarm(req, res) {
    const { farmId } = req.body;
    if (!farmId) {
      return res.status(400).json({ error: 'farmId is required.' });
    }

    try {
      // This is a simplified query. A real one might join with the Users table.
      const query = `UPDATE Farms SET Status = 'Active' WHERE FarmID = $1 RETURNING *;`;
      const { rows } = await db.query(query, [farmId]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Farm not found.' });
      }

      console.log(`[Admin Controller] Farm ${farmId} approved and activated.`);
      // TODO: In a real app, send a notification to the farmer.

      res.status(200).json({
        message: 'Farm successfully approved and activated.',
        farmId: rows[0].farmid,
        newStatus: rows[0].status,
      });
    } catch (error) {
      console.error('Error approving farm:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = AdminController;