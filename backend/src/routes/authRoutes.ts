import { Router } from 'express';
import { db } from '../db';

const router = Router();

// Sign in (with demo mode support)
router.post('/signin', (req, res) => {
  const { email, password, role } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Look up user in SQLite
  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;

  // If user not found, or demo email used, auto-create or return demo user
  if (!user) {
    const isDemo = email.includes('demo') || email === 'demo@sugam.ai';
    const isAdmin = email.includes('admin') || role === 'Admin';
    const userId = `usr-${Date.now()}`;
    const userName = isAdmin ? 'Dr. R. K. Sharma' : (email.split('@')[0] || 'Afnan Ahmad');
    const userRole = isAdmin ? 'Admin' : (role || 'Manufacturer');

    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role, company)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, userName, email, password || 'password123', userRole, 'Hindustan Quality Products Ltd');

    user = {
      id: userId,
      name: userName,
      email,
      role: userRole,
      company: 'Hindustan Quality Products Ltd'
    };
  } else if (role && user.role !== role) {
    // Allow demo role switcher to update session role
    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, user.id);
    user.role = role;
  }

  // Generate mock JWT token
  const token = `sugam-jwt-${Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role })).toString('base64')}`;

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company
    }
  });
});

// Sign up
router.post('/signup', (req, res) => {
  const { name, email, password, role, company } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const userId = `usr-${Date.now()}`;
    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role, company)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, name, email, password || 'password123', role || 'Manufacturer', company || 'Manufacturing Ltd');

    const token = `sugam-jwt-${Buffer.from(JSON.stringify({ id: userId, email, role: role || 'Manufacturer' })).toString('base64')}`;

    return res.status(201).json({
      token,
      user: {
        id: userId,
        name,
        email,
        role: role || 'Manufacturer',
        company: company || 'Manufacturing Ltd'
      }
    });
  } catch (err: any) {
    return res.status(400).json({ error: 'Email already exists or invalid registration data' });
  }
});

// Forgot password
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  return res.json({
    message: `Password reset instructions have been dispatched to ${email || 'your registered email address'}. (Demo Mode)`
  });
});

// Current user profile
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // Return default demo user
    const defaultUser = db.prepare('SELECT id, name, email, role, company FROM users LIMIT 1').get();
    return res.json({ user: defaultUser });
  }

  try {
    const raw = authHeader.replace('Bearer ', '').replace('sugam-jwt-', '');
    const decoded = JSON.parse(Buffer.from(raw, 'base64').toString());
    const user = db.prepare('SELECT id, name, email, role, company FROM users WHERE id = ?').get(decoded.id);
    return res.json({ user: user || decoded });
  } catch {
    const defaultUser = db.prepare('SELECT id, name, email, role, company FROM users LIMIT 1').get();
    return res.json({ user: defaultUser });
  }
});

// Logout
router.post('/logout', (_req, res) => {
  return res.json({ message: 'Logged out successfully' });
});

export default router;
