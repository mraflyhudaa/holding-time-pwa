/**
 * DeleteModal component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the modal.
 * @param {string} props.description - The description of the modal.
 * @param {function} props.handleDelete - The function to handle the delete action.
 * @param {string} props.buttonName - The name of the button.
 * @returns {JSX.Element} The DeleteModal component.
 */
const ConfirmationModal = ({ title, description, handle, buttonName }) => {
  return (
    <>
      <dialog id="confirmation_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4">{description}</p>
          <div className="modal-action">
            <form method="dialog" onSubmit={handle}>
              <div className="space-x-2">
                <button className="btn btn-primary" type="submit">
                  {buttonName}
                </button>
                <button
                  className="btn"
                  type="button"
                  onClick={() =>
                    document.getElementById("confirmation_modal").close()
                  }
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ConfirmationModal;
