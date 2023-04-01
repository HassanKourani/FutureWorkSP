import { collection, getDocs } from "@firebase/firestore";
import { Accordion, AccordionItem as Item } from "@szhsin/react-accordion";
import { db } from "../Config";
import { useParams } from "react-router";
import { useState } from "react";
import styles from "./AccordionFolder.module.css";
import chevronDown from "./Chevron-down.svg";

const AccordionItem = ({ header, ...rest }) => (
  <Item
    {...rest}
    header={
      <>
        {header}
        <img className={styles.chevron} src={chevronDown} alt="Chevron Down" />
      </>
    }
    className={styles.item}
    buttonProps={{
      className: ({ isEnter }) =>
        `${styles.itemBtn} ${isEnter && styles.itemBtnExpanded}`,
    }}
    contentProps={{ className: styles.itemContent }}
    panelProps={{ className: styles.itemPanel }}
  />
);

const AccordionFolder = ({ folder }) => {
  const uid = useParams().uid;
  const [materials, setMaterials] = useState();

  getDocs(
    collection(db, "collaborations", uid, "folders", folder.id, "materials")
  ).then((docs) =>
    setMaterials(
      docs.docs.map((material) => (
        <li className="p-2" key={material.id}>
          {material.data().name}
        </li>
      ))
    )
  );
  return (
    <>
      <AccordionItem header={folder.folderName}>
        <ul>{materials}</ul>
      </AccordionItem>
    </>
  );
};

export default AccordionFolder;
