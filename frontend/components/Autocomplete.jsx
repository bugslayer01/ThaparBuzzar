import {useCallback, useEffect} from "react";
import {useState} from "react";
import "./styles.css";
import SuggestionsList from "./SuggestionsList";
import debounce from "lodash/debounce";

const Autocomplete = ({
  staticData,
  fetchSuggestions,
  placeholder = "",
  customloading = "Loading...",
  onSelect = () => {},
  onBlur = () => {},
  onFocus = () => {},
  onChange = () => {},
  customStyles = {},
  dataKey = "",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const {setCache, getCache} = useCache("autocomplete", 3600);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    onChange(event.target.value);
  };

  const getSuggestions = async (query) => {
    setError(null);
    setLoading(true);
    try {
        let result;
        if (staticData) {
            result = staticData.filter((item) => {
                return item.toLowerCase().includes(query.toLowerCase());
            });
        } else if (fetchSuggestions) {
            console.log(fetchSuggestions(query))
            result = await fetchSuggestions(query);
            console.log(query)
      }
      console.log(result);
      // setCache(query, result);
      setSuggestions(result);
    } catch (err) {
      setError("Failed to fetch suggestions");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestionsDebounced = useCallback(
    debounce(getSuggestions, 300),
    []
  );

  useEffect(() => {
    if (inputValue.length > 1) {
      getSuggestionsDebounced(inputValue);
    } else {
      setSuggestions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const handleSuggestionClick = (suggestion) => {
    setInputValue(dataKey ? suggestion[dataKey] : dataKey);
    onSelect(suggestion);
    setSuggestions([]);
  };
  console.log("suggestions",suggestions);

  return (
    <div className="containersa">
      <input
        type="text"
        value={inputValue}
        placeholder={placeholder}
        style={customStyles}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={handleInputChange}
      />

      {(suggestions.length > 0 || loading || error) && (
        <ul className="suggestions-list" role="listbox">
          {error && <div className="error">{error}</div>}
          {loading && <div className="loading">{customloading}</div>}
          <SuggestionsList
            dataKey={dataKey}
            highlight={inputValue}
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;