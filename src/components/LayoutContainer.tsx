import { Container } from "@mui/material";
import type { ReactNode } from "react";

export interface LayoutContainerProps {
  children: ReactNode;
}

export default function LayoutContainer({
  children,
}: LayoutContainerProps): ReactNode {
  return <Container>{children}</Container>;
}
