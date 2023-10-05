import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../redux/models/user";

import {
  fetchProductsData,
  recordClick,
  fetchProductStatus,
} from "../../utils/axios-service";
import { RootState } from "../../redux/store";
import {
  setShouldFetchData,
  selectSelectedModel,
} from "../../redux/models/navItems";

interface ItemData {
  link: string;
  title: string;
  price: string;
  is_damaged: boolean;
  status: string;
}

const DataTable: React.FC = () => {
  const selectedModel = useSelector(selectSelectedModel);
  const user = useSelector(selectUser);
  const shouldFetchData = useSelector(
    (state: RootState) => state.navItems.shouldFetchData,
  );
  const dispatch = useDispatch();
  const [data, setData] = useState<ItemData[]>([]);

  useEffect(() => {
    if (selectedModel && shouldFetchData) {
      fetchAndSetData(selectedModel);
    }
    dispatch(setShouldFetchData(false));
  }, [selectedModel, shouldFetchData]);

  const fetchAndSetData = async (selectedModel: string) => {
    try {
      const fetchedData = await fetchProductsData(selectedModel);
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLinkClick = async (link: string) => {
    try {
      await recordClick(user.user_uuid, link);
      const updatedStatus = await fetchProductStatus(link);
      const updatedData = data.map((item) => {
        if (item.link === link) {
          return {
            ...item,
            status: updatedStatus,
          };
        }
        return item;
      });
      setData(updatedData);
    } catch (error) {
      console.error("Error recording click:", error);
    }
  };

  return (
    <>
      <Scrollbars style={{ minWidth: 300, minHeight: 690, maxHeight: 700 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Link</TableHeader>
              <TableHeader>Tytuł</TableHeader>
              <TableHeader>Cena</TableHeader>
              <TableHeader>Uszkodzenia</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableData>
                  <Link
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseDown={() => handleLinkClick(item.link)}
                    className={
                      typeof item.status === "string"
                        ? item.status.toLowerCase()
                        : ""
                    }
                  >
                    Otwórz link
                  </Link>
                </TableData>
                <TableData>{item.title}</TableData>
                <TableData>{item.price} zł</TableData>
                <TableData>{item.is_damaged ? "Tak" : "Brak"}</TableData>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbars>
    </>
  );
};

const Link = styled.a`
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  &.red {
    content: "dupa";
    color: violet;
  }

  &.green {
    color: white;
  }

  &.blue {
    color: blue;
  }
  &:hover {
    color: darkgray;
  }
  &:active {
    color: violet;
  }
  &:visited {
    color: violet;
  }
`;

const TableData = styled.td`
  color: white;
  text-align: center;
  padding: 0;
  line-height: 1.35rem;
  padding: 0 0.25rem;
`;

const TableBody = styled.tbody``;

const TableHeader = styled.th``;

const TableRow = styled.tr`
  border-radius: 1rem;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const TableHead = styled.thead`
  color: white;
  text-align: center;
  z-index: 1001;
`;

const Table = styled.table`
  margin-left: auto;
  margin-right: auto;
  border-spacing: 0;
`;

export default DataTable;
