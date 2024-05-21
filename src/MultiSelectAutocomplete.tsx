import React, { useState, useEffect, useRef } from 'react';
import Autocomplete from '@mui/lab/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchCharacters, Character } from './graphql'; 
import Checkbox from '@mui/material/Checkbox';


//tanımlamalar
const MultiSelectAutocomplete = () => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false); //veri yüklenirken loading state 
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]); //seçilen karakter  
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
 

  useEffect(() => {
    if (inputValue) {
      setLoading(true);
      fetchCharacters(inputValue)
        .then((characters) => {
          setOptions(characters);
          setLoading(false);
        })
        .catch((error) => {
          setError("Eşleşen Yok..");
          setLoading(false);
          setOptions([]);
        });
    }
  }, [inputValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  //seçilen karakteri güncellemesi için
  const handleSelectCharacters = (characters: Character[]) => {
    setSelectedCharacters(characters);
  };

 //checkbox fonksiyon 
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, character: Character) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedCharacters([...selectedCharacters, character]);
    } else {
      setSelectedCharacters(selectedCharacters.filter((char) => char.id !== character.id));
    }
    inputRef.current?.focus();
  };


  //keyboard navigation fonksiyon
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Tab") {
      event.preventDefault();
      if (options.length > 0) {
        const lastSelectedCharacterId = selectedCharacters[selectedCharacters.length - 1]?.id;
        const selectedOptionIndex = options.findIndex((option) => option.id === lastSelectedCharacterId);
        let nextOptionIndex = 0;
        if (selectedOptionIndex !== -1 && selectedOptionIndex !== options.length - 1) {
          nextOptionIndex = selectedOptionIndex + 1;
        }
        const nextOption = options[nextOptionIndex];
        if (nextOption) {
          handleSelectCharacters([...selectedCharacters, nextOption]);
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }
      }
    }
    };



  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div>
        <Autocomplete
          multiple
          options={options}
          getOptionLabel={(option) => option.name}
          loading={loading}
          onChange={(event, value) => handleSelectCharacters(value)}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Karakteri Ara / Seç / Göster"
              placeholder="Karakteri Yazınız.."
              InputProps={{
                ...params.InputProps,
                inputRef: inputRef,
                style: { minWidth: 700 },
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          )}
          renderOption={(props, option) => {
            const query = inputValue.toLowerCase();
            const characterName = option.name.toLowerCase();
            const startIndex = characterName.indexOf(query);
            const boldName = option.name.substring(0, startIndex) + '<strong>' + option.name.substring(startIndex, startIndex + query.length) + '</strong>' + option.name.substring(startIndex + query.length);

            return (
              <li {...props}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={option.image} alt={option.name} style={{ width: 40, height: 40, marginRight: 10 }} />
                  <div>
                    <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: boldName }}></p>
                    <p style={{ margin: 0 }}>Episodes: {option.episode.length}</p>
                  </div>
                  <Checkbox
                    checked={selectedCharacters.some((char) => char.id === option.id)}
                    onChange={(event) => handleCheckboxChange(event, option)}
                    sx={{ width: 40, height: 40, marginRight: 10 }}
                  />
                </div>
              </li>
            );
          }}
          noOptionsText={error ? error : "Eşleşen yok."}
        />
        {loading && <div>Arama Sonuçları Yükleniyor ..</div>}
        {error && <div>Hata: {error}</div>}
      </div>
    </div>
  );
};

export default MultiSelectAutocomplete;