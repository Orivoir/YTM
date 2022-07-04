import React from "react";
import ConfirmAction from "../components/ConfirmAction/ConfirmAction";

export type UseConfirmActionOptions = {

  props: {
    relationalText: string;

    actionContinue: {
      title: string;
      type: "unsafe" | "safe",
      onPress: () => void;
    };

    actionCancel: {
      title: string;
      type: "unsage" | "safe"
    };

    title?: string;
    actionType?: string;
    itemType?: string;
    warnCantUndo?: boolean;
  }

  overrideActionCancel?: () => void;
  overrideActionClose?: () => void;
}

export default function useConfirmAction(options: UseConfirmActionOptions) {

  const [isOpen, setIsOpen] = React.useState(false);

  const onOpen = () => (
    setIsOpen(true)
  )

  const render = (
    <ConfirmAction
      {...options.props}
      actionCancel={{
        ...options.props.actionCancel,
        onPress: () => {
          options.overrideActionCancel instanceof Function && options.overrideActionCancel();
          setIsOpen(false)
        }
      }}
      onClose={() => {
        options.overrideActionClose instanceof Function && options.overrideActionClose();
        setIsOpen(false);
      }}
      open={isOpen} />
  );

  return  {
    onOpen,
    render
  }
}