"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { BiDownArrow } from "react-icons/bi";
import { FaTrashAlt } from "react-icons/fa";

export default function InputSelector() {
  const [countries, setCountries] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [list, setList] = useState<string[]>(
    JSON.parse(localStorage.getItem("list") || "[]")
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const fetchCountries = async () => {
    const res = await fetch("https://restcountries.com/v3.1/all?fields=name");
    const data = await res.json();
    setCountries(
      data.map((s_data: { name: { common: string } }) => s_data.name.common)
    );
  };

  const addToList = (country: string) => {
    if (!list.includes(country)) {
      const updatedList = [...list, country];
      setList(updatedList);
      localStorage.setItem("list", JSON.stringify(updatedList));
    }
    setInput("");
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const matchedCountries = countries.filter((country) =>
    country.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="max-w-96 m-auto flex flex-col justify-center gap-4 w-full mt-2">
      <CustomInput
        onChange={(e) => setInput(e.target.value)}
        value={input}
        onInputClick={() => setIsOpen(true)}
        onArrowClick={() => setIsOpen(!isOpen)}
      />
      <OptionsContainer isOpen={isOpen}>
        {matchedCountries.length > 0 ? (
          matchedCountries.map((country) => {
            if (list.includes(country)) {
              return (
                <span key={`dropdown${country}`} className="text-red-600">
                  {country} (already added)
                </span>
              );
            }
            return (
              <div key={`dropdown${country}`} className="flex justify-between">
                <span>{country}</span>
                <button
                  className="bg-green-600 text-white rounded-xl px-4"
                  onClick={() => addToList(country)}
                >
                  Add
                </button>
              </div>
            );
          })
        ) : (
          <span>Could not find country</span>
        )}
      </OptionsContainer>
      <div>
        {list.map((country) => (
          <RemovableComponent
            key={`selected${country}`}
            ele={country}
            list={list}
            setList={setList}
          />
        ))}
      </div>
    </div>
  );
}

const CustomInput = ({
  value,
  onChange,
  onInputClick,
  onArrowClick,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onInputClick: () => void;
  onArrowClick: () => void;
}) => {
  const [degree, setDegree] = useState(0);

  const handleArrowClick = () => {
    const newDegree = degree === 0 ? 180 : 0;
    setDegree(newDegree);
    onArrowClick();
  };

  return (
    <div className="relative w-full">
      <input
        className="w-full pl-10 pr-4 py-2 rounded-lg text-black shadow-md outline-none border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out hover:border-blue-400"
        onChange={(e) => onChange(e)}
        value={value}
        placeholder="Search countries..."
        onClick={() => {
          onInputClick();
          setDegree(180);
        }}
      />

      <BiDownArrow
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer transition-all duration-500 ${
          degree === 180 ? "rotate-180" : "rotate-0"
        }`}
        onClick={handleArrowClick}
      />
    </div>
  );
};

const OptionsContainer = ({
  children,
  isOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
}) => {
  return (
    <div
      className={`flex flex-col gap-2 overflow-y-scroll transition-all duration-300 ease-in-out ${
        isOpen ? "opacity-100 max-h-96" : "opacity-0 max-h-0"
      }`}
    >
      {children}
    </div>
  );
};

const RemovableComponent = ({
  ele,
  list,
  setList,
}: {
  ele: string;
  list: string[];
  setList: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const removeElement = () => {
    const updatedList = list.filter((e) => e !== ele);
    setList(updatedList);
    localStorage.setItem("list", JSON.stringify(updatedList));
  };

  return (
    <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2 mb-2 shadow-md hover:bg-gray-200 transition-all duration-300 ease-in-out">
      <span className="text-gray-800 text-lg">{ele}</span>
      <button
        onClick={removeElement}
        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-300"
        aria-label={`Remove ${ele}`}
      >
        <FaTrashAlt />
      </button>
    </div>
  );
};
