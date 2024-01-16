import { useState } from "react";
import { scrapeData } from "../../utils/axios-service";
import { useDispatch, useSelector } from "react-redux";
import { setShouldFetchDataTrue, selectSelectedModel } from "../../redux/models/navItems";
import Button from "./UI/Button";

const ScrapeButtonComponent = () => {
  const dispatch = useDispatch();
  const selectedModel = useSelector(selectSelectedModel);
  const [scrapingInProgress, setScrapingInProgress] = useState(false);

  const handleScrapeClick = async () => {
    if (!scrapingInProgress) {
      setScrapingInProgress(true);
      try {
        await scrapeData(selectedModel);
        console.log("Pobrano dane.");
        console.log("Zaktualizowano dane.");
        dispatch(setShouldFetchDataTrue());
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setScrapingInProgress(false);
      }
    }
  };

  return (
    <>
      <Button
        text="Zaktualizuj dane!"
        onClick={handleScrapeClick}
        disabled={scrapingInProgress}
      />
    </>
  );
};

export default ScrapeButtonComponent;
