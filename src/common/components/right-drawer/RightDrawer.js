const RightDrawer = ({ isOpen, heading, onClose, children }) => {
  return (
    <>
      <div
        className={`dark:bg-gray-800 fixed right-0 top-0 z-40 h-screen w-[80%] max-w-[80vw] overflow-y-auto rounded-lg bg-white px-5 py-4 transition-transform ${
          isOpen ? 'transform-none' : 'translate-x-full'
        }`}
        tabIndex="-1"
      >
        <h5
          id="drawer-right-label"
          className="dark:text-gray-400 inline-flex items-center text-lg font-semibold text-gray-900"
        >
          {heading}
        </h5>
        <button
          type="button"
          className="dark:hover:bg-gray-600 dark:hover:text-white absolute end-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
          onClick={onClose}
        >
          <svg
            className="h-3 w-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <div className="mb-4 mt-4 w-full border border-gray-100" />

        <div>{children}</div>
      </div>
      {isOpen && (
        <div className="dark:bg-gray-900/80 fixed inset-0 z-30 bg-gray-900/50" onClick={onClose}></div>
      )}
    </>
  );
};

export default RightDrawer;
