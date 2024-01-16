import { useEffect, useState } from "react";
import styled from "styled-components";
import DataTable from "./DataTableComponent";
import { useSelector, useDispatch } from "react-redux";
import {
  selectNavItems,
  selectSelectedModel,
  setSelectedModel,
} from "../../redux/models/navItems";
import {
  addURL,
  fetchAllUrls,
  
} from "../../utils/axios-service";
import BookmarkNavComponent from "./BookmarkNavComponent";
import { useFormik } from "formik";

interface Bookmark {
  bookmark_uuid: string;
  model: string;
  url: string;
  title: string;
}
const PanelComponent = () => {
  const dispatch = useDispatch();
  const selectedModel = useSelector(selectSelectedModel);
  const navItems = useSelector(selectNavItems);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    if (!selectedModel && navItems.length > 0) {
      dispatch(setSelectedModel(navItems[0].model));
    }
    const fetchData = async () => {
      try {
        const data = await fetchAllUrls();
        setBookmarks(data);
      } catch (error) {
        console.error("Błąd podczas pobierania zakładek:", error);
      }
    };

    fetchData();
  }, [selectedModel, navItems, dispatch]);

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
  return (
    <>
      <MainContainer>

      <div className="Cipa">
      
      <MainWrapper>
      <BookmarkNavComponent/>
    <div className="chuj">
      <BookmarksWrapper>
        <CreateBookmark>
      <text>Utwórz nową zakładke:</text>
      <form>
      <div className="bookmarks">
        <label>Model:</label>
        <input placeholder="iphone-11-pro"/>
      </div>
      <div>
        <label>URL:</label>
        <input placeholder="URL z OLX.PL"/>
      </div>
      <div>
        <label>Nazwa:</label>
        <input placeholder="IPhone 11 Pro"/>
      </div>
      </form>
      </CreateBookmark>
      </BookmarksWrapper>
          <DataTable/>
          </div>
          </MainWrapper>
          </div>
        </MainContainer>
    </>
  );
};
const CreateBookmark = styled.div`
`
const BookmarksWrapper = styled.div`
background: #f8f9fa;
padding: 0;
display: flex;
flex-direction: column;
text{
  font-size: 0.9rem;

}
form{
  font-size: 0.9rem;
  padding: 0;
  display: flex;
  justify-content: left;
  
  input{
    
    width: 5rem;
    border: none;
    padding: 0rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 6rem;
    margin-right: 0.5rem;

  }
  div{
    display: flex;
    flex-direction: column;
    
  }
}
`
const MainWrapper = styled.div`
display: block;
flex: 1;
flex-grow: 1;
margin-top: 0.5rem;
.chuj{
  background: #f8f9fa;
  padding: 0 1.5rem;
  max-width: 100%;
  
}
`
const MainContainer = styled.div`

  margin-right: auto;
  margin-left: auto;
  padding: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  
  width: 100%;

  .Cipa{
    display: flex;
    flex-grow: 1;
    
  }

`;

export default PanelComponent;
