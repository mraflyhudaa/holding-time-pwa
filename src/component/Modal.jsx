import React from "react";

const Modal = ({ title, children }) => {
  return (
    <dialog id="modal-component" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;

// Usage example:
// import Modal from './Modal';
//
// function App() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//
//   return (
//     <div>
//       <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <h3 className="font-bold text-lg">Modal Title</h3>
//         <p className="py-4">Modal content goes here</p>
//       </Modal>
//     </div>
//   );
// }
