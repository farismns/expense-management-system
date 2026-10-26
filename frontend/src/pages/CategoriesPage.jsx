import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";

const INITIAL_FORM = {
  name: "",
  type: "expense",
};

function getCategoriesFromResponse(result) {
  return result?.data?.categories ?? result?.categories ?? result?.data ?? [];
}

function getErrorMessage(error, fallback) {
  return error?.message || fallback;
}

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [editingCategory, setEditingCategory] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const result = await api.getCategories();
      setCategories(getCategoriesFromResponse(result));
    } catch (error) {
      setPageError(getErrorMessage(error, "Failed to load categories."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      loadCategories();
    });
  }, [loadCategories]);

  function resetForm() {
    setFormData(INITIAL_FORM);
    setEditingCategory(null);
    setFormError("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
    setSuccessMessage("");
  }

  function handleEdit(category) {
    if (category.is_default) {
      return;
    }

    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
    });
    setFormError("");
    setSuccessMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setFormError("");
    setSuccessMessage("");

    const name = formData.name.trim();

    if (!name) {
      setFormError("Category name is required.");
      return;
    }

    if (name.length > 50) {
      setFormError("Category name must not exceed 50 characters.");
      return;
    }

    const duplicate = categories.some(
      (category) =>
        category.name.trim().toLowerCase() === name.toLowerCase() &&
        category.type === formData.type &&
        category.id !== editingCategory?.id,
    );

    if (duplicate) {
      setFormError("A category with this name already exists for this type.");
      return;
    }

    setSubmitting(true);

    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, { name });
        setSuccessMessage("Category updated successfully.");
      } else {
        await api.createCategory({
          name,
          type: formData.type,
        });
        setSuccessMessage("Category created successfully.");
      }

      resetForm();
      await loadCategories();
    } catch (error) {
      setFormError(getErrorMessage(error, "Failed to save category."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(category) {
    if (category.is_default) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    setPageError("");
    setSuccessMessage("");

    try {
      await api.deleteCategory(category.id);

      if (editingCategory?.id === category.id) {
        resetForm();
      }

      setSuccessMessage("Category deleted successfully.");
      await loadCategories();
    } catch (error) {
      setPageError(
        getErrorMessage(
          error,
          "Failed to delete category. It may be used by transactions or budgets.",
        ),
      );
    }
  }

  const incomeCategories = categories.filter(
    (category) => category.type === "income",
  );

  const expenseCategories = categories.filter(
    (category) => category.type === "expense",
  );

  function renderCategoryTable(items) {
    if (items.length === 0) {
      return <p className="categories-empty">No categories found.</p>;
    }

    return (
      <div className="categories-table-wrapper">
        <table className="categories-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>

                <td>{category.is_default ? "Default" : "Custom"}</td>

                <td>
                  {category.is_default ? (
                    <span className="categories-protected">Protected</span>
                  ) : (
                    <div className="categories-actions">
                      <button
                        type="button"
                        onClick={() => handleEdit(category)}
                        disabled={submitting}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(category)}
                        disabled={submitting}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <section className="categories-page">
      <header className="categories-header">
        <div>
          <h1>Categories</h1>
          <p>Manage categories for your income and expenses.</p>
        </div>
      </header>

      {pageError && (
        <div className="categories-alert categories-alert-error" role="alert">
          {pageError}
        </div>
      )}

      {successMessage && (
        <div
          className="categories-alert categories-alert-success"
          role="status"
        >
          {successMessage}
        </div>
      )}

      <section className="categories-form-section">
        <h2>{editingCategory ? "Edit Category" : "Add Category"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="categories-form-grid">
            <div className="categories-field">
              <label htmlFor="category-name">Category name</label>

              <input
                id="category-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                maxLength={50}
                placeholder="Enter category name"
                required
                disabled={submitting}
              />
            </div>

            <div className="categories-field">
              <label htmlFor="category-type">Category type</label>

              <select
                id="category-type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={Boolean(editingCategory) || submitting}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          {formError && (
            <p className="categories-form-error" role="alert">
              {formError}
            </p>
          )}

          <div className="categories-form-actions">
            <button type="submit" disabled={submitting}>
              {submitting
                ? "Saving..."
                : editingCategory
                  ? "Save Changes"
                  : "Add Category"}
            </button>

            {editingCategory && (
              <button type="button" onClick={resetForm} disabled={submitting}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {loading ? (
        <p role="status">Loading categories...</p>
      ) : (
        <div className="categories-groups">
          <section className="categories-list-section">
            <div className="categories-section-heading">
              <h2>Expense Categories</h2>
              <span>{expenseCategories.length} categories</span>
            </div>

            {renderCategoryTable(expenseCategories)}
          </section>

          <section className="categories-list-section">
            <div className="categories-section-heading">
              <h2>Income Categories</h2>
              <span>{incomeCategories.length} categories</span>
            </div>

            {renderCategoryTable(incomeCategories)}
          </section>
        </div>
      )}
    </section>
  );
}

export default CategoriesPage;
