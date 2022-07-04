import SwipeTrash from "../components/SwipeTrash/SwipeTrash";
import useSwipeDeleteProps from "./useSwipeDeleteProps";
import Swipable from "react-native-gesture-handler/Swipeable"
import React from "react";
import useConfirmAction, { UseConfirmActionOptions } from "./useConfirmAction";


export type UseSwipeDeleteOptions = {
  /**
   * @description content of swipable component
   */
  children: JSX.Element | JSX.Element[]

  /**
   * @description callback trigger after confirm delete action
   */
  onDelete: () => void;

  /**
   * @description a relational text show at confirm delete action *(should notify the user of the causes of action)*
   */
  relationalText: string;

  itemType?: string;
}

export default function useSwipeDelete(options: UseSwipeDeleteOptions) {

  const confirmActionOptions: UseConfirmActionOptions = React.useMemo(() => ({
    props: {
      actionCancel: {
        title: "CANCEL",
        type: "safe",
      },
      actionContinue: {
        title: "REMOVE",
        type: "unsafe",
        onPress: options.onDelete
      },
      actionType: "remove",
      relationalText: options.relationalText,
      itemType: options.itemType,
      warnCantUndo: true,
    },
    overrideActionCancel: () => {
      swipeRef.current?.close()
    },
    overrideActionClose: () => {
      swipeRef.current?.close()
    }
  }), [
    options.relationalText,
    options.itemType,
    options.onDelete
  ]);

  const swipeDeleteProps = useSwipeDeleteProps()
  const {onOpen, render} = useConfirmAction(confirmActionOptions)

  const swipeRef = React.useRef<Swipable | null>(null)

  const jsx = (
    <>
    <SwipeTrash
      {...swipeDeleteProps}
      onGetSwipableRef={(swipe: Swipable) => swipeRef.current = swipe}
      onTrash={onOpen}>
        {options.children}
    </SwipeTrash>
    {render}
    </>
  )

  return {render: jsx}
}