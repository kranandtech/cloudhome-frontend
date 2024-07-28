import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { appLogout } from "../store/slices/authSlice";

const useGetFileFolders = () => {
  const [fileFolders, setFileFolders] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getFileFolders = useCallback(async (parentId = null) => {
    try {
      const res = await fetch(`${process.env.BACKEND_URL}/api/v1/file-folder`, {
        method: "POST",
        body: JSON.stringify({ parentId }),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        dispatch(appLogout());
        navigate("/login");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error details:', errorData.message || 'Unknown error');
        throw new Error(errorData.message || 'Failed to fetch file folders.');
      }

      const data = await res.json();
      setFileFolders(data.data.fileFolders);

    } catch (error) {
      console.error('Error fetching file folders:', error.message);
    }
  }, [token, dispatch, navigate]);

  return { getFileFolders, fileFolders };
};

export default useGetFileFolders;
