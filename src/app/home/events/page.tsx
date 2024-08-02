"use client";

import axios from "axios";
import { useEffect, useState, useTransition } from "react";

const Events = () => {
  const [events, setEvents] = useState<[]>([]);
  const [isPending, startTransition] = useTransition();

  console.log(events);

  useEffect(() => {
    const fetchEvents = async () => {
      startTransition(async () => {
        try {
          const response = await axios.get("/api/get-events");
          const data = response.data.data;
          setEvents(data);
        } catch (error) {
          console.log(error);
        }
      });
    };

    fetchEvents();
  }, []);

  return <p>teste</p>;
};

export default Events;
