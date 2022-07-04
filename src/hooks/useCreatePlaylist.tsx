import React from "react";
import CreatePlaylist from "../components/CreatePlaylist/CreatePlaylist";

export default function useCreatePlaylist() {

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const onOpen = () => {
    setIsOpen(true);
  }

  const render = React.useMemo(() => (
    <CreatePlaylist
      onClose={() => setIsOpen(false)}
      open={isOpen} />
  ), [isOpen]);

  return {
    onOpen,
    render
  }
}