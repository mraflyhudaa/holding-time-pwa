const DeleteModal = ({ handleDelete }) => {
  return (
    <>
      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Holding Time</h3>
          <p className="py-4">
            Are you sure you want to delete this holding time?
          </p>
          <div className="modal-action">
            <form method="dialog" onSubmit={handleDelete}>
              <button className="btn btn-primary" type="submit">
                Delete
              </button>
              <button
                className="btn"
                onClick={() => document.getElementById("delete_modal").close()}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default DeleteModal;
