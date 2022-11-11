import { FunctionComponent, useEffect, useRef, useState } from "react";
import { useWindowSize } from "react-use";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styled from "styled-components";
import { theme } from "@gkju/vlo-ui";
import { FaHome } from "react-icons/fa";
import { BsFillPeopleFill, BsNewspaper } from "react-icons/bs";
import {
  AiFillContacts,
  AiFillNotification,
  AiFillFolderOpen,
} from "react-icons/ai";
import { useProfileInfo } from "./Queries";
import { ProfilePicture } from "./ProfilePicture";
import {useSelector} from "react-redux";
import {selectLoggedIn} from "../Redux/Slices/Auth";

interface Item {
  route: string;
  displayName: string;
  icon: JSX.Element;
}

let Items: Array<Item> = [
  {
    route: "/home",
    displayName: "Home",
    icon: <FaHome />,
  },
  {
    route: "/articles",
    displayName: "Kurier",
    icon: <BsNewspaper />,
  },
  {
    route: "/news",
    displayName: "Ogłoszenia",
    icon: <AiFillNotification />,
  },
  {
    route: "/about",
    displayName: "O nas",
    icon: <AiFillContacts />,
  },
  {
    route: "/contact",
    displayName: "Kontakt",
    icon: <BsFillPeopleFill />,
  },
  {
    route: "/me",
    displayName: "Pliki",
    icon: <AiFillFolderOpen />,
  },
];

const ClosestMatch = (Items: Array<Item>, template: string) => {
  let index = 0;
  let length = 0;
  for (let i = 0; i < Items.length; ++i) {
    let itemIndex = 0;
    while (
      itemIndex < Math.min(Items[i].route.length, template.length) &&
      Items[i].route[itemIndex] === template[itemIndex]
    ) {
      ++itemIndex;
    }

    if (itemIndex > length) {
      length = itemIndex;
      index = i;
    }
  }

  return index;
};

export const Menu: FunctionComponent = () => {
  const { width, height } = useWindowSize();
  const refs = useRef<HTMLDivElement[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  const [highlighterIndex, setIndex] = useState(0);
  const { data, isLoading } = useProfileInfo();
  let loggedIn: boolean = useSelector(selectLoggedIn);

  const horizontal = width < 800;

  useEffect(() => {
    setOffset(
      horizontal
        ? refs.current[highlighterIndex].offsetLeft
        : refs.current[highlighterIndex].offsetTop
    );
  }, [horizontal, width, height]);

  useEffect(() => {
    const index = ClosestMatch(Items, location.pathname);
    setOffset(
      horizontal
        ? refs.current[index].offsetLeft
        : refs.current[index].offsetTop
    );
    setIndex(index);
  }, [location.pathname]);

  // if items length is non const
  // useEffect(() => {
  //    refs.current = refs.current.slice(0, Items.length);
  // }, [Items.length]);

  return (
    <MenuBase $mobile={horizontal}>
      {!horizontal && (
        <LogoDiv onPointerUp={() => navigate("/home")}>
          VLO<p className="font-bold">BOARDS</p>
        </LogoDiv>
      )}

      <MenuHighlighter
        $mobile={horizontal}
        as={motion.div}
        animate={horizontal ? { x: offset } : { y: offset }}
        transition={{ type: "spring", mass: 1, damping: 15, stiffness: 150 }}
      />
      {Items.map((item, index) => (
        <MenuItem
          $mobile={horizontal}
          onClick={() => navigate(item.route)}
          animate={{ opacity: highlighterIndex === index ? 1 : 0.3 }}
          as={motion.div}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          key={index}
          ref={(el: HTMLDivElement | null) =>
            el ? (refs.current[index] = el) : <></>
          }
        >
          {horizontal ? item.icon : item.displayName}
        </MenuItem>
      ))}

      {!horizontal && (
        <MenuFooter className="grid items-center justify-items-center grid-rows-[1fr_1fr] grid-cols-[7fr_10fr_1fr] text-white">
          {!loggedIn ? <>
            <motion.button onPointerUp={() => navigate("/Login")} initial={{scale: 1}} whileHover={{scale: 1.1}} className="text-white col-start-5 col-span-2 rounded-xl p-2 -mt-2 w-full">
              Zaloguj się
            </motion.button>
          </> : <>
            <ProfilePicture
                className="p-2 row-span-full w-full"
                Id={data?.data.id ?? ""}
            />
            <div className="col-start-2 text-center self-end">
              <p className="text-[25px] font-bold">{data?.data.userName}</p>
            </div>
            <div className="col-start-2 self-start row-start-2 text-center">
              <p className="text-[7px] text-[#6F6F6F] font-bold">
                {data?.data.email}
              </p>
            </div>
          </>}

        </MenuFooter>
      )}
    </MenuBase>
  );
};

interface MobileProps {
  $mobile: boolean;
}

const MenuFooter = styled.div`
  margin-top: auto;
`;

const LogoDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Lato, sans-serif;
  color: white;
  font-size: 28px;
  font-weight: 300;
  margin: 20px 0;
  cursor: pointer;
`;

const MenuBase = styled.div<MobileProps>`
  background: ${theme.primary};
  @media (color-gamut: p3) {
    background-color: color(display-p3 0.1137254902 0.1137254902 0.1568627451);
  }
  width: ${(props) => (props.$mobile ? "100%" : "200px")};
  height: ${(props) => (!props.$mobile ? "100%" : "70px")};
  z-index: 1;
  position: fixed;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: ${(props) => (props.$mobile ? "row" : "column")};
  justify-content: ${(props) =>
    props.$mobile ? "space-around" : "flex-start"};
  bottom: ${(props) => (props.$mobile ? "0" : "")};
  align-items: center;
  overflow: hidden;
  font-family: Raleway, sans-serif;
  font-weight: 700;
  font-size: 18px;
  box-shadow: 4px 4px 18px rgba(0, 0, 0, 0.25);
`;

const MenuHighlighter = styled.div<MobileProps>`
  position: absolute;
  background: ${theme.complementary};
  width: ${(props) => (props.$mobile ? "50px" : "170px")};
  height: ${(props) => (props.$mobile ? "50px" : "40px")};
  border-radius: 10px;
  z-index: 0;
  top: ${(props) => (props.$mobile ? "" : "0")};
  left: ${(props) => (!props.$mobile ? "" : "0")};
  cursor: pointer;
`;

const MenuItem = styled.div<MobileProps>`
  background: transparent;
  width: ${(props) => (props.$mobile ? "50px" : "170px")};
  height: ${(props) => (!props.$mobile ? "40px" : "100%")};
  margin-top: ${(props) => (props.$mobile ? "0" : "20px")};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  font-size: ${(props) => (props.$mobile ? "35px" : "")};
  cursor: pointer;
  z-index: 1;
  opacity: 0.3;
  -webkit-tap-highlight-color: transparent;
`;
