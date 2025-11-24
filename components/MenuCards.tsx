"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MenuItem } from "@/types/types"

interface FoodCardsProps {
  cards: MenuItem[];
}

export default function MenuCards({ cards }: FoodCardsProps) {
  const router = useRouter();

  const handleCardClick = (id: number) => {
    router.push(`/menu/${id}`);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 lg:py-8">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 overflow-y-auto"
        style={{ maxHeight: "820px" }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => handleCardClick(card.id)} 
          >
            <div className="relative h-48 w-full">
              <Image
                src={card.image.startsWith("http") ? card.image : `/images/${card.image}`}
                alt={card.name || "Menu Item Image"}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={card.id <= 4} 
              />
            </div>
            <div className="p-3 sm:p-4">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 line-clamp-1">
                {card.name}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-2 line-clamp-2">
                {card.description}
              </p>
              <p className="text-base sm:text-lg font-bold text-primary">
                ${card.price.toFixed(2)}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Category: {card.category}
              </p>
              <p
                className={`text-xs sm:text-sm ${
                  card.available ? "text-green-500" : "text-red-500"
                } mt-1 font-medium`}
              >
                {card.available ? "Available" : "Not Available"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
