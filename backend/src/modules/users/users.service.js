import usersRepository from "./users.repository.js";
import usersValidation from "./users.validation.js";
import bcrypt from "bcrypt";

const httpError = (status, message) => Object.assign(new Error(message), { status });

const getMyProfile = async (userId) => {
  const user = await usersRepository.findPublicById(userId);
  if (!user) throw httpError(404, "User not found");
  return user;
};

const updateMyProfile = async (userId, input) => {
  const errors = usersValidation.validateProfileUpdate(input);
  if (errors.length) throw httpError(400, errors.join(", "));
  const email = input.email.trim().toLowerCase();
  const fullname = input.fullname.trim();
  const existing = await usersRepository.findByEmail(email);
  if (existing && existing.id !== userId) throw httpError(409, "Email is already registered");
  const user = await usersRepository.updateProfileById(userId, { email, fullname });
  if (!user) throw httpError(404, "User not found");
  return user;
};

const changeMyPassword = async (userId, input) => {
  const errors = usersValidation.validatePasswordChange(input);
  if (errors.length) throw httpError(400, errors.join(", "));
  const user = await usersRepository.findByIdWithPassword(userId);
  if (!user) throw httpError(404, "User not found");
  if (!(await bcrypt.compare(input.currentPassword, user.password))) throw httpError(400, "Current password is incorrect");
  if (await bcrypt.compare(input.newPassword, user.password)) throw httpError(400, "New password must be different from the current password");
  await usersRepository.updatePasswordById(userId, await bcrypt.hash(input.newPassword, 12));
};

export default { getMyProfile, updateMyProfile, changeMyPassword };
