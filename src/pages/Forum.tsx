import { collection, onSnapshot } from "@firebase/firestore";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useState } from "react";
import { ForumGroup } from "../components/ForumGroup";
import { ForumGroupPopUp } from "../components/ForumGroupPopUp";
import { PopUpLogin } from "../components/PopUpLogin";
import { DB_ForumGroup } from "../types/DBService.types";
import { dbService } from "../utils/firebase";
import { isLoggedIn } from "../utils/utils";

export const Forum: React.FC = () => {
  const [forumGroup, setForumGroup] = useState<DB_ForumGroup[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState(false);

  const loadForumGroup = async (docs: any) => {
    let arr: DB_ForumGroup[] = [];

    for (const doc of docs) {
      if (doc.exists) {
        const data: DB_ForumGroup = {
          enName: doc.get("enName"),
          views: doc.get("views"),
          posts: doc.get("posts"),
          korName: doc.get("korName"),
        };

        arr.push(data);
      }
    }

    setForumGroup([...arr]);
    setLoading(false);
  };

  const handleMenuOpen = () => {
    if (!isLoggedIn()) {
      setMenuOpen(false);
      setLoginMode(true);
    } else {
      setMenuOpen(true);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  useEffect(() => {
    setLoading(true);
    setMenuOpen(false);
    onSnapshot(collection(dbService, "forumGroup"), (ref) => {
      loadForumGroup(ref.docs);
    });

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto pb-20">
      {!loading ? (
        <>
          <section className="w-full flex items-center justify-between mb-5">
            <h1 className="text-3xl font-medium">?????????</h1>
          </section>
          <section className="relative w-full h-80  flex flex-col justify-center items-center  ">
            <div className="bg-green-500 absolute top-0 left-0 w-full h-full bg-cover bg-center filter blur-sm "></div>
            <h1 className="z-10 text-6xl font-semibold mb-5 ">?????? ?????????</h1>
            <h2 className="z-10 text-lg font-medium">
              ?????????, ??????, ??????, ?????????, ?????????, ????????? ????????? ???????????????
              ??????????????? ??????????????????.
            </h2>
          </section>
          <section className="w-full flex justify-end items-center mt-5">
            <button
              onClick={handleMenuOpen}
              className="relative bg-blue-800 text-white px-5 py-3 hover:opacity-70 transition-all"
            >
              ????????? ????????????
            </button>
          </section>
          <section className="mt-5">
            {forumGroup.length > 0 &&
              forumGroup.map((elem, index) => (
                <ForumGroup {...elem} key={index} />
              ))}
          </section>
          {/* ????????? ?????? ????????? ????????? ???????????? ?????? ??? ????????? ?????? ?????? ???????????? */}
          {forumGroup.length > 0 && menuOpen && (
            <ForumGroupPopUp
              setMenuOpen={setMenuOpen}
              forumGroup={forumGroup}
            />
          )}
          {loginMode && (
            <PopUpLogin
              popUpLoginMode={loginMode}
              setPopUpLoginMode={setLoginMode}
            />
          )}
        </>
      ) : (
        <div className="w-full  text-center">
          <FontAwesomeIcon
            icon={faCircleNotch}
            className="text-5xl animate-spin text-blue-500"
          />
        </div>
      )}
    </div>
  );
};
