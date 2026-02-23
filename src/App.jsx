import { TiWeatherCloudy } from "react-icons/ti";
import { GoSearch } from "react-icons/go";
import { WiHumidity, WiStrongWind, WiThermometer, WiBarometer } from "react-icons/wi";
import { IoSunny, IoMoon, IoPartlySunny, IoCloudyNight, IoCloud, IoCloudy, IoRainy, IoThunderstorm, IoSnow } from "react-icons/io5";
import { BsMoonFill, BsSunFill, BsCloudFog2Fill } from "react-icons/bs";
import { useEffect, useState, useRef } from "react";

const API_KEY = import.meta.env.VITE_APP_OPENWEATHER_API_KEY;

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const suggestionsRef = useRef(null);

  // Kullanıcının konumunu al ve şehir olarak ayarla
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`)
            .then(res => res.json())
            .then(data => {
              if (data && data.length > 0) {
                setCity(data[0].name);
              } else {
                setCity("Ankara");
              }
            })
            .catch(() => setCity("Ankara"));
        },
        () => {
          // Konum izni reddedilirse varsayılan şehir
          setCity("Ankara");
        }
      );
    } else {
      setCity("Ankara");
    }
  }, []);

  useEffect(() => {
    if (!city) return;

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=tr`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=tr`;

    fetch(weatherUrl)
      .then(res => res.json())
      .then(data => {
        if (data.cod !== 200) {
          setError("Şehir bulunamadı");
          setWeather(null);
          setForecast(null);
          return;
        }
        setWeather(data);
        setError(null);
      });

    fetch(forecastUrl)
      .then(res => res.json())
      .then(data => {
        if (data.cod === "200") {
          setForecast(data);
        }
      });
  }, [city]);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data || []);
          setShowSuggestions(true);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClick = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelectCity = (name) => {
    setCity(name);
    setQuery(name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const today = new Date();
  const formatted = today.toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const dailyForecast = forecast?.list
    ?.filter(item => item.dt_txt.includes("12:00:00"))
    ?.slice(0, 5) || [];

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("tr-TR", { weekday: "short" });
  };

  if (error) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-blue-50 text-black"}`}>
        <div className="text-red-500 text-2xl font-bold">{error}</div>
        <button onClick={() => { setCity("Ankara"); setError(null); }} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer">
          Ana Sayfa
        </button>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-blue-50 text-black"}`}>
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  const getWeatherIcon = (iconCode, size = 200) => {
    const iconMap = {
      "01d": <IoSunny size={size} color="#3A9AFF" />,
      "01n": <IoMoon size={size} color="#3A9AFF" />,
      "02d": <IoPartlySunny size={size} color="#3A9AFF" />,
      "02n": <IoCloudyNight size={size} color="#3A9AFF" />,
      "03d": <IoCloud size={size} color="#3A9AFF" />,
      "03n": <IoCloud size={size} color="#3A9AFF" />,
      "04d": <IoCloudy size={size} color="#3A9AFF" />,
      "04n": <IoCloudy size={size} color="#3A9AFF" />,
      "09d": <IoRainy size={size} color="#3A9AFF" />,
      "09n": <IoRainy size={size} color="#3A9AFF" />,
      "10d": <IoRainy size={size} color="#3A9AFF" />,
      "10n": <IoRainy size={size} color="#3A9AFF" />,
      "11d": <IoThunderstorm size={size} color="#3A9AFF" />,
      "11n": <IoThunderstorm size={size} color="#3A9AFF" />,
      "13d": <IoSnow size={size} color="#3A9AFF" />,
      "13n": <IoSnow size={size} color="#3A9AFF" />,
      "50d": <BsCloudFog2Fill size={size * 0.85} color="#3A9AFF" />,
      "50n": <BsCloudFog2Fill size={size * 0.85} color="#3A9AFF" />,
    };
    return iconMap[iconCode] || <IoCloud size={size} color="#3A9AFF" />;
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${darkMode ? "text-white" : "text-black"}`}
      style={{ background: darkMode
        ? "linear-gradient(180deg, rgba(10,15,30,1) 0%, rgba(15,30,60,1) 50%, rgba(8,12,24,1) 100%)"
        : "linear-gradient(180deg, #ffffff 0%, #e8f1fc 50%, #dceefb 100%)" }}
    >

      <div className="w-full h-[128px] flex justify-center items-center relative">
        <TiWeatherCloudy size={75} color="#3A9AFF" />
        <div className="text-4xl font-bold ml-4 cursor-pointer">SkyCast</div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`absolute right-10 top-1/2 -translate-y-1/2 p-3 rounded-full transition-colors duration-300 cursor-pointer shadow-lg border ${darkMode ? "bg-gray-700 hover:bg-gray-600 border-gray-600" : "bg-white hover:bg-gray-100 border-gray-300"}`}
        >
          {darkMode ? <BsSunFill size={22} color="#FDB813" /> : <BsMoonFill size={22} color="#3A9AFF" />}
        </button>
      </div>

      <div className="w-full h-[64px] flex justify-center items-center" ref={suggestionsRef}>
        <div className="relative w-1/2">
          <GoSearch className="absolute left-3 top-1/2 -translate-y-1/2 z-10" size={20} color={darkMode ? "#9CA3AF" : "#000"} />
          <input
            type="text"
            value={query}
            className={`w-full p-2 pl-10 rounded-md focus:outline-none shadow-lg border ${darkMode ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400" : "bg-white border-black text-black"}`}
            placeholder="Şehir ara..."
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setCity(query);
                setShowSuggestions(false);
              }
            }}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className={`absolute z-50 w-full mt-1 rounded-md shadow-lg border max-h-60 overflow-y-auto ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"}`}>
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  className={`px-4 py-2 cursor-pointer ${darkMode ? "hover:bg-gray-700" : "hover:bg-blue-50"}`}
                  onClick={() => handleSelectCity(s.name)}
                >
                  {s.name}, {s.country}{s.state ? `, ${s.state}` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={`w-full h-[100px] flex justify-center items-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        <div className="text-xl font-bold">{formatted}</div>
      </div>

      <div className="w-full h-[100px] text-5xl font-extrabold justify-center items-center flex pb-30">{city}</div>

      <div className="w-full h-[100px] flex justify-center items-center gap-15">
        {getWeatherIcon(weather.weather[0].icon, 200)}
        <div className="text-9xl font-extrabold justify-center items-center">{Math.round(weather.main.temp)}°C</div>
      </div>

      <div className={`w-full flex items-center justify-center mx-auto gap-20 mt-30 border-t pt-10 border-b pb-10 ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
        <div className={`flex flex-col justify-start pt-6 items-center w-64 h-48 rounded-xl border ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"}`}>
          <WiStrongWind size={55} className={`border-2 rounded-xl my-2 ${darkMode ? "border-blue-400 bg-blue-900/30" : "border-blue-200 bg-blue-50"}`} color="#3A9AFF" />
          <span className={`ml-2 font-bold text-xl ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Rüzgar</span>
          <span className={`font-bold text-lg mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{weather.wind.speed} m/s</span>
        </div>
        <div className={`flex flex-col justify-start pt-6 items-center w-64 h-48 rounded-xl border ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"}`}>
          <WiHumidity size={55} className={`border-2 rounded-xl my-2 ${darkMode ? "border-blue-400 bg-blue-900/30" : "border-blue-200 bg-blue-50"}`} color="#3A9AFF" />
          <span className={`ml-2 font-bold text-xl ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Nem</span>
          <span className={`font-bold text-lg mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{weather.main.humidity}%</span>
        </div>
        <div className={`flex flex-col justify-start pt-6 items-center w-64 h-48 rounded-xl border ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"}`}>
          <WiBarometer size={55} className={`border-2 rounded-xl my-2 ${darkMode ? "border-blue-400 bg-blue-900/30" : "border-blue-200 bg-blue-50"}`} color="#3A9AFF" />
          <span className={`ml-2 font-bold text-xl ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Basınç</span>
          <span className={`font-bold text-lg mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{weather.main.pressure} hPa</span>
        </div>
        <div className={`flex flex-col justify-start pt-6 items-center w-64 h-48 rounded-xl border ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"}`}>
          <WiThermometer size={55} className={`border-2 rounded-xl my-2 ${darkMode ? "border-blue-400 bg-blue-900/30" : "border-blue-200 bg-blue-50"}`} color="#3A9AFF" />
          <span className={`ml-2 font-bold text-xl ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Hissedilen</span>
          <span className={`font-bold text-lg mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{Math.round(weather.main.feels_like)}°C</span>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-center mt-10">Sonraki 5 Gün</h1>
        <div className="w-full flex items-center justify-center mx-auto gap-20 mt-10">
          {dailyForecast.map((day, i) => (
            <div key={i} className={`flex flex-col justify-start pt-6 items-center w-64 h-48 rounded-xl border ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"}`}>
              <span className={`font-bold text-xl ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{getDayName(day.dt_txt)}</span>
              {getWeatherIcon(day.weather[0].icon, 50)}
              <span className={`font-bold text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{Math.round(day.main.temp)}°C</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-4/5 mx-auto mt-10 mb-6 flex items-center gap-4 h-10">
        <hr className={`flex-1 ${darkMode ? "border-gray-700" : "border-gray-300"}`} />
        <footer className={`whitespace-nowrap ${darkMode ? "text-gray-500" : "text-gray-600"}`}>Designed by Elmar</footer>
        <hr className={`flex-1 ${darkMode ? "border-gray-700" : "border-gray-300"}`} />
      </div>
    </div>
  );
}

export default App;
