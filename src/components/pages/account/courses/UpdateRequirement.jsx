import React, {useEffect, useState } from "react";

import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";
const UpdateRequirement = ({
  showRequirement,
  handleClose,
  requirements,
  setRequirement,
  requirementData,
}) => {

    const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({});

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/requirement/${requirementData.id}`, {
        method: "PUT",
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
        setLoading(false);
        //console.log("Success");
        const updatedRequirements = requirements.map( requirement =>requirement.id == result.data.id ?{...requirement, text: result.data.text} : requirement);
        setRequirement(updatedRequirements);
        toast.success(result.message);
        handleClose();
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
  }

  useEffect(() => {
    if(requirementData){
      reset({
        requirement: requirementData.text
      });
    }
  }, [requirementData]);

    
  return (
    <>
        <Modal size="lg" show={showRequirement} onHide={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Requirement</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                {...register("requirement", {
                  required: "The title field is required.",
                })}
                type="text"
                className={`form-control ${errors.requirement ? "is-invalid" : ""} `}
                placeholder="Title"
              />

              {errors.requirement && (
                <span className="text-danger">{errors.requirement.message}</span>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            {/* <Button variant="primary" type="submit">
              Save Changes
            </Button> */}

            <button disabled={loading} className="btn btn-primary">
              {loading == false ? `Update` : `Please wait...`}
            </button>
          </Modal.Footer>
      </form>
        </Modal>
    </>
  )
}

export default UpdateRequirement