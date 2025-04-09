// components/Modal.tsx
"use client"
import React from "react";

type ModalProps = {
    // isOpen: boolean;
    onClose: () => void;
};

const Modal = ({ onClose }: ModalProps) => {


    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center transition delay-150 duration-300 ease-in-out"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded shadow-md"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold mb-2">Simple Modal</h2>
                <p>This is a basic modal box.</p>
                <button
                    className="mt-4 px-3 py-1 bg-red-500 text-white rounded"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;
