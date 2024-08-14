/**
 * DeleteModal component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the modal.
 * @param {string} props.description - The description of the modal.
 * @param {function} props.handleDelete - The function to handle the delete action.
 * @returns {JSX.Element} The DeleteModal component.
 */
const DeleteModal = ({ title, description, handleDelete }) => {
  return (
    <>
      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4">{description}</p>
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
