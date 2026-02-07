import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../common/Layout";
import { useForm } from "react-hook-form";
import { apiUrl } from "../../common/Config";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/Auth";

const Login = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/account/dashboard");
    }
  }, [user, navigate]);
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);

      if (result.status === 200) {
        //console.log(result.user.email);
        const userInfo = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          token: result.token,
        };
        localStorage.setItem("userInfoLMS", JSON.stringify(userInfo));
        login(userInfo);
        toast.success(result.message);
        navigate("/account/dashboard");
      } else {
        toast.error(result.message);
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
    <Layout>
      <div className="container py-5 mt-5">
        <div className="d-flex align-items-center justify-content-center">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card border-0 shadow login">
              <div className="card-body p-4">
                <h3 className="border-bottom pb-3 mb-3">Login</h3>
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    {...register("email", {
                      required: "The email field is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    type="text"
                    className={`form-control ${errors.email && "is-invalid"}`}
                    placeholder="Email"
                  />
                  {errors.email && (
                    <span className="text-danger">{errors.email.message}</span>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    {...register("password", {
                      required: "The password field is required",
                    })}
                    type="password"
                    className={`form-control ${errors.password && "is-invalid"}`}
                    placeholder="Password"
                  />
                  {errors.password && (
                    <span className="text-danger">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <button className="btn btn-primary">Login</button>
                  <Link to={`/register`} className="text-secondary">
                    Register Here
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
