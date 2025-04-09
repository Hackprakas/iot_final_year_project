// components/OpenModalButton.tsx
"use client"
import React from "react";

type ButtonProps = {
    onClick: () => void;
};

const OpenModalButton = ({ onClick }: ButtonProps) => {
    return (
        <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={onClick}
        >
            Open Modal
        </button>
    );
};

export default OpenModalButton;
