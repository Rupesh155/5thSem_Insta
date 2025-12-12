// // MainPage.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "./SideBar";
// import { useNavigate } from "react-router-dom";

// const MainPage = () => {
//   const [posts, setPosts] = useState([]);
//   const [likedPosts, setLikedPosts] = useState(new Set());
//   const [savedPosts, setSavedPosts] = useState(new Set());
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // 🔒 Agar token nahi hai to login page pe bhej do
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/"); // login page
//     }
//   }, [navigate]);

//   // 🟢 Backend se posts fetch karo
//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;

//         const res = await axios.get("http://localhost:4000/upload", {
//           headers: {
//             Authorization: token, // backend me req.headers.authorization directly use ho raha hai
//           },
//         });

//         // Backend se: imgUrl, user:{name}, likeCount...
//         const mapped = res.data.map((p) => ({
//           _id: p._id,
//           ImgUrl: p.imgUrl,
//           name: p.user?.name || "unknown_user",
//           likeCount: p.likeCount || 0,
//         }));

//         setPosts(mapped);
//       } catch (err) {
//         console.error("FETCH POSTS ERROR:", err);
//         if (err.response?.status === 401) {
//           localStorage.removeItem("token");
//           navigate("/");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPosts();
//   }, [navigate]);

//   // ✅ REAL like/unlike using backend /like/:id
//   const handleLike = async (id) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("Please login first!");
//       navigate("/");
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `http://localhost:4000/like/${id}`,
//         {},
//         {
//           headers: {
//             Authorization: token, // same as backend auth middleware
//           },
//         }
//       );

//       console.log("LIKE API RES:", res.data);

//       const { likeCount, message } = res.data;

//       // 1️⃣ is post ki likeCount backend ke hisaab se update karo
//       setPosts((prev) =>
//         prev.map((p) =>
//           p._id === id
//             ? {
//                 ...p,
//                 likeCount: likeCount ?? p.likeCount,
//               }
//             : p
//         )
//       );

//       // 2️⃣ Heart icon (liked / unliked)
//       setLikedPosts((prev) => {
//         const updated = new Set(prev);

//         if (message === "Liked") {
//           updated.add(id);
//         } else if (message === "Disliked") {
//           updated.delete(id);
//         } else {
//           // fallback: toggle
//           if (updated.has(id)) updated.delete(id);
//           else updated.add(id);
//         }

//         return updated;
//       });
//     } catch (err) {
//       console.error("LIKE API ERROR:", err);
//       alert("Like failed, check console.");
//     }
//   };

//   const handleSave = (postId) => {
//     setSavedPosts((prev) => {
//       const newSaved = new Set(prev);
//       if (newSaved.has(postId)) newSaved.delete(postId);
//       else newSaved.add(postId);
//       return newSaved;
//     });
//   };

//   return (
//     <div className="bg-black min-h-screen flex">
//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex-1 ml-[245px] flex flex-col items-center overflow-y-auto">
//         <div className="pt-8 flex flex-col items-center w-full max-w-[470px] px-4">
//           {/* Stories */}
//           <div className="w-full bg-[#121212] rounded-lg mb-6">
//             <div className="overflow-x-auto whitespace-nowrap flex gap-4 p-4 hide-scrollbar">
//               {[...Array(10)].map((_, index) => (
//                 <div
//                   key={index}
//                   className="inline-flex flex-col items-center gap-2 shrink-0 cursor-pointer"
//                 >
//                   <div className="gradient-border rounded-full p-[2px]">
//                     <div className="bg-black rounded-full p-[2px]">
//                       <img
//                         className="h-14 w-14 rounded-full object-cover hover:opacity-90 transition"
//                         src={`https://images.unsplash.com/photo-1761839256601-e768233e25e7?q=80&w=2070&auto=format&fit=crop`}
//                         alt="story"
//                       />
//                     </div>
//                   </div>
//                   <p className="text-white text-xs truncate w-16 text-center">
//                     user_{index + 1}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Loading state */}
//           {loading && (
//             <p className="text-gray-400 text-sm text-center">Loading posts...</p>
//           )}

//           {/* No posts */}
//           {!loading && posts.length === 0 && (
//             <p className="text-gray-400 text-sm text-center mt-4">
//               No posts yet. Create your first post!
//             </p>
//           )}

//           {/* Posts */}
//           <div className="w-full space-y-4">
//             {posts.map((post) => (
//               <div
//                 key={post._id}
//                 className="bg-[#121212] rounded-lg overflow-hidden"
//               >
//                 {/* Post Header */}
//                 <div className="flex items-center justify-between p-3">
//                   <div className="flex items-center gap-3">
//                     <div className="gradient-border rounded-full p-[2px]">
//                       <div className="bg-black rounded-full p-[1px]">
//                         <img
//                           className="h-8 w-8 rounded-full object-cover"
//                           src={post.ImgUrl}
//                           alt={post.name}
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <p className="text-white text-sm font-semibold">
//                         {post.name}
//                       </p>
//                       <p className="text-gray-400 text-xs">Original audio</p>
//                     </div>
//                   </div>
//                   <button className="text-white hover:opacity-80">
//                     <svg
//                       aria-label="More options"
//                       fill="currentColor"
//                       height="24"
//                       role="img"
//                       viewBox="0 0 24 24"
//                       width="24"
//                     >
//                       <circle cx="12" cy="12" r="1.5"></circle>
//                       <circle cx="6" cy="12" r="1.5"></circle>
//                       <circle cx="18" cy="12" r="1.5"></circle>
//                     </svg>
//                   </button>
//                 </div>

//                 {/* Post Image */}
//                 <div className="relative aspect-square">
//                   <img
//                     className="w-full h-full object-cover"
//                     src={post.ImgUrl}
//                     alt="post"
//                     onDoubleClick={() => handleLike(post._id)}
//                   />
//                 </div>

//                 {/* Post Actions */}
//                 <div className="p-3">
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="flex items-center gap-4">
//                       <button
//                         onClick={() => handleLike(post._id)}
//                         className="text-white hover:opacity-80"
//                       >
//                         {likedPosts.has(post._id) ? (
//                           <svg
//                             aria-label="Unlike"
//                             fill="#FF3040"
//                             height="24"
//                             role="img"
//                             viewBox="0 0 48 48"
//                             width="24"
//                           >
//                             <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
//                           </svg>
//                         ) : (
//                           <svg
//                             aria-label="Like"
//                             fill="currentColor"
//                             height="24"
//                             role="img"
//                             viewBox="0 0 24 24"
//                             width="24"
//                           >
//                             <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
//                           </svg>
//                         )}
//                       </button>

//                       <button className="text-white hover:opacity-80">
//                         <svg
//                           aria-label="Comment"
//                           fill="currentColor"
//                           height="24"
//                           role="img"
//                           viewBox="0 0 24 24"
//                           width="24"
//                         >
//                           <path
//                             d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                           ></path>
//                         </svg>
//                       </button>

//                       <button className="text-white hover:opacity-80">
//                         <svg
//                           aria-label="Share Post"
//                           fill="currentColor"
//                           height="24"
//                           role="img"
//                           viewBox="0 0 24 24"
//                           width="24"
//                         >
//                           <line
//                             fill="none"
//                             stroke="currentColor"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             x1="22"
//                             x2="9.218"
//                             y1="3"
//                             y2="10.083"
//                           ></line>
//                           <polygon
//                             fill="none"
//                             points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
//                             stroke="currentColor"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                           ></polygon>
//                         </svg>
//                       </button>
//                     </div>

//                     <button
//                       onClick={() => handleSave(post._id)}
//                       className="text-white hover:opacity-80"
//                     >
//                       {savedPosts.has(post._id) ? (
//                         <svg
//                           aria-label="Remove"
//                           fill="currentColor"
//                           height="24"
//                           role="img"
//                           viewBox="0 0 24 24"
//                           width="24"
//                         >
//                           <path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path>
//                         </svg>
//                       ) : (
//                         <svg
//                           aria-label="Save"
//                           fill="currentColor"
//                           height="24"
//                           role="img"
//                           viewBox="0 0 24 24"
//                           width="24"
//                         >
//                           <polygon
//                             fill="none"
//                             points="20 21 12 13.44 4 21 4 3 20 3 20 21"
//                             stroke="currentColor"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                           ></polygon>
//                         </svg>
//                       )}
//                     </button>
//                   </div>

//                   {/* Likes count */}
//                   <p className="text-white text-sm font-semibold mb-1">
//                     {post.likeCount || 0} likes
//                   </p>

//                   {/* Caption */}
//                   <p className="text-white text-sm">
//                     <span className="font-semibold mr-2">{post.name}</span>
//                     Exploring beautiful moments ✨
//                   </p>

//                   {/* Comments text */}
//                   <p className="text-gray-400 text-sm mt-1 cursor-pointer hover:text-gray-300">
//                     View all {Math.floor(Math.random() * 100) + 10} comments
//                   </p>

//                   {/* Timestamp */}
//                   <p className="text-gray-400 text-[10px] mt-1 uppercase">
//                     {Math.floor(Math.random() * 23) + 1} hours ago
//                   </p>
//                 </div>

//                 {/* Add comment */}
//                 <div className="border-t border-gray-800 p-3 flex items-center">
//                   <button className="text-white mr-4">
//                     <svg
//                       aria-label="Emoji"
//                       fill="currentColor"
//                       height="24"
//                       role="img"
//                       viewBox="0 0 24 24"
//                       width="24"
//                     >
//                       <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
//                     </svg>
//                   </button>
//                   <input
//                     type="text"
//                     placeholder="Add a comment..."
//                     className="bg-transparent text-white text-sm flex-1 focus:outline-none placeholder-gray-500"
//                   />
//                   <button className="text-blue-500 text-sm font-semibold opacity-50 hover:opacity-100">
//                     Post
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainPage;




// MainPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./SideBar";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:4000";

const MainPage = () => {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null); // current logged-in user
  const [commentInputs, setCommentInputs] = useState({}); // { postId: "text" }
  const [commentCounts, setCommentCounts] = useState({}); // local counts fallback
  const navigate = useNavigate();

  // 🔒 Agar token nahi hai to login page pe bhej do
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // login page
    } else {
      // try get current user (for userId)
      (async () => {
        try {
          const res = await axios.get(`${API}/me`, {
            headers: { Authorization: token },
          });
          setMe(res.data);
        } catch (err) {
          console.warn("GET /me failed:", err?.response?.data || err.message);
        }
      })();
    }
  }, [navigate]);

  // 🟢 Backend se posts fetch karo
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API}/upload`, {
          headers: {
            Authorization: token, // backend me req.headers.authorization directly use ho raha hai
          },
        });

        // Backend se: imgUrl, user:{name}, likeCount...
        const mapped = res.data.map((p) => ({
          _id: p._id,
          ImgUrl: p.imgUrl,
          name: p.user?.name || "unknown_user",
          likeCount: p.likeCount || 0,
          // agar backend comments ka count deta hai use karo, warna 0
          commentsCount: p.commentsCount ?? 0,
        }));

        // set local commentCounts for quick update after adding comment
        const counts = {};
        mapped.forEach((m) => {
          counts[m._id] = m.commentsCount || 0;
        });
        setCommentCounts(counts);

        setPosts(mapped);
      } catch (err) {
        console.error("FETCH POSTS ERROR:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [navigate]);

  // ✅ REAL like/unlike using backend /like/:id
  const handleLike = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first!");
      navigate("/");
      return;
    }

    try {
      const res = await axios.post(
        `${API}/like/${id}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const { likeCount, message } = res.data;

      setPosts((prev) =>
        prev.map((p) =>
          p._id === id
            ? {
                ...p,
                likeCount: likeCount ?? p.likeCount,
              }
            : p
        )
      );

      setLikedPosts((prev) => {
        const updated = new Set(prev);
        if (message === "Liked") updated.add(id);
        else if (message === "Disliked") updated.delete(id);
        else {
          if (updated.has(id)) updated.delete(id);
          else updated.add(id);
        }
        return updated;
      });
    } catch (err) {
      console.error("LIKE API ERROR:", err);
      alert("Like failed, check console.");
    }
  };

  const handleSave = (postId) => {
    setSavedPosts((prev) => {
      const newSaved = new Set(prev);
      if (newSaved.has(postId)) newSaved.delete(postId);
      else newSaved.add(postId);
      return newSaved;
    });
  };

  // ============================
  // Comments: frontend handlers
  // ============================

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const postComment = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first!");
      navigate("/");
      return;
    }

    const text = (commentInputs[postId] || "").trim();
    if (!text) {
      alert("Please type a comment.");
      return;
    }

    // userId: prefer using `me` fetched from /me; fallback try localStorage 'user'
    const userId = me?._id ?? JSON.parse(localStorage.getItem("user") || "{}")._id;
    if (!userId) {
      alert("User info missing. Login again.");
      return;
    }

    try {
      // your backend endpoint: POST /:postId  (body: { text, userId })
      const res = await axios.post(
        `${API}/${postId}`,
        { text, userId },
        { headers: { Authorization: token } }
      );

      // success
      console.log("COMMENT API RES:", res.data);

      // clear input for that post
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));

      // optimistic increment of local comment count
      setCommentCounts((prev) => ({
        ...prev,
        [postId]: (prev[postId] || 0) + 1,
      }));

      // optionally show small success msg
      // alert("Comment posted!");
    } catch (err) {
      console.error("POST COMMENT ERROR:", err?.response ?? err.message);
      alert("Comment failed — check console.");
    }
  };

  return (
    <div className="bg-black min-h-screen flex">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-[245px] flex flex-col items-center overflow-y-auto">
        <div className="pt-8 flex flex-col items-center w-full max-w-[470px] px-4">
          {/* Stories */}
          <div className="w-full bg-[#121212] rounded-lg mb-6">
            <div className="overflow-x-auto whitespace-nowrap flex gap-4 p-4 hide-scrollbar">
              {[...Array(10)].map((_, index) => (
                <div
                  key={index}
                  className="inline-flex flex-col items-center gap-2 shrink-0 cursor-pointer"
                >
                  <div className="gradient-border rounded-full p-[2px]">
                    <div className="bg-black rounded-full p-[2px]">
                      <img
                        className="h-14 w-14 rounded-full object-cover hover:opacity-90 transition"
                        src={`https://images.unsplash.com/photo-1761839256601-e768233e25e7?q=80&w=2070&auto=format&fit=crop`}
                        alt="story"
                      />
                    </div>
                  </div>
                  <p className="text-white text-xs truncate w-16 text-center">
                    user_{index + 1}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <p className="text-gray-400 text-sm text-center">Loading posts...</p>
          )}

          {/* No posts */}
          {!loading && posts.length === 0 && (
            <p className="text-gray-400 text-sm text-center mt-4">
              No posts yet. Create your first post!
            </p>
          )}

          {/* Posts */}
          <div className="w-full space-y-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-[#121212] rounded-lg overflow-hidden"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div className="gradient-border rounded-full p-[2px]">
                      <div className="bg-black rounded-full p-[1px]">
                        <img
                          className="h-8 w-8 rounded-full object-cover"
                          src={post.ImgUrl}
                          alt={post.name}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">
                        {post.name}
                      </p>
                      <p className="text-gray-400 text-xs">Original audio</p>
                    </div>
                  </div>
                  <button className="text-white hover:opacity-80">
                    <svg
                      aria-label="More options"
                      fill="currentColor"
                      height="24"
                      role="img"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <circle cx="12" cy="12" r="1.5"></circle>
                      <circle cx="6" cy="12" r="1.5"></circle>
                      <circle cx="18" cy="12" r="1.5"></circle>
                    </svg>
                  </button>
                </div>

                {/* Post Image */}
                <div className="relative aspect-square">
                  <img
                    className="w-full h-full object-cover"
                    src={post.ImgUrl}
                    alt="post"
                    onDoubleClick={() => handleLike(post._id)}
                  />
                </div>

                {/* Post Actions */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post._id)}
                        className="text-white hover:opacity-80"
                      >
                        {likedPosts.has(post._id) ? (
                          <svg
                            aria-label="Unlike"
                            fill="#FF3040"
                            height="24"
                            role="img"
                            viewBox="0 0 48 48"
                            width="24"
                          >
                            <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                          </svg>
                        ) : (
                          <svg
                            aria-label="Like"
                            fill="currentColor"
                            height="24"
                            role="img"
                            viewBox="0 0 24 24"
                            width="24"
                          >
                            <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                          </svg>
                        )}
                      </button>

                      <button className="text-white hover:opacity-80">
                        <svg
                          aria-label="Comment"
                          fill="currentColor"
                          height="24"
                          role="img"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <path
                            d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                            fill="none"
                            stroke="currentColor"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          ></path>
                        </svg>
                      </button>

                      <button className="text-white hover:opacity-80">
                        <svg
                          aria-label="Share Post"
                          fill="currentColor"
                          height="24"
                          role="img"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <line
                            fill="none"
                            stroke="currentColor"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            x1="22"
                            x2="9.218"
                            y1="3"
                            y2="10.083"
                          ></line>
                          <polygon
                            fill="none"
                            points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                            stroke="currentColor"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          ></polygon>
                        </svg>
                      </button>
                    </div>

                    <button
                      onClick={() => handleSave(post._id)}
                      className="text-white hover:opacity-80"
                    >
                      {savedPosts.has(post._id) ? (
                        <svg
                          aria-label="Remove"
                          fill="currentColor"
                          height="24"
                          role="img"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path>
                        </svg>
                      ) : (
                        <svg
                          aria-label="Save"
                          fill="currentColor"
                          height="24"
                          role="img"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <polygon
                            fill="none"
                            points="20 21 12 13.44 4 21 4 3 20 3 20 21"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          ></polygon>
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Likes count */}
                  <p className="text-white text-sm font-semibold mb-1">
                    {post.likeCount || 0} likes
                  </p>

                  {/* Caption */}
                  <p className="text-white text-sm">
                    <span className="font-semibold mr-2">{post.name}</span>
                    Exploring beautiful moments ✨
                  </p>

                  {/* Comments text */}
                  <p
                    className="text-gray-400 text-sm mt-1 cursor-pointer hover:text-gray-300"
                    // you can replace with actual navigation to post details
                  >
                    View all {commentCounts[post._id] ?? Math.floor(Math.random() * 100) + 10} comments
                  </p>

                  {/* Timestamp */}
                  <p className="text-gray-400 text-[10px] mt-1 uppercase">
                    {Math.floor(Math.random() * 23) + 1} hours ago
                  </p>
                </div>

                {/* Add comment */}
                <div className="border-t border-gray-800 p-3 flex items-center gap-3">
                  <button className="text-white mr-2">
                    <svg
                      aria-label="Emoji"
                      fill="currentColor"
                      height="24"
                      role="img"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
                    </svg>
                  </button>

                  <input
                    value={commentInputs[post._id] ?? ""}
                    onChange={(e) => handleCommentChange(post._id, e.target.value)}
                    type="text"
                    placeholder="Add a comment..."
                    className="bg-transparent text-white text-sm flex-1 focus:outline-none placeholder-gray-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        postComment(post._id);
                      }
                    }}
                  />
                  <button
                    onClick={() => postComment(post._id)}
                    className="text-blue-500 text-sm font-semibold opacity-90 hover:opacity-100"
                  >
                    Post
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;

