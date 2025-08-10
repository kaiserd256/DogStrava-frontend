import React from "react";

// Placeholder dog data
type Dog = {
  id: string;
  name: string;
  breed: string;
  age: number;
  photo?: string;
};

const dogs: Dog[] = [
  {
    id: "1",
    name: "Max",
    breed: "Labrador Retriever",
    age: 3,
    photo: "/public/paw-print.png",
  },
  {
    id: "2",
    name: "Bella",
    breed: "German Shepherd",
    age: 2,
  },
];

export default function DogList() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">My Dogs</h2>
      <div className="space-y-4">
        {dogs.map((dog) => (
          <div key={dog.id} className="flex items-center space-x-4">
            {dog.photo ? (
              <img src={dog.photo} alt={dog.name} className="w-16 h-16 object-cover rounded-full border" />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                🐶
              </div>
            )}
            <div>
              <div className="font-semibold text-lg">{dog.name}</div>
              <div className="text-gray-600 text-sm">{dog.breed}</div>
              <div className="text-gray-500 text-xs">Age: {dog.age}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
