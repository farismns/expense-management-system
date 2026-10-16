import transactionsRepository from "./transactions.repository.js";
import categoriesRepository from "../categories/categories.repository.js";
import transactionsValidation from "./transactions.validation.js";

const createUserTransaction = async (userId, input) => {
  const { date, amount, type, category_id, description } = input;

  if (type !== "income" && type !== "expense") {
    const error = new Error("Transaction type must be income or expense");
    error.status = 400;
    throw error;
  }

  if (type === "expense" && category_id == null) {
    const error = new Error("Category is required for expense transactions");
    error.status = 400;
    throw error;
  }

  if (category_id != null) {
    const category = await categoriesRepository.findByIdAndUserId(
      category_id,
      userId,
    );

    if (!category) {
      const error = new Error("Category not found for this user");
      error.status = 400;
      throw error;
    }
  }

  return transactionsRepository.create({
    date,
    amount,
    type,
    category_id: category_id ?? null,
    description: description ?? null,
    user_id: userId,
  });
};

const getUserTransactions = async (userId) => {
  return transactionsRepository.findAllByUserId(userId);
};

const getUserTransactionById = async (transactionId, userId) => {
  const transaction = await transactionsRepository.findByIdAndUserId(
    transactionId,
    userId,
  );

  if (!transaction) {
    const error = new Error("Transaction not found");
    error.status = 404;
    throw error;
  }

  return transaction;
};

const updateUserTransaction = async (transactionId, userId, input) => {
  // 1. Pastikan input berbentuk object JSON.
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    const error = new Error("Request body must be a JSON object");
    error.status = 400;
    throw error;
  }

  // 2. Ambil transaksi yang dimiliki pengguna yang sedang login.
  const existingTransaction = await getUserTransactionById(
    transactionId,
    userId,
  );

  // 3. Konversi date dari database (objek Date) ke string "YYYY-MM-DD"
  const existingDateFormatted = existingTransaction.date
    ? new Date(existingTransaction.date).toISOString().split("T")[0]
    : existingTransaction.date;

  // Gabungkan data lama dengan field yang dikirim.
  const updatedData = {
    date: input.date === undefined ? existingDateFormatted : input.date,

    amount:
      input.amount === undefined
        ? Number(existingTransaction.amount)
        : input.amount,

    type: input.type === undefined ? existingTransaction.type : input.type,

    category_id:
      input.category_id === undefined
        ? existingTransaction.category_id
        : input.category_id,

    description:
      input.description === undefined
        ? existingTransaction.description
        : input.description,
  };

  // 4. Validasi data akhir setelah penggabungan.
  const errors = transactionsValidation.validateCreateTransaction(updatedData);

  if (errors.length > 0) {
    const error = new Error("Validation failed");
    error.status = 400;
    error.details = errors;
    throw error;
  }

  // 5. Pastikan kategori yang digunakan milik pengguna tersebut.
  if (updatedData.category_id != null) {
    const category = await categoriesRepository.findByIdAndUserId(
      updatedData.category_id,
      userId,
    );

    if (!category) {
      const error = new Error("Category not found for this user");
      error.status = 400;
      throw error;
    }
  }

  // 6. Simpan perubahan dengan pembatasan kepemilikan di repository.
  const updatedTransaction = await transactionsRepository.updateByIdAndUserId(
    transactionId,
    userId,
    updatedData,
  );

  // Antisipasi jika transaksi tidak lagi ditemukan saat proses update.
  if (!updatedTransaction) {
    const error = new Error("Transaction not found");
    error.status = 404;
    throw error;
  }

  return updatedTransaction;
};

export default {
  createUserTransaction,
  getUserTransactions,
  getUserTransactionById,
  updateUserTransaction,
};
