import React from "react";
import Layour from "../../../common/Layout";
import { Link, useNavigate } from "react-router-dom";
import UserSidebar from "../../../common/UserSidebar";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { apiUrl, token } from "../../../common/Config";

const CreateCourses = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${apiUrl}/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      //console.log(result);

      if (result.status === 200) {
        //console.log("Success");
        toast.success(result.message);
        navigate("/account/courses/edit/"+ result.data.id);
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
  return (
    <Layour>
      <section className="section-4">
        <div className="container pb-5 pt-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/account">Account</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Create Course
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between">
                <h2 className="h4 mb-0 pb-0">Create Course</h2>
              </div>
            </div>
            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>
            <div className="col-lg-9">
              <div className="row">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="cart-border-0 shadow-lg">
                    <div className="card-body p-4">
                      <div className="mb-3">
                        <label htmlFor="title">Title</label>
                        <input
                          {...register("title", {
                            required: "The course name is required",
                          })}
                          type="text"
                          className={`form-control ${errors.name && "is-invalid" }`}
                          placeholder="Course Title"
                        />
                        {errors.title && (
                          <span className="text-danger">
                            {errors.title.message}
                          </span>
                        )}
                      </div>
                      <button className="btn btn-primary">Continue</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layour>
  );
};

export default CreateCourses;
