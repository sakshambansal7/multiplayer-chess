export const Button = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => {
    return (
        <button
            onClick={onClick}
            className="bg-green-500 text-2xl hover:bg-green-600 text-white font-bold py-4 px-8 rounded"
        >
            {children}
        </button>
    );
};
