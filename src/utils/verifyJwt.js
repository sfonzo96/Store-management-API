import dotenv from 'dotenv';
dotenv.config();

// Checks if the token is still valid (not expired)
const verifyJwt = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return false;
  }
};

export default verifyJwt;
