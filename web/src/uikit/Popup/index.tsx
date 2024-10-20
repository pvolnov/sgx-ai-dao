import { action, makeObservable, observable, runInAction } from "mobx";
import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react-lite";
import { Sheet } from "react-modal-sheet";
import { colors } from "../theme";

import { ModalContent, ModalOverlay, ModalWrap } from "./styled";
import isMobile from "is-mobile";

interface PopupConfig {
  id: string;
  element: React.ReactNode;
  onClose?: () => void;
  blocked?: boolean;
  fullscreen?: boolean;
  background?: string;
  isDraggable?: boolean;
}

class SheetsManager {
  public popups: (PopupConfig & { isOpen: boolean })[] = [];

  constructor() {
    makeObservable(this, {
      popups: observable,
      blocked: action,
      present: action,
    });
  }

  blocked = (id: string, isBlock: boolean) => {
    const p = this.popups.find((t) => t.id === id);
    if (!p) return;
    p.blocked = isBlock;
  };

  dismissAll = () => {
    this.popups.forEach((t) => t.onClose?.());
  };

  present = ({ id, element, blocked, background, isDraggable, fullscreen, onClose }: PopupConfig) => {
    const popup = this.popups.find((t) => t.id === id);
    if (popup) return;

    //AnalyticsTracker.shared.track("popup:" + id);
    this.popups.push({
      id,
      element,
      blocked,
      fullscreen,
      isOpen: false,
      background,
      isDraggable,
      onClose: action(() => {
        const popup = this.popups.find((t) => t.id === id);
        if (!popup) return;
        popup.isOpen = false;
        setTimeout(
          action(() => {
            this.popups = this.popups.filter((t) => t.id !== id);
            onClose?.();
          }),
          300
        );
      }),
    });

    setTimeout(() => {
      const popup = this.popups.find((t) => t.id === id);
      if (popup) runInAction(() => (popup.isOpen = true));
    }, 100);
  };

  dismiss = (id: string) => {
    this.popups.find((t) => t.id === id)?.onClose?.();
  };
}

export const sheets = new SheetsManager();

const PopupsProvider = observer(() => {
  return (
    <>
      {sheets.popups.map(({ id, element, isOpen, fullscreen, onClose, blocked, background, isDraggable }) => {
        if (!isMobile()) {
          return (
            <AnimatePresence key={id}>
              {isOpen && (
                <ModalWrap key={id} transition={{ duration: 0.1 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ModalOverlay onClick={() => !blocked && onClose?.()} />
                  <ModalContent transition={{ duration: 0.1 }} initial={{ y: 50, scale: 0.8 }} animate={{ y: 0, scale: 1 }} exit={{ scale: 0.8 }} style={{ padding: 0, background }}>
                    {element}
                  </ModalContent>
                </ModalWrap>
              )}
            </AnimatePresence>
          );
        }

        return (
          <Sheet key={id} isOpen={isOpen} disableDrag={blocked || isDraggable} onClose={() => onClose?.()} detent={fullscreen ? "full-height" : "content-height"}>
            <Sheet.Container style={{ background: background || colors.elevation0, borderRadius: "16px 16px 0 0", boxShadow: "none" }}>
              <Sheet.Header style={{ marginTop: -32, height: 32 }} disableDrag={blocked} />
              <Sheet.Content disableDrag={blocked || isDraggable}>{element}</Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop onTap={() => !blocked && onClose?.()} />
          </Sheet>
        );
      })}
    </>
  );
});

export default PopupsProvider;
