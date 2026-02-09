import React, {useEffect, useState } from "react";

import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";

const UpdateOutcome = ({
  showOutcome,
  handleClose,
  outcomes,
  setOutcomes,
  outcomeData,
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
      const response = await fetch(`${apiUrl}/outcomes/${outcomeData.id}`, {
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
        const updatedOutcomes = outcomes.map( outcome =>outcome.id == result.data.id ?{...outcome, text: result.data.text} : outcome);
        setOutcomes(updatedOutcomes);
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
    if(outcomeData){
      reset({
        outcome: outcomeData.text
      });
    }
  }, [outcomeData]);

  return (
    <>
        <Modal size="lg" show={showOutcome} onHide={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Outcome</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                {...register("outcome", {
                  required: "The title field is required.",
                })}
                type="text"
                className={`form-control ${errors.outcome ? "is-invalid" : ""} `}
                placeholder="Title"
              />

              {errors.outcome && (
                <span className="text-danger">{errors.outcome.message}</span>
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
  );
};

export default UpdateOutcome;
