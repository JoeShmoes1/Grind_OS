
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { GMRoom } from "@/components/rooms/GMRoom";
import { TaskRoom } from "@/components/rooms/TaskRoom";
import { RitualRoom } from "@/components/rooms/RitualRoom";
import { JournalRoom } from "@/components/rooms/JournalRoom";
import { VisionRoom } from "@/components/rooms/VisionRoom";
import { NoteRoom } from "@/components/rooms/NoteRoom";
import { SearchRoom } from "@/components/rooms/SearchRoom";
import { AIAssistantRoom } from "@/components/rooms/AIAssistantRoom";

const Index = () => {
  const [currentRoom, setCurrentRoom] = useState("gm");
  const location = useLocation();
  
  // Update current room based on path
  useEffect(() => {
    const path = location.pathname;
    if (path === "/" || path === "/gm") {
      setCurrentRoom("gm");
    } else if (path === "/tasks") {
      setCurrentRoom("tasks");
    } else if (path === "/rituals") {
      setCurrentRoom("rituals");
    } else if (path === "/vision") {
      setCurrentRoom("vision");
    } else if (path === "/journal") {
      setCurrentRoom("journal");
    } else if (path === "/notes") {
      setCurrentRoom("notes");
    } else if (path === "/search") {
      setCurrentRoom("search");
    } else if (path === "/ai-assistant") {
      setCurrentRoom("ai-assistant");
    }
  }, [location]);
  
  const renderRoom = () => {
    switch (currentRoom) {
      case "gm":
        return <GMRoom />;
      case "tasks":
        return <TaskRoom />;
      case "rituals":
        return <RitualRoom />;
      case "vision":
        return <VisionRoom />;
      case "journal":
        return <JournalRoom />;
      case "notes":
        return <NoteRoom />;
      case "search":
        return <SearchRoom />;
      case "ai-assistant":
        return <AIAssistantRoom />;
      default:
        return <GMRoom />;
    }
  };
  
  return (
    <MainLayout>
      {renderRoom()}
    </MainLayout>
  );
};

export default Index;
