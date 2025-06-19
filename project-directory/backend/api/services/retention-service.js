const { sequelize } = require("../models/sequalize");

async function getRetention(days) {

  const sql = `
  SELECT
      to_char(u.created_at::date, 'YYYY-MM-DD') AS cohort,
      ROUND(
        100.0 * COUNT(DISTINCT v."userId") / NULLIF(COUNT(DISTINCT u.id), 0),
        2
      ) AS retention
    FROM "Users" u
    LEFT JOIN "Visits" v
      ON v."userId" = u.id
    AND v.visited_at BETWEEN (u.created_at::date + INTERVAL '${days} days')
                        AND (u.created_at::date + INTERVAL '${days + 1} days')
    WHERE u.created_at >= now() - INTERVAL '60 days'
    GROUP BY cohort
    ORDER BY cohort;
  `;

  const data = await sequelize.query(sql, {
    type: sequelize.QueryTypes.SELECT,
  });

  return data.map(row => ({
    cohort: row.cohort,
    retention: parseFloat(row.retention),
  }));
}

module.exports = { getRetention };
