// @ts-ignore
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { colors } from "@uikit/theme";
import isMobile from "is-mobile";

export const notify = (data: any) => {
  let txt = data?.toString?.() || "";
  try {
    if (txt === "[object Object]") txt = JSON.stringify(data);
  } catch {}

  const toast: any = Toastify({
    text: txt,
    duration: Math.max(3000, Math.min(15000, txt.length * 50)),
    gravity: isMobile() ? "top" : "bottom", // `top` or `bottom`
    position: isMobile() ? "center" : "left", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover

    onClick: () => toast.hideToast(),

    style: {
      background: colors.elevation1,
      border: `1px solid ${colors.border}`,
      color: colors.blackPrimary,
      fontWeight: "600",
      borderRadius: "12px",
      maxWidth: "100%",
      width: "fit-content",
      margin: "0 16px",
      boxShadow: `0 3px 6px -1px ${colors.elevation2}, 0 10px 36px -4px ${colors.elevation2}`,
    },
  });

  toast.showToast();
};
