"use client";

interface LayerPreviewProps {
  id: string;
  onLayerPointerDown: () => void;
  selectionColor?: string;
}

export const LayerPreview = ({
  id,
  onLayerPointerDown,
  selectionColor,
}: LayerPreviewProps) => {
  return <div></div>;
};
