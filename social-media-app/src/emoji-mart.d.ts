declare module "@emoji-mart/react" {
  import * as React from "react";

  interface Emoji {
    id: string;
    name: string;
    native: string;
    unified: string;
    keywords: string[];
    shortcodes: string;
  }

  interface PickerProps {
    data: any;
    onEmojiSelect?: (emoji: Emoji) => void;
    theme?: "light" | "dark" | "auto";
    [key: string]: any;
  }

  const Picker: React.FC<PickerProps>;
  export default Picker;
}
