# Front-end
- [Pages](./documentation_front-end_Luuk_Hulshof.md#pages)
  - [Home](./documentation_front-end_Luuk_Hulshof.md#home)
  - [About](./documentation_front-end_Luuk_Hulshof.md#about)
  - [Chairs](./documentation_front-end_Luuk_Hulshof.md#chairs)
  - [Chair_Info](./documentation_front-end_Luuk_Hulshof.md#chairinfo)
- [Components](./documentation_front-end_Luuk_Hulshof.md#Components)
    - [Chair_Menu](./documentation_front-end_Luuk_Hulshof.md#chairmenu)
    - [FilterSideBar](./documentation_front-end_Luuk_Hulshof.md#filtersidebar)
    - [NavBar](./documentation_front-end_Luuk_Hulshof.md#navbar)



# Pages
## Home

Op de home screen wordt alleen een welkom bericht ingeladen.

## About

Op de about screen wordt ook alleen een berichtje laten zien van de developer van de website

## Chairs
Bij de chairs pagina worden de stoelen gecreëerd, geupdate, verwijderd en opgehaald, deze stoelen worden ingeladen door
middle van deze functie:

Voorbeeld stoelen ophalen:
```javascript 
const getChairs = async () => {
    const response = await fetch("http://localhost:5555/chairs/" + $filters, {
        method: 'GET',
        contentType: 'application/json',
    })
    if (!response.ok) {
        return alert(await response.text());
    }
    chairs = await response.json();
}
```
Met deze functie zorgen we ervoor dat alle stoelen worden ingeladen met of zonder filters/zoek termen. Dit doen we met de fetch api die naar de backend fetched om data op te halen. Wat we terug krijgen kan dan
een http error zijn of succesvolle data. Deze http-error wordt in de backend bepaalt om zo in de front-end het laten te
zien. Bij deze fetch hoeft de gebruiker nog niet ingelogd te zijn, omdat de gebruiker wel stoelen mag zien, maar niet op
ze mag bieden.

Voorbeeld stoelen maken:
```javascript
    const createChair = async (data) => {
        const response = await fetch("http://localhost:5555/chairs", {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + $token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data})
        })
        if (!response.ok) {

            return alert(await response.text());
        }
        console.log(await response.json())
        chairs.push(data);
        await getChairs()
        toggleChairMenu()
    }
```
Deze functie zorgt ervoor dat de admins van de website een stoel veiling kan worden aangemaakt. Bij het creeren is er
data nodig vanuit html. Als er een data veld leeg is stuurt de back-end een http-error terug van welke data veld leeg is
gelaten. Voor deze fetch moet de gebruiker/admin wel ingelogd zijn, anders geeft de back-end een http error terug.

Voorbeeld stoelen updaten
```javascript
    const saveChair = async (oldData, newData) => {
        let data;
        data = await compareData(oldData, newData);
        const response = await fetch("http://localhost:5555/chairs/", {
            method: 'PUT',
            mode: "cors",
            headers: {
                'Authorization': 'Bearer ' + $token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data})
        })
        if (!response.ok) {
            return alert(await response.text());
        }
        console.log(await response.json())
        await getChairs()
        toggleChairMenu()
    }
```
Deze functie lijkt heel veel op het creëren van stoelen, maar update een al gemaakt stoel. Eerst gaat de functie op
een andere functie checken wat er aan de data verschilt van de al gemaakte stoel en de nieuwe stoel data. Deze functie
replaced alleen de oude data als er nieuwe data is. Verder is er in de query geen id nodig, omdat dit al in de oude data
zit. Voor deze functie is het nodig om ingelogd te zijn en kan alleen een admin uitvoeren.

Voorbeeld stoelen ophalen met een specifieke id
```javascript
    async function getChairWithId() {
        if(!$currentChairId){
            alert("Current chair doesn't have a valid id: " + $currentChairId)
        }
        const response = await fetch("http://localhost:5555/chairs/" + $currentChairId, {
            method: 'GET',
            contentType: 'application/json',
        })
        if (!response.ok) {
            return alert(await response.text());
        }
        return response.json();
    }
```
Net zoals bij het normaal ophalen van de stoelen haalt deze functie ook een stoel op, alleen zoekt het naar
een specifieke id.

## ChairInfo
Deze pagina laat een stoel zien met een naam, start prijs, einddatum, een descriptie en het aantal biedingen op de 
stoel. Gebruikers en admins kunnen op deze pagina bieden op de aangegeven stoel. 

Voorbeeld van het toevoegen van een bod
```javascript
    async function addBid() {
        if(bidAmount <= 0){
            return alert("Bid can't be equal or lower than 0")
        }
        const date = new Date();
        const data = {
            userId: $userId,
            userName: $userName,
            chairId: $currentChairId,
            bidAmount: bidAmount,
            date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
        }
        const response = await fetch("http://localhost:5555/chairs/bid", {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + $token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data})
        })
        if (!response.ok) {

            return alert(await response.text());
        }
        await response.json();
        await GetChairById();

    }
```
Deze functie laat zien hoe een gebruiker vanuit de front-end een bod kan toevoegen. Als eerst wordt er een aantal checks gedaan
of de data wel klopt die we sturen. De data mag namelijk nooit null of undevined zijn. Het geboden geld mag ook nooit 0
of lager zijn en in de back-end worden er nog een extra aantal checks gemaakt over het geboden geld. Bij het maken van de data wordt er ook een datum gemaakt wanneer de huidige gebruiker het bod heeft
verstuurd. Voor deze functie moet de gebruiker ingelogd zijn anders wordt er vanuit de back-end een http-error
verstuurd.

Voorbeeld van het verwijderen van een bod
```javascript
    async function deleteBid(chairId, bidId) {
        const response = await fetch("http://localhost:5555/chairs/" + chairId + "/" + bidId, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + $token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        if (!response.ok) {
            return alert(await response.text());
        }
        await response.json();
        await GetChairById()

    }
```
Bij deze functie kan een gebruiker een bod deleten die hij of zij heeft gekozen. Net zoals bij het maken van een bod
wordt hier eerst gecheckt of de request values wel kloppen. Zo ja, gaat de functie door middel van de id van een stoel 
naar het bod zoeken die van de gebruiker is. Net zoals bij de vorige aantal functies moet de gebruiker voor deze functie
zijn ingelogd.

## Login
Bij deze website is het mogelijk om in te loggen met een email en wachtwoord.

Voorbeeld inloggen met email en wachtwoord
```javascript
    const login = async () => {
        const response = await fetch("http://localhost:5555/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: userEmail,
                password: userPassword
            })
        }).catch((error) =>{
            return alert("There was a unexpected error while logging in: " + error);
        })
        if(!response.ok){
            return alert(await response.text());
        }
        const text = await response.text();
        await userId.set(JSON.parse(text).id)
        await userName.set(JSON.parse(text).username)
        await token.set(JSON.parse(text).token);
        await isAdmin.set(JSON.parse(text).isAdmin)
        router.redirect('/chairs')
    }

    function goToRegisterPage(){
        router.redirect('/register')
    }
```
Bij het inloggen wordt er een fetch gestuurd naar de authentication van de back-end. Hierbij wordt er in de back-end 
heel veel gecheckt zoals de gebruikersnaam en wachtwoord. Als deze fetch succesvol is worden er een aantal store values 
geset. Deze values worden gebruikt over de hele website;
- userId: wordt gebruikt om bids te kunnen deleten.
- userName: wordt gebruikt om bij bids te tonen van wie de bid is.
- token: wordt gebruikt om bij veel functies te checken of de gebruiker is ingelogd.
- isAdmin: wordt gebruikt bij functies die alleen admins mogen gebruiken.


# Components
## ChairMenu
De chair menu is een slot-based component die gebruikt wordt bij het maken en veranderen van stoelen.

Voorbeeld van een ChairMenu
```html
<ChairMenu>
  <button slot="cancelButton" class="cancelButton" on:click={toggleChairMenu}>X</button>
  <h1 slot="title">Editing a chair auction</h1>
  <input slot="chairName" placeholder={oldChair.name} bind:value={chairObject.name}>>
  <input slot="chairDescription" placeholder={oldChair.description} bind:value={chairObject.description}>>
  <select slot="chairColor" bind:value={chairObject.color}>
    <option selected="selected">none</option>
    {#each colors as color}
    <option>{color}</option>
    {/each}</select>
  <input slot="chairPrice" type="number" placeholder={oldChair.price} bind:value={chairObject.price}>>
  <input slot="chairDate" type="text" placeholder={oldChair.endsBy} onfocus="(this.type = 'date')" id="date" bind:value={chairObject.endsBy}>>
  <button slot="saveChair" type="button" on:click={() => saveChair(oldChair, chairObject)}>Save
  </button>
</ChairMenu>
```
Elk element heeft bij een Chair Menu een slot value, waardoor het erg makkelijk is om te hergebruiken.  Bij dit
voorbeeld wordt er een stoel aangepast die al values heeft. 

## FilterSideBar
De FilterSideBar wordt ook gebruikt bij de stoelen, maar dan alleen voor het filteren van de stoelen.
```javascript
    function addFilters(isFilter){
        filters.set("?");
        if(isFilter) {
            if (selectedColor !== "all") {
                filters.update(f => f + "color" + "=" + selectedColor)
                if(selectedPrice)
                    filters.update(f => f + "&")
            }
            if (selectedPrice) {
                filters.update(f => f + "price" + "=" + selectedPrice)
                if(selectedEndsBy)
                    filters.update(f => f + "&")
            }
            if (selectedEndsBy) {
                filters.update(f => f + "endsBy" + "=" + selectedEndsBy)
            }
        }else{
            if(searchTerm){
                filters.update(f => f +  "search" + "=" + searchTerm)
            }
        }
        dispatch('hasFilters');
    }
```
BIj toevoegen van filters wordt er gekeken of er eerst überhaupt een filter aanwezig is anders wordt er met een zoekterm
gezocht. Als er wel filters aanwezig zijn gaat de functie elke filter langs of er iets is ingevuld en update hierbij de
store.
## NavBar
Functie uitloggen vanuit de navbar
```javascript
    const logout = async () =>{
        const response = await fetch("http://localhost:5555/auth/logout", {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + $token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).catch((error) =>{
            return alert("There was a unexpected error while logging out: " + error);
        })
        if(!response.ok){
            return alert(await response.text());
        }
        await userId.set(null)
        await userName.set("")
        await token.set(null);
        await isAdmin.set(false);
    }
```
Bij de navbar is het ook mogelijk om uit te kunnen loggen wanneer de gebruiker is ingelogd. Als dit is voltooid maakt de
functie alle values in de store die te maken hebben met het inloggen op null.

NavBar opmaak
```html
<div class="nav">
    <a class="nav-item" class:active={active === "/"} href="/">Home</a>
    <a class="nav-item" class:active={active === "/about"} href="/about">About</a>
    <a class="nav-item" class:active={active === "/chairs"} href="/chairs">Chairs</a>
    {#if $userId === null}
    <a class="nav-item" class:active={active === "/login"} href="/login">Login</a>
    {:else}
    <a class="nav-item" on:click={logout} href="/">Logout</a>
    {/if}
</div>
```
Als er op een button wordt gedrukt stuurt de NavBar de gebruiker naar de goede pagina.