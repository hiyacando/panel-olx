import { useState, useEffect } from "react";
import { useFormik } from "formik";
import {
  addURL,
  fetchAllUrls,
  associateUrlWithUser,
} from "../../../../utils/axios-service";
import styled from "styled-components";

interface Bookmark {
  bookmark_uuid: string;
  model: string;
  url: string;
  title: string;
}

const BookmarksTabComponent = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllUrls();
        setBookmarks(data);
      } catch (error) {
        console.error("Błąd podczas pobierania zakładek:", error);
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      model: "",
      url: "",
      title: "",
    },
    onSubmit: async (values) => {
      const newBookmark = {
        model: values.model,
        url: values.url,
        title: values.title,
      };

      try {
        const result = await addURL(newBookmark);

        if (result) {
          formik.resetForm();
          console.log("Zakładka dodana do bazy danych");
          const updatedBookmarks = await fetchAllUrls();
          setBookmarks(updatedBookmarks);
        } else {
          console.error("Błąd podczas dodawania zakładki do bazy danych");
        }
      } catch (error) {
        console.error("Błąd podczas dodawania zakładki:", error);
      }
    },
  });

  const handleAssociate = async (bookmark_uuid: string) => {
    try {
      const user_uuid = window.prompt("Wprowadź identyfikator użytkownika:");

      if (user_uuid) {
        const result = await associateUrlWithUser(user_uuid, bookmark_uuid);

        if (result) {
          console.log(
            `Zakładka ${bookmark_uuid} przypisana do użytkownika pomyślnie`,
          );
        } else {
          console.error(
            `Nie udało się przypisać zakładki ${bookmark_uuid} do użytkownika`,
          );
        }
      } else {
        console.log(
          "Użytkownik anulował operację lub nie wprowadził identyfikatora użytkownika.",
        );
      }
    } catch (error) {
      console.error("Błąd podczas przypisywania URL:", error);
    }
  };

  return (
    <Wrapper>
      <h2>Dodaj URL do bazy danych</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="model">Model:</label>
          <input
            type="text"
            id="model"
            name="model"
            onChange={formik.handleChange}
            value={formik.values.model}
          />
        </div>
        <div>
          <label htmlFor="url">URL:</label>
          <input
            type="text"
            id="url"
            name="url"
            onChange={formik.handleChange}
            value={formik.values.url}
          />
        </div>
        <div>
          <label htmlFor="title">Tytuł:</label>
          <input
            type="text"
            id="title"
            name="title"
            onChange={formik.handleChange}
            value={formik.values.title}
          />
        </div>
        <div></div>

        <div>
          <button type="submit">Dodaj do bazy danych</button>
        </div>
      </form>

      <h2>Lista dodanych URL-i</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Model</TableHeader>
            <TableHeader>URL</TableHeader>
            <TableHeader>Tytuł</TableHeader>
            <TableHeader>Akcje</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookmarks.map((bookmark, index) => (
            <TableRow key={index}>
              <TableData>{bookmark.model}</TableData>
              <TableData></TableData>
              <TableData>{bookmark.title}</TableData>
              <TableData>
                <AssociateButton
                  onClick={() => handleAssociate(bookmark.bookmark_uuid)}
                >
                  Przypisz do użytkownika
                </AssociateButton>
              </TableData>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Wrapper>
  );
};
const AssociateButton = styled.button`
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;
  padding: 0.2rem 0.5rem;
  border: none;
  color: white;
  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const Wrapper = styled.div``;
const TableData = styled.td`
  color: white;
  text-align: center;
  padding: 0;
  line-height: 1.35rem;
  padding: 0 0.5rem;
  &.hover-pointer:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 0.5rem;
  }
`;
const TableBody = styled.tbody``;
const TableHeader = styled.th`
  margin-bottom: 1rem;
`;

const TableRow = styled.tr`
  border-radius: 1rem;

  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
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
export default BookmarksTabComponent;
