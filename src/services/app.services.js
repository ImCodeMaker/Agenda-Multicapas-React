export async function FetchContactsForAgenda(){
    try {
        const response = await fetch('http://www.raydelto.org/agenda.php')

        if(!response.ok)
            throw new Error('An error ocurred fetching data')

        const data = response.json();
        return data;
    } catch (error) {
        console.error(`There was an error: for more details: ${error}`)
        throw error;
    }
}