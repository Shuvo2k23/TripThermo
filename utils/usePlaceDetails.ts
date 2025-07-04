// hooks/usePlaceDetails.ts
import { db } from "@/firebaseConfig";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

export type PlaceItem = {
  image: PlaceItem | null;
  place: string;
  district: string;
};

export type PlaceData = {
  [key: string]: PlaceItem;
};

export const usePlaceDetails = (detailsParam: any) => {
  const [item, setItem] = useState<PlaceItem | null>(null);
  const [relatedPlaces, setRelatedPlaces] = useState<PlaceData | undefined>(undefined);

  // Parse details param
  useEffect(() => {
    if (detailsParam) {
      let parsedItem = null;
      if (typeof detailsParam === "string") {
        parsedItem = JSON.parse(detailsParam);
      } else if (Array.isArray(detailsParam) && typeof detailsParam[0] === "string") {
        parsedItem = JSON.parse(detailsParam[0]);
      }
      setItem(parsedItem);
    }
  }, [detailsParam]);

  // Fetch related places
  useEffect(() => {
    if (!item) return;

    const placesRef = ref(db, "places/");
    onValue(placesRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setRelatedPlaces(undefined);
        return;
      }

      const filtered: PlaceData = {};
      Object.entries(data).forEach(([key, value]: [string, any]) => {
        if (value.district === item.district && value.place !== item.place) {
          filtered[key] = value;
        }
      });

      setRelatedPlaces(filtered);
    });
  }, [item]);

  return { item, relatedPlaces };
};
