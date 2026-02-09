import React, { useState } from "react";
import Layour from "../../../common/Layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import UserSidebar from "../../../common/UserSidebar";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { apiUrl, token } from "../../../common/Config";
import ManageOutcome from "./ManageOutcome";
import ManageRequirement from "./ManageRequirement";

const EditCourse = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [languages, setLanguages] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    defaultValues: async () => {
      try {
        const response = await fetch(`${apiUrl}/courses/${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        //console.log(result);

        if (result.status === 200) {
          //console.log("Success");
          reset({
            title: result.data.title,
            category: result.data.category_id,
            level: result.data.level_id,
            language: result.data.language_id,
            description: result.data.description,
            sell_price: result.data.price,
            cross_price: result.data.cross_price,
          });
        } else {
          console.log("Something went wrong");
        }
      } catch (error) {
        console.error("Something went wrong:", error);
      }
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/courses/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);

      if (result.status === 200) {
        setLoading(false);
        //console.log("Success");
        toast.success(result.message);
        // navigate("/account/courses/edit/"+ result.data.id);
      } else {
        const errors = result.errors;
        Object.keys(errors).forEach((field) => {
          setError(field, {
            message: errors[field][0],
          });
        });
      }
    } catch (error) {
      console.error("Something went wrong:", error);
    }
  };

  const courseMetaData = async () => {
    try {
      const response = await fetch(`${apiUrl}/courses/meta-data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      //console.log(result);

      if (result.status === 200) {
        //console.log("Success");
        setCategories(result.categories);
        setLevels(result.levels);
        setLanguages(result.languages);
      } else {
        console.log("Something went wrong");
      }
    } catch (error) {
      console.error("Something went wrong:", error);
    }
  };

  React.useEffect(() => {
    courseMetaData();
  }, []);

  return (
    <Layour>
      <section className="section-4">
        <div className="container pb-5 pt-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Edit Course
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between">
                <h2 className="h4 mb-0 pb-0">Edit Course</h2>
              </div>
            </div>
            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>
            <div className="col-lg-9">
              <div className="row">
                <div className="col-md-7">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="cart-border-0 shadow-lg">
                      <div className="card-body p-4">
                        <h4 className="h5 border-bottom pb-3 mb-3">
                          Course Details
                        </h4>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="title">
                            Title
                          </label>
                          <input
                            {...register("title", {
                              required: "The title field is required",
                            })}
                            type="text"
                            className={`form-control ${errors.title && "is-invalid"}`}
                            placeholder="Course Title"
                          />
                          {errors.title && (
                            <span className="text-danger">
                              {errors.title.message}
                            </span>
                          )}
                        </div>
                        <div className="mb-3">
                          <label htmlFor="category" className="form-label">
                            Category
                          </label>
                          <select
                            {...register("category", {
                              required: "The category field is required",
                            })}
                            className={`form-select ${errors.category && "is-invalid"}`}
                            id="category"
                          >
                            <option value="">Select a Category</option>
                            {categories &&
                              categories.map((category) => {
                                return (
                                  <option key={category.id} value={category.id}>
                                    {category.name}
                                  </option>
                                );
                              })}
                          </select>
                          {errors.category && (
                            <span className="text-danger">
                              {errors.category.message}
                            </span>
                          )}
                        </div>
                        <div className="mb-3">
                          <label htmlFor="level" className="form-label">
                            Level
                          </label>
                          <select
                            {...register("level", {
                              required: "The level field is required",
                            })}
                            className={`form-select ${errors.level && "is-invalid"}`}
                            id="level"
                          >
                            <option value="">Select a level</option>
                            {levels &&
                              levels.map((level) => {
                                return (
                                  <option key={level.id} value={level.id}>
                                    {level.name}
                                  </option>
                                );
                              })}
                          </select>
                          {errors.level && (
                            <span className="text-danger">
                              {errors.level.message}
                            </span>
                          )}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="language" className="form-label">
                            Language
                          </label>
                          <select
                            {...register("language", {
                              required: "The language field is required",
                            })}
                            className={`form-select ${errors.language && "is-invalid"}`}
                            id="language"
                          >
                            <option value="">Select a Language</option>
                            {languages &&
                              languages.map((language) => {
                                return (
                                  <option key={language.id} value={language.id}>
                                    {language.name}
                                  </option>
                                );
                              })}
                          </select>
                          {errors.language && (
                            <span className="text-danger">
                              {errors.language.message}
                            </span>
                          )}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="description" className="form-label">
                            Description
                          </label>
                          <textarea
                            {...register("description", {
                              required: "The description field is required",
                            })}
                            rows="5"
                            className={`form-control ${errors.category && "is-invalid"}`}
                            placeholder="Description"
                            id="description"
                          ></textarea>
                          {errors.description && (
                            <span className="text-danger">
                              {errors.description.message}
                            </span>
                          )}
                        </div>

                        <h4 className="h5 border-bottom pb-3 mb-3">Pricing</h4>

                        <div className="mb-3">
                          <label className="form-label" htmlFor="sell_price">
                            Sell Price
                          </label>
                          <input
                            {...register("sell_price", {
                              required: "The sell price field is required",
                            })}
                            type="text"
                            className={`form-control ${errors.sell_price && "is-invalid"}`}
                            placeholder="Sell Price"
                            id="sell_price"
                          />
                          {errors.sell_price && (
                            <span className="text-danger">
                              {errors.sell_price.message}
                            </span>
                          )}
                        </div>

                        <div className="mb-3">
                          <label className="form-label" htmlFor="cross_price">
                            Cross Price
                          </label>
                          <input
                            {...register("cross_price")}
                            type="text"
                            className={`form-control`}
                            placeholder="Cross Price"
                            id="cross_price"
                          />
                        </div>
                        <button disabled={loading} className="btn btn-primary">
                          {loading == false ? `Update` : `Please wait...`}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-md-5">
                  <ManageOutcome />
                  <ManageRequirement />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layour>
  );
};

export default EditCourse;
