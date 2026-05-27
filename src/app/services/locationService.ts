const API_KEY = "d33f7c3a2a75aeb2e5547c85981559e1ec17d416cd6f887536c6effc1a37485b";

// ============ GET ALL STATES ============
export const getStates = async () => {
  try {
    const res = await fetch(
      "https://api.countrystatecity.in/v1/countries/EG/states",
      {
        headers: {
          "X-CSCAPI-KEY": API_KEY,
        },
      }
    );

    if (!res.ok) {
      console.error('Failed to fetch states:', res.statusText);
      return [];
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
};

// ============ GET CITIES BY STATE CODE ============
export const getCities = async (stateCode: string) => {
  try {
    const res = await fetch(
      `https://api.countrystatecity.in/v1/countries/EG/states/${stateCode}/cities`,
      {
        headers: {
          "X-CSCAPI-KEY": API_KEY,
        },
      }
    );

    if (!res.ok) {
      console.error('Failed to fetch cities:', res.statusText);
      return [];
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};

// ============ GET STATE BY NAME (HELPER) ============
export const getStateByName = async (stateName: string) => {
  try {
    const states = await getStates();
    const state = states.find((s: any) => s.name === stateName);
    return state || null;
  } catch (error) {
    console.error('Error finding state:', error);
    return null;
  }
};

// ============ GET CITY BY NAME (HELPER) ============
export const getCityByName = async (stateCode: string, cityName: string) => {
  try {
    const cities = await getCities(stateCode);
    const city = cities.find((c: any) => c.name === cityName);
    return city || null;
  } catch (error) {
    console.error('Error finding city:', error);
    return null;
  }
};

// ============ SEARCH CITIES ============
export const searchCities = async (query: string, stateCode?: string) => {
  try {
    let cities = [];

    if (stateCode) {
      cities = await getCities(stateCode);
    } else {
      const states = await getStates();
      for (const state of states) {
        const stateCities = await getCities(state.iso2);
        cities = [...cities, ...stateCities];
      }
    }

    const filtered = cities.filter((c: any) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );

    return filtered;
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};