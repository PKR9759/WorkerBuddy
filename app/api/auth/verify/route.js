// pages/api/auth/verify.js

import { verifyToken } from '../../../lib/jwt';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;
    
    // If no token is provided, return unauthorized
    if (!token) {
      return res.status(401).json({ 
        authenticated: false,
        message: 'Authentication required' 
      });
    }
    
    // Verify the token
    const decoded = verifyToken(token);
    
    // If token is invalid, return unauthorized
    if (!decoded) {
      return res.status(401).json({ 
        authenticated: false,
        message: 'Invalid or expired token' 
      });
    }
    
    // Token is valid, return user data
    return res.status(200).json({
      authenticated: true,
      user: {
        id: decoded.id,
        email: decoded.email,
        userType: decoded.userType,  // Include the user type for role-based checks
        name: decoded.name
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(401).json({ 
      authenticated: false,
      message: 'Authentication failed' 
    });
  }
}