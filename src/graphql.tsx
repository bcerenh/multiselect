export interface Character {
  id: number;
  name: string;
  image: string;
  episode: { id: number }[];
  location: { name: string };
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: { name: string; url: string };
  url: string;
  created: string;
}

  
  export const fetchCharacters = async (name: string): Promise<Character[]> => {
    const query = `
      query GetCharacters($name: String) {
        characters(filter: { name: $name }) {
          results {
            id
            name
            image
            episode {
              id
            }
            location {
              name
            }
          }
        }
      }
    `;
  


    const response = await fetch('https://rickandmortyapi.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { name },
      }),
    });
  
    const { data } = await response.json();
    return data.characters.results;
  };
  