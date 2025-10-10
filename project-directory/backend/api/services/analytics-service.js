const { sequelize } = require("../models/sequalize");

async function getTraffic(period) {
  let dateTrunc, intervalUnit;
  if (period.endsWith("d")) {
    dateTrunc = "day";
    intervalUnit = `${parseInt(period, 10)} days`;
  } else if (period.endsWith("m")) {
    dateTrunc = "month";
    intervalUnit = `${parseInt(period, 10)} months`;
  } else {
    throw new Error("period должен заканчиваться на d или m");
  }

  const sql = period.endsWith("m")
    ? `
      SELECT
        to_char(month_period, 'YYYY-MM') AS period,
        MAX(daily_value) AS value
      FROM (
        SELECT
          date_trunc('month', visited_at) AS month_period,
          COUNT(DISTINCT "userId") AS daily_value
        FROM "Visits"
        WHERE visited_at >= now() - interval '${intervalUnit}'
        GROUP BY month_period, date_trunc('day', visited_at)
      ) AS sub
      GROUP BY month_period
      ORDER BY month_period;
    `
    : `
      SELECT
        to_char(date_trunc('${dateTrunc}', visited_at), 'YYYY-MM-DD') AS period,
        COUNT(DISTINCT "userId") AS value
      FROM "Visits"
      WHERE visited_at >= now() - interval '${intervalUnit}'
      GROUP BY period
      ORDER BY period;
    `;

  const data = await sequelize.query(sql, {
    type: sequelize.QueryTypes.SELECT,
  });

  return data.map(row => ({
    period: row.period,
    value: parseInt(row.value, 10),
  }));
}





module.exports = { getTraffic };
