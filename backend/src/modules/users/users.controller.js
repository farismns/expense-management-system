import usersService from "./users.service.js";

const getMyProfile = async (req, res, next) => {
  try { res.status(200).json({ status: "success", data: { user: await usersService.getMyProfile(req.user.id) } }); }
  catch (error) { next(error); }
};
const updateMyProfile = async (req, res, next) => {
  try { res.status(200).json({ status: "success", message: "Profile updated successfully", data: { user: await usersService.updateMyProfile(req.user.id, req.body) } }); }
  catch (error) { next(error); }
};
const changeMyPassword = async (req, res, next) => {
  try { await usersService.changeMyPassword(req.user.id, req.body); res.status(200).json({ status: "success", message: "Password updated successfully" }); }
  catch (error) { next(error); }
};
export default { getMyProfile, updateMyProfile, changeMyPassword };
