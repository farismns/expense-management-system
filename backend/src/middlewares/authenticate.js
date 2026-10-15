import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "Authentication token is required",
    });
  }

  const token = authorization.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (
      typeof payload !== "object" ||
      payload === null ||
      typeof payload.sub !== "string" ||
      !/^[1-9]\d*$/.test(payload.sub)
    ) {
      return res.status(401).json({
        status: "error",
        message: "Invalid authentication token",
      });
    }

    req.user = {
      id: Number(payload.sub),
    };

    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Invalid or expired authentication token",
    });
  }
};

export default authenticate;
