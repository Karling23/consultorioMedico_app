import { IconButton, type IconButtonProps } from "@mui/material";

export function ActionIconButton({ sx, ...props }: IconButtonProps) {
  return (
    <IconButton
      size="small"
      disableRipple
      sx={{
        p: 0.5,
        borderRadius: 1,
        bgcolor: "transparent",
        "&:hover": { bgcolor: "transparent", opacity: 0.8 },
        ...sx,
      }}
      {...props}
    />
  );
}
