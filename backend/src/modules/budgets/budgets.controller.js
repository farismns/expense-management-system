import budgetsService from "./budgets.service.js";

const createBudget = async (req, res, next) => {
  try {
    const budget = await budgetsService.createBudget(req.user.id, req.body);

    res.status(201).json({
      status: "success",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

const getBudgets = async (req, res, next) => {
  try {
    const budgets = await budgetsService.getBudgets(req.user.id);

    res.status(200).json({
      status: "success",
      data: budgets,
    });
  } catch (error) {
    next(error);
  }
};

const getBudgetById = async (req, res, next) => {
  try {
    const budget = await budgetsService.getBudgetById(
      Number(req.params.id),
      req.user.id,
    );

    res.status(200).json({
      status: "success",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

const updateBudget = async (req, res, next) => {
  try {
    const budget = await budgetsService.updateBudget(
      Number(req.params.id),
      req.user.id,
      req.body,
    );

    res.status(200).json({
      status: "success",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBudget = async (req, res, next) => {
  try {
    const budget = await budgetsService.deleteBudget(
      Number(req.params.id),
      req.user.id,
    );

    res.status(200).json({
      status: "success",
      message: "Budget deleted successfully",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
};
