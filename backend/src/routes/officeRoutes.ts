import { Router } from 'express';
import { db } from '../db';

const router = Router();

router.get('/', (req, res) => {
  const { region, state, city, q } = req.query;

  let sql = 'SELECT * FROM offices WHERE 1=1';
  const params: any[] = [];

  if (region && region !== 'All') {
    sql += ' AND region = ?';
    params.push(region);
  }

  if (state && state !== 'All') {
    sql += ' AND state LIKE ?';
    params.push(`%${state}%`);
  }

  if (city && city !== 'All') {
    sql += ' AND city LIKE ?';
    params.push(`%${city}%`);
  }

  if (q) {
    sql += ' AND (office_name LIKE ? OR city LIKE ? OR address LIKE ?)';
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }

  const offices = db.prepare(sql).all(...params);

  const formatted = offices.map((o: any) => ({
    id: o.id,
    office_name: o.office_name,
    region: o.region,
    city: o.city,
    state: o.state,
    address: o.address,
    phone: o.phone,
    email: o.email,
    working_hours: o.working_hours,
    services: JSON.parse(o.services_json || '[]'),
    coordinates: JSON.parse(o.coordinates_json || '{"lat":28.6139,"lng":77.2090}')
  }));

  return res.json(formatted);
});

export default router;
