import { useState } from 'react';
import styled from 'styled-components';
import { scrapeData } from '../../utils/axios-service';
import { useDispatch } from 'react-redux';
import { setShouldFetchDataTrue } from '../../redux/models/navItems';

const ScrapeButtonComponent = () => {
    const dispatch = useDispatch();
    const [scrapingInProgress, setScrapingInProgress] = useState(false);

    const handleScrapeClick = async () => {
        if (!scrapingInProgress) {
            setScrapingInProgress(true);
            try {
                await scrapeData();
                console.log('Pobrano dane.');
                console.log('Zaktualizowano dane.');
                dispatch(setShouldFetchDataTrue()); // Ustawienie shouldFetchData na true

            } catch (error) {
                console.error('Error:', error);
            } finally {
                setScrapingInProgress(false);
            }
        }
    };
    return (
        <>

            <ScrapeButton onClick={handleScrapeClick} disabled={scrapingInProgress}>Zaktualizuj dane!</ScrapeButton>
        </>
    );
};
const ScrapeButton = styled.button`

padding: 0;
color: white;
float: right;
font-weight: 600;
font-size: 1rem;
background: none;
border: none;
&:hover{
    cursor: pointer;
    color: violet;
}
`

export default ScrapeButtonComponent;