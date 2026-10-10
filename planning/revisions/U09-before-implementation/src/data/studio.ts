import catalog from "../../../lab-shared/studio-catalog.json";
import geometry from "../../../../spatial/lab_geometry.json";
import { experiments, kits } from "./fixtures";

export const artPlates = catalog.artPlates;
export type ArtFile = (typeof artPlates)[number]["file"];
export const studioReference = experiments.E01.source!;
export const studioKit = [
  ...kits[experiments.E06.kit].fixed,
  ...kits[experiments.E06.kit].portable,
].flatMap((item) => item.members || [item.id]);
export const signStudies = catalog.signStudies;
export const physicalStudies = catalog.physicalStudies;
export type PhysicalLayer = (typeof physicalStudies)[number]["layer"];
export const studioGeometry = geometry;
export function anchorRecord(id: string) {
  const opening = geometry.openings.find((record) => record.id === id);
  if (opening)
    return {
      id,
      label: opening.name,
      position: `${opening.wall} wall · ${opening.from}–${opening.to} m`,
      source: "P4-D opening",
    };
  const zone = geometry.zones.find((record) => record.id === id);
  if (zone)
    return {
      id,
      label: zone.name,
      position: `x ${zone.x}, y ${zone.y} · ${zone.w} × ${zone.d} m`,
      source: "P4-D zone",
    };
  const point = [...geometry.safety, ...geometry.services].find(
    (record) => record.id === id,
  );
  if (point)
    return {
      id,
      label: point.label,
      position: `x ${point.x}, y ${point.y} m`,
      source: "P4-D concept point",
    };
  const furniture = geometry.furniture.find((record) => record.id === id);
  if (furniture)
    return {
      id,
      label: furniture.type,
      position: `x ${furniture.x}, y ${furniture.y} · ${furniture.w} × ${furniture.d} m`,
      source: "P4-D footprint",
    };
  const circle = geometry.turning_circles.find((record) => record.id === id);
  if (circle)
    return {
      id,
      label: "Planned turning space",
      position: `centre ${circle.cx}, ${circle.cy} m · radius ${circle.r} m`,
      source: "P4-D clearance",
    };
  const floor = geometry.accessible_clear_floors.find(
    (record) => record.id === id,
  );
  if (floor)
    return {
      id,
      label: `${floor.station} approach floor`,
      position: `x ${floor.x}, y ${floor.y} · ${floor.w} × ${floor.d} m`,
      source: "P4-D clearance",
    };
  return undefined;
}
