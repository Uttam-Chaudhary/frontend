import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { MdDragIndicator } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";
import UpdateRequirement from "./UpdateRequirement";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const ManageRequirement = () => {
  const [loading, setLoading] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const [requirementData, setRequirementsData] = useState([]);
  const params = useParams();

  const [showRequirement, setShowRequirements] = useState(false);
  const handleClose = () => setShowRequirements(false);
  const handleShow = (outcome) => {
    setShowRequirements(true);
    setRequirementsData(outcome);
  };
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
      const formData = { ...data, course_id: params.id };
      const response = await fetch(`${apiUrl}/requirement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log(result);

      if (result.status === 200) {
        setLoading(false);
        //console.log("Success");
        const newRequirements = [...requirements, result.data];
        setRequirements(newRequirements);
        //console.log("Success");
        toast.success(result.message);
        reset();
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

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(requirements);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setRequirements(reorderedItems);
    saveOrder(reorderedItems);
  };

  const saveOrder = async (updatedRequirements) => {
    try {
      const response = await fetch(`${apiUrl}/sort-requirements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requirements: updatedRequirements }),
      });

      const result = await response.json();
      //console.log(result);

      if (result.status === 200) {
        //console.log("Success");
        toast.success(result.message);
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

  const deleteRequirement = async (id) => {
    if (confirm("Are you sure you want to delete this outcome?")) {
      try {
        const response = await fetch(`${apiUrl}/requirement/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        //console.log(result);

        if (result.status === 200) {
          setLoading(false);
          const newRequirement = requirements.filter(
            (outcome) => outcome.id != id,
          );
          setRequirements(newRequirement);
          //console.log("Success");
          toast.success(result.message);
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
  };

  const FetchRequirements = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/requirement?course_id=${params.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await response.json();
      console.log(result);
      if (result.status === 200) {
        setRequirements(result.data);
        //console.log("Success");
      } else {
        console.log("Something went wrong");
      }
    } catch (error) {
      console.error("Something went wrong:", error);
    }
  };

  React.useEffect(() => {
    FetchRequirements();
  }, []);

  return (
    <>
      <div className="card shadow-lg border-0">
        <div className="card-body p-4">
          <div className="d-flex">
            <h4 className="h5 mb-3">Requirement</h4>
          </div>
          <form className="mb-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <input
                {...register("requirement", {
                  required: "The requirement field is required.",
                })}
                type="text"
                className={`form-control ${errors.requirement ? "is-invalid" : ""} `}
                placeholder="Requirement"
              />
              {errors.requirement && (
                <span className="text-danger">
                  {errors.requirement.message}
                </span>
              )}
            </div>
            <button disabled={loading} className="btn btn-primary">
              {loading == false ? `Save` : `Please wait...`}
            </button>
          </form>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {requirements.map((requirement, index) => (
                    <Draggable
                      key={requirement.id}
                      draggableId={`${requirement.id}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mt-2 border bg-white shadow-lg  rounded"
                        >
                          <div className="card-body p-2 d-flex">
                            <div>
                              <MdDragIndicator />
                            </div>
                            <div className="d-flex justify-content-between w-100">
                              <div className="ps-2">{requirement.text}</div>
                              <div className="d-flex">
                                <Link
                                  onClick={() => handleShow(requirement)}
                                  className="text-primary me-1"
                                >
                                  <BsPencilSquare />
                                </Link>
                                <Link
                                  onClick={() => deleteRequirement(requirement.id)}
                                  className="text-danger"
                                >
                                  <FaTrashAlt />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* {requirements &&
            requirements.map((requirement) => {
              return (
                <div
                  key={`outcome-${requirement.id}`}
                  className="card shadow-lg mb-2"
                >
                  <div className="card-body p-2 d-flex">
                    <div>
                      <MdDragIndicator />
                    </div>
                    <div className="d-flex justify-content-between w-100">
                      <div className="ps-2">{requirement.text}</div>
                      <div className="d-flex">
                        <Link
                          onClick={() => handleShow(requirement)}
                          className="text-primary me-1"
                        >
                          <BsPencilSquare />
                        </Link>
                        <Link
                          onClick={() => deleteRequirement(requirement.id)}
                          className="text-danger"
                        >
                          <FaTrashAlt />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })} */}
        </div>
      </div>

      <UpdateRequirement
        requirementData={requirementData}
        showRequirement={showRequirement}
        handleClose={handleClose}
        requirements={requirements}
        setRequirement={setRequirements}
      />
    </>
  );
};

export default ManageRequirement;
