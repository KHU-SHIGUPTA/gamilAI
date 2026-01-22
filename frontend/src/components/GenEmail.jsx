import React, { useState } from "react";
import { FaPen } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setOpenGen, setOpen, setOpenAi } from "../redux/appSlice";

const GenEmail = () => {
  const [useSubject, setUseSubject] = useState(true);

  const { openGen, aiSubject, aiMessage } = useSelector((store) => store.app);
  const dispatch = useDispatch();

  if (!openGen) return null;

  return (
    <div className="bg-white max-w-8xl shadow-xl shadow-slate-400 rounded-t-md m-5">
      <div className="p-2">
        <div className="flex items-center justify-between text-black text-2xl font-bold bg-gray-200 p-2">
          <h1>Write with AI</h1>
        </div>

        <div className="mt-4">
          <label className="flex items-center gap-2 mb-3 text-sm">
            <input
              type="checkbox"
              checked={useSubject}
              onChange={() => setUseSubject((prev) => !prev)}
            />
            <span>Use AI generated subject line</span>
          </label>

          {useSubject && (
            <div className="mb-3">
              <h2 className="text-gray-700 text-sm mb-1">Subject</h2>
              <input
                type="text"
                readOnly
                value={aiSubject}
                className="w-full border border-gray-300 rounded-md p-2 outline-none bg-gray-50"
              />
            </div>
          )}

          <div className="mb-3">
            <h2 className="text-gray-700 text-sm mb-1">Email content</h2>
            <textarea
              readOnly
              value={aiMessage}
              rows={10}
              className="w-full border border-gray-300 rounded-md p-2 outline-none bg-gray-50 whitespace-pre-wrap"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => dispatch(setOpenGen(false))}
            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Just close AI modals and open compose;
              // SendEmail will read aiSubject/aiMessage from Redux
              dispatch(setOpenGen(false));
              dispatch(setOpen(true));
              dispatch(setOpenAi(false));
            }}
            className="flex items-center gap-2 px-3 py-2 text-white text-lg rounded-md bg-blue-700 hover:bg-white hover:text-blue-700 border border-blue-700"
          >
            <FaPen />
            Use Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenEmail;
