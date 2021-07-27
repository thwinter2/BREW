import React from "react";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng
} from "use-places-autocomplete";

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

import {
  Listbox,
  ListboxPopover,
  ListboxOption
} from "@reach/listbox";
import "@reach/listbox/styles.css";

import "./Search.css";

const radiusOptions = [
  {
    key: '5',
    value: '5 Miles',
    zoomLevel: 13
  },
  {
    key: '10',
    value: '10 Miles',
    zoomLevel: 12
  },
  {
    key: '25',
    value: '25 Miles',
    zoomLevel: 10
  }
];

function Search({ panTo, radiusUpdate }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {
    },
    debounce: 300
  });

  const onLocationSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log(error);
    }
  };

  const onRadiusUpdate = (radiusStr) => {
    let radius = parseInt(radiusStr);
    let radiusMetric = radius * 1609.344;
    let zoomLevel = radiusOptions.filter(x => x.key === radiusStr)[0].zoomLevel;
    radiusUpdate(radiusMetric, zoomLevel);
  };

  return (
    <div className="search">
      <Combobox onSelect={onLocationSelect}>
        <ComboboxInput value={value} onChange={(event) => { setValue(event.target.value) }} disabled={!ready} placeholder="Enter an address, zip, etc." />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => <ComboboxOption key={id} value={description}></ComboboxOption>)}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
      <Listbox onChange={(newValue) => { onRadiusUpdate(newValue) }} defaultValue={radiusOptions[0].key}>
        <ListboxPopover>
          {radiusOptions.map(({ key, value }) => <ListboxOption key={key} value={key}>{value}</ListboxOption>)}
        </ListboxPopover>
      </Listbox>
    </div>
  );
}

export default Search;