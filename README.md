# Panel OLX
<p>Panel OLX jest narzędziem usprawniającym proces analizy ogłoszeń i filtrowania w celu zaoszczędzenia czasu. Dodatkowo ułatwia pracę w grupie pozwalając między innymi na oznaczenie ogłoszeń.</p>
<h2>Funkcje</h2>
<ul>
  <li>Autoryzacja użytkowników</li>
  <li>Pobieranie listy ogłoszeń (na ten moment scraping, jak otrzymam dostęp do API olx to przez API) i przetwarzanie danych do tabeli w odpowiedniej zakładce na podstawie URL</li>
  <li>Oznaczanie klikniętych ogłoszeń widoczne dla wszystkich użytkowników</li>
  <li>Panel administracyjny umożliwiający zarządzanie użytkownikami i dodawanie nowych zakładek</li>
</ul>
<h2>Przykład użycia:</h2>
<ol>
  <li>Zarejestruj konto wpisując adres e-mail oraz hasło w zakładce "Rejestracja"</li>
  <li>Poczekaj na weryfikacje konta przez Administratora</li>
  <li>Zaloguj się używając danych logowania</li>
  <li>Po pomyślnym zalogowaniu wybierz interesującą Cię zakładkę</li>
  <li>Następnie zostanie wyświetlona tabela z listą ogłoszeń</li>
  <li>Klikając przycisk "Otwórz link" zostaniesz przekierowany do ogłoszenia, a w Panelu link zostanie oznaczony kolorem fioletowym dla wszystkich użytkowników</li>
  <li>Jeżeli inny użytkownik przeglądał któreś z ogłoszeń, przycisk "Otwórz link" będzie oznaczony kolorem fioletowym</li>
</ol>
<h2>TODO:</h2>
<ul>
  <li>Projekt interfejsu</li>
  <li>Zakładka "Zakładki" w panelu administratora umożliwiająca zarządzanie zakładkami ogłoszeń</li>
  <li>Zakładka "Statystyki" w panelu administratora wyświetlająca statystyki dla wybranego użytkownika (ilość klikniętych ogłoszeń)</li>
  <li>Poprawa funkcjonalności przycisku aktualizacji danych czyli aktualizacja danych tylko i wyłącznie dla wybranej aktualnie przez użytkownika zakładki i limit czasowy 30 min (czyli po odświeżeniu danych żaden użytkownik oprócz administratora nie może przez 30 minut tego zrobić)</li>
  <li>Przycisk umożliwiający wyświetlenie informacji o tym kto i kiedy otworzył dany link</li>
  <li>Funkcja dodawania komentarza dla danego ogłoszenia i oznaczania procesu (np. w trakcie zakupu, kupione, scam, nieaktualne)</li>
  <li>Aktualizacja dokumentacji i dodanie komentarzy w kodzie</li>
  <li>Dodać grupy do ktorych przydzielani sa uzytkownicy (np firma1 firma2) i uzalezniac wyswietlanie informacji dot ogloszen takich jak oznaczrnia do tych grup w celu unikniecia kolizji</li>
  <li>Panel użytkownika</li>
</ul>
