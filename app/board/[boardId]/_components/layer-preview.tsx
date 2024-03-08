"use client";

interface LayerPreviewProps {
  id: string;
  onLayerPointDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

export const LayerPreview = ({
  id,
  onLayerPointDown,
  selectionColor,
}: LayerPreviewProps) => {
  return <div></div>;
};
