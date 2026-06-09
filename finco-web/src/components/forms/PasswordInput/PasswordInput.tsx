import { useState } from "react";
import { Input, type InputProps } from "@components/forms/Input/Input";
import { IconButton } from "@components/buttons/IconButton/IconButton";

// Extinde Input: adauga doar toggle-ul de vizibilitate (§5.1). Nu reimplementeaza
// nimic — compune peste Input.
export type PasswordInputProps = Omit<InputProps, "type" | "rightSlot" | "iconLeft">;

export function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      {...props}
      type={visible ? "text" : "password"}
      iconLeft="lock"
      rightSlot={
        <IconButton
          name={visible ? "eye-off" : "eye"}
          label={visible ? "Ascunde parola" : "Arata parola"}
          onClick={() => setVisible((v) => !v)}
          size={28}
          iconSize={16}
        />
      }
    />
  );
}
