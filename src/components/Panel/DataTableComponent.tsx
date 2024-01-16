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
import ScrapeButtonComponent from "./ScrapeButtonComponent";

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
    (state: RootState) => state.navItems.shouldFetchData
  );
  const dispatch = useDispatch();

  const [data, setData] = useState<ItemData[]>([]);
  const [truncateLength, setTruncateLength] = useState<number>(
    window.innerWidth < 768 ? 24 : 80
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleResize = () => {
    setTruncateLength(window.innerWidth < 768 ? 24 : 80);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (selectedModel && shouldFetchData) {
      fetchAndSetData(selectedModel);
    }
    dispatch(setShouldFetchData(false));
  }, [selectedModel, shouldFetchData]);

  useEffect(() => {
    console.log("Data has changed. Triggering re-render...");
  }, [data]); 

  const fetchAndSetData = async (selectedModel: string) => {
    try {
      const fetchedData = await fetchProductsData(selectedModel);
      console.log("Fetched Data:", fetchedData[0]);
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLinkClick = async (link: string) => {
    try {
      await recordClick(user.user_uuid, link);
      const updatedStatus = await fetchProductStatus(link);
      const updatedData = data.map((item) =>
        item.link === link ? { ...item, status: updatedStatus } : item
      );
      setData(updatedData);
    } catch (error) {
      console.error("Error recording click:", error);
    }
  };

  const parsePrice = (price: string) => {
    return parseFloat(price) || 0;
  };
  
  const handleSort = async () => {
    console.log("Data Before Sorting:", data);
  
    const sortedData = [...data].sort((a, b) => {
      const priceA = parsePrice(a.price);
      const priceB = parsePrice(b.price);
  
      if (sortOrder === "asc") {
        return priceA - priceB;
      } else {
        return priceB - priceA;
      }
    });
  
    console.log("Data After Sorting:", sortedData);
  
    await new Promise((resolve) => setTimeout(resolve, 500));
  
    setData(sortedData);
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
  };
  return (
    <>
      <DataTableWrapper>
        <ScrapeButtonComponent />

        <Scrollbars
          autoHide
          className="dupa"
          marginHeight={0}
          style={{
            height: "calc(100vh - 15rem)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <table>
            <thead>
              <tr>
                <th>Link</th>
                <th>Tytuł</th>
                <th onClick={handleSort} className="sort">Cena</th>
                <th>Uszkodzenia</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>
                    <a
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
                      Otwórz
                    </a>
                  </td>
                  <td>{truncateText(item.title, truncateLength)}</td>
                  <td>{item.price} zł</td>
                  <td>{item.is_damaged ? "Tak" : "Brak"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Scrollbars>
      </DataTableWrapper>
    </>
  );
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};
const DataTableWrapper = styled.div`
  border: 1px solid #dee2e6;
  border-bottom: none;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-width: 90rem;
  .thumb-vertical {
    display: none;
  }
  a {
    color: #212529;
    text-decoration: none;
    :active {
      color: #cb8849;
    }
    &:visited {
      color: #cb8849;
    }
  }
  a.green {
    color: #212529;
  }
  a.red {
    color: #cb8849;
  }
  td {
    color: #212529;
    text-align: center;
    line-height: 1rem;
    height: 2rem;
    word-break: break-all;
    white-space: nowrap;
    border-bottom: 1px solid #dee2e6;
    font-size: 0.8rem;
  }
  tr {
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
  table {
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
  }
  th {
    font-weight: 500;
    font-size: 0.8rem;
    background: #e9ecef;
    border-collapse: none;
    padding: 0.5rem 0;
    height: 1.75rem;
    position: sticky;
    top: 0;
    z-index: 1;
  }
  th.sort{
    &:hover{
      cursor: pointer;
      font-weight: bolder;
    
    }
  }
  thead {
    border-collapse: none;
  }
  tbody {
    height: 10px;
  }
`;

export default DataTable;
