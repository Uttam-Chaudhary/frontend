import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { MdDragIndicator } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import UpdateOutcome from "./UpdateOutcome";

const ManageOutcome = () => {
  const [loading, setLoading] = useState(false);
  const [outcomes, setOutcomes] = useState([]);
  const [outcomeData, setOutcomeData] = useState([]);
  const params = useParams();

  const [showOutcome, setShowOutcomes] = useState(false);
  const handleClose = () => setShowOutcomes(false);

  const handleShow = (outcome) => {
    setShowOutcomes(true);
    setOutcomeData(outcome);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({});

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(outcomes);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setOutcomes(reorderedItems);
    saveOrder(reorderedItems);
  };

  const saveOrder = async (updatedOutcomes) => {
    try {
      const response = await fetch(`${apiUrl}/sort-outcomes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ outcomes: updatedOutcomes }),
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

  const onSubmit = async (data) => {
    try {
      const formData = { ...data, course_id: params.id };
      setLoading(true);
      const response = await fetch(`${apiUrl}/outcomes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      //console.log(result);

      if (result.status === 200) {
        setLoading(false);
        const newOutcomes = [...outcomes, result.data];
        setOutcomes(newOutcomes);
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

  const deleteOutcome = async (id) => {
    if (confirm("Are you sure you want to delete this outcome?")) {
      try {
        const response = await fetch(`${apiUrl}/outcomes/${id}`, {
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
          const newOutcomes = outcomes.filter((outcome) => outcome.id != id);
          setOutcomes(newOutcomes);
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

  const FetchOutcomes = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/outcomes?course_id=${params.id}`,
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
        setOutcomes(result.data);
        //console.log("Success");
      } else {
        console.log("Something went wrong");
      }
    } catch (error) {
      console.error("Something went wrong:", error);
    }
  };

  React.useEffect(() => {
    FetchOutcomes();
  }, []);

  return (
    <>
      <div className="card shadow-lg border-0 mb-5">
        <div className="card-body p-4">
          <div className="d-flex">
            <h4 className="h5 mb-3">Outcome</h4>
          </div>
          <form className="mb-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <input
                {...register("outcome", {
                  required: "The outcome field is required.",
                })}
                type="text"
                className={`form-control ${errors.outcome ? "is-invalid" : ""} `}
                placeholder="Outcome"
              />
              {errors.outcome && (
                <span className="text-danger">{errors.outcome.message}</span>
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
                  {outcomes.map((outcome, index) => (
                    <Draggable
                      key={outcome.id}
                      draggableId={`${outcome.id}`}
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
                              <div className="ps-2">{outcome.text}</div>
                              <div className="d-flex">
                                <Link
                                  onClick={() => handleShow(outcome)}
                                  className="text-primary me-1"
                                >
                                  <BsPencilSquare />
                                </Link>
                                <Link
                                  onClick={() => deleteOutcome(outcome.id)}
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

          {/* {outcomes &&
            outcomes.map((outcome) => {
              return (
                <div
                  key={`outcome-${outcome.id}`}
                  className="card shadow-lg mb-2"
                >
                  <div className="card-body p-2 d-flex">
                    <div>
                      <MdDragIndicator />
                    </div>
                    <div className="d-flex justify-content-between w-100">
                      <div className="ps-2">{outcome.text}</div>
                      <div className="d-flex">
                        <Link
                          onClick={() => handleShow(outcome)}
                          className="text-primary me-1"
                        >
                          <BsPencilSquare />
                        </Link>
                        <Link
                          onClick={() => deleteOutcome(outcome.id)}
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
      <UpdateOutcome
        outcomeData={outcomeData}
        showOutcome={showOutcome}
        handleClose={handleClose}
        outcomes={outcomes}
        setOutcomes={setOutcomes}
      />
    </>
  );
};

export default ManageOutcome;
