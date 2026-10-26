import authService from "./auth.service.js";

const requestPasswordReset = async (req, res, next) => {
  try { await authService.sendPasswordReset(req.body?.email); res.status(200).json({ status: "success", message: "If that email is registered, a reset link has been sent." }); }
  catch (error) { next(error); }
};
const resetPassword = async (req, res, next) => {
  try { await authService.resetPassword(req.body?.token, req.body?.password); res.status(200).json({ status: "success", message: "Password reset successfully" }); }
  catch (error) { next(error); }
};
export default { requestPasswordReset, resetPassword };
