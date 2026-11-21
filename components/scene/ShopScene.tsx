"use client";

import { Billboard, Edges, Float, Html, RoundedBox, Text, useKeyboardControls, KeyboardControls } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { MATERIAL_PRESETS, ROOMS, SHOP, type MaterialPreset, type RoomConfig } from "@/lib/shop-config";

type LayerState = { walls: boolean; roof: boolean; furniture: boolean; labels: boolean; zones: boolean; cats: boolean };
type Props = {
  mode: "orbit" | "walk";
  selectedRoom: RoomConfig | null;
  hoveredRoom: string | null;
  onHover: (id: string | null) => void;
  onSelect: (room: RoomConfig) => void;
  layers: LayerState;
  hiddenRooms: Set<string>;
  isolatedRoom: string | null;
  preset: MaterialPreset;
  evening: boolean;
};

const WALLS: Array<[number, number, number, number]> = [
  [0, -15, 24, 0.22], [-10.35, 15, 3.3, 0.22], [10.35, 15, 3.3, 0.22], [-12, 0, 0.22, 30], [12, 0, 0.22, 30],
  [-6.8, -3.8, 0.22, 10.5], [-9.1, -2, 4.4, 0.22], [-9.1, 3.2, 4.4, 0.22],
  [0, -4.35, 13.6, 0.22], [7.8, -4.35, 8.4, 0.22], [-5.8, -8.35, 12.2, 0.22], [6.65, -8.35, 10.7, 0.22],
  [3.5, -6.35, 0.22, 4], [5.55, -6.35, 0.22, 4], [8.05, -6.35, 0.22, 4],
  [-5.3, -12.1, 0.22, 7.5], [6.35, -12.1, 0.22, 7.5],
];

const ROOM_BY_ID = Object.fromEntries(ROOMS.map((room) => [room.id, room]));

function RoomZones({ selectedRoom, hoveredRoom, onHover, onSelect, hiddenRooms, isolatedRoom, visible }: Pick<Props, "selectedRoom" | "hoveredRoom" | "onHover" | "onSelect" | "hiddenRooms" | "isolatedRoom"> & { visible: boolean }) {
  if (!visible) return null;
  return <>{ROOMS.map((room) => {
    const hidden = hiddenRooms.has(room.id) || (isolatedRoom !== null && isolatedRoom !== room.id);
    if (hidden) return null;
    const active = selectedRoom?.id === room.id;
    const hover = hoveredRoom === room.id;
    return <mesh key={room.id} position={room.center} rotation={[-Math.PI / 2, 0, 0]} onPointerEnter={(event) => { event.stopPropagation(); onHover(room.id); document.body.style.cursor = "pointer"; }} onPointerLeave={() => { onHover(null); document.body.style.cursor = "default"; }} onClick={(event) => { event.stopPropagation(); onSelect(room); }}>
      <planeGeometry args={room.size} />
      <meshStandardMaterial color={room.color} transparent opacity={active ? 0.62 : hover ? 0.48 : 0.23} roughness={0.92} emissive={active || hover ? room.color : "#000000"} emissiveIntensity={active ? 0.24 : hover ? 0.12 : 0} depthWrite={false} />
      {(active || hover) && <Edges color={active ? "#b85f45" : "#6e806d"} scale={1.01} />}
    </mesh>;
  })}</>;
}

function Walls({ color, visible, selectedRoom }: { color: string; visible: boolean; selectedRoom: RoomConfig | null }) {
  if (!visible) return null;
  return <group>{WALLS.map(([x, z, width, depth], index) => {
    const distance = selectedRoom ? Math.hypot(x - selectedRoom.center[0], z - selectedRoom.center[2]) : 30;
    const fade = selectedRoom && distance < 5.4;
    return <RigidBody key={index} type="fixed" colliders={false}>
      <CuboidCollider args={[width / 2, SHOP.wallHeight / 2, depth / 2]} position={[x, SHOP.wallHeight / 2, z]} />
      <mesh position={[x, SHOP.wallHeight / 2, z]} castShadow receiveShadow>
        <boxGeometry args={[width, SHOP.wallHeight, depth]} />
        <meshStandardMaterial color={color} roughness={0.78} transparent={fade} opacity={fade ? 0.28 : 1} />
      </mesh>
    </RigidBody>;
  })}</group>;
}

function Shelf({ position, rotation = 0, wood, accent }: { position: [number, number, number]; rotation?: number; wood: string; accent: string }) {
  const products = useMemo(() => Array.from({ length: 18 }, (_, index) => ({ x: (index % 6 - 2.5) * 0.42, y: 0.55 + Math.floor(index / 6) * 0.66, color: ["#c97856", "#d3b765", "#78917a", "#4c7775"][index % 4] })), []);
  return <group position={position} rotation={[0, rotation, 0]}>
    <RoundedBox args={[3.1, 0.16, 0.85]} position={[0, 0.18, 0]} radius={0.04}><meshStandardMaterial color={wood} /></RoundedBox>
    {[0.65, 1.32, 1.98].map((y) => <mesh key={y} position={[0, y, 0]} castShadow><boxGeometry args={[3.2, 0.09, 0.92]} /><meshStandardMaterial color={wood} /></mesh>)}
    {[-1.48, 1.48].map((x) => <mesh key={x} position={[x, 1.08, 0]}><boxGeometry args={[0.1, 2.16, 0.86]} /><meshStandardMaterial color={wood} /></mesh>)}
    {products.map((item, index) => <mesh key={index} position={[item.x, item.y, 0]} castShadow><boxGeometry args={[0.27, 0.42, 0.43]} /><meshStandardMaterial color={item.color} roughness={0.7} /></mesh>)}
    <mesh position={[0, 2.25, 0]}><boxGeometry args={[2.2, 0.32, 0.12]} /><meshStandardMaterial color={accent} /></mesh>
  </group>;
}

function Counter({ wood, accent }: { wood: string; accent: string }) {
  return <group position={[0, 0, -1.2]}>
    <RoundedBox args={[6.2, 1.2, 1.7]} position={[0, 0.6, 0]} radius={0.34} smoothness={5} castShadow><meshStandardMaterial color={wood} roughness={0.66} /></RoundedBox>
    <RoundedBox args={[5.5, 0.12, 1.9]} position={[0, 1.24, 0]} radius={0.1}><meshStandardMaterial color="#eee8dc" roughness={0.42} /></RoundedBox>
    <mesh position={[0, 0.68, 0.88]}><boxGeometry args={[2.5, 0.42, 0.05]} /><meshStandardMaterial color={accent} /></mesh>
    {[-1.7, 1.7].map((x) => <group key={x} position={[x, 1.52, -0.15]}><mesh><boxGeometry args={[0.68, 0.46, 0.08]} /><meshStandardMaterial color="#25332e" /></mesh><mesh position={[0, -0.34, 0]}><boxGeometry args={[0.1, 0.28, 0.1]} /><meshStandardMaterial color="#798079" /></mesh></group>)}
  </group>;
}

function GroomingRoom({ position, accent }: { position: [number, number, number]; accent: string }) {
  return <group position={position}>
    <RoundedBox args={[2.25, 0.16, 1.15]} position={[0.3, 0.92, 0]} radius={0.08}><meshStandardMaterial color="#d8d9d4" metalness={0.28} roughness={0.36} /></RoundedBox>
    {[-0.6, 1.2].flatMap((x) => [-0.4, 0.4].map((z) => <mesh key={`${x}-${z}`} position={[x, 0.45, z]}><cylinderGeometry args={[0.06, 0.06, 0.9, 12]} /><meshStandardMaterial color="#777f7c" metalness={0.6} /></mesh>))}
    <RoundedBox args={[1.8, 1.05, 0.8]} position={[-1.15, 0.52, -1.6]} radius={0.12}><meshStandardMaterial color={accent} /></RoundedBox>
    <mesh position={[-1.15, 1.05, -1.6]}><boxGeometry args={[1.48, 0.15, 0.58]} /><meshStandardMaterial color="#edf1ed" /></mesh>
    <mesh position={[1.55, 1.2, -1.6]}><boxGeometry args={[1.05, 2.35, 0.55]} /><meshStandardMaterial color="#b8a48c" /></mesh>
  </group>;
}

function WaitingArea({ wood, accent }: { wood: string; accent: string }) {
  return <group position={[7.8, 0, -1]}>
    {[-1.5, 1.5].map((z) => <group key={z} position={[0.7, 0, z]} rotation={[0, Math.PI / 2, 0]}><RoundedBox args={[2.8, 0.55, 0.8]} position={[0, 0.42, 0]} radius={0.12}><meshStandardMaterial color={accent} /></RoundedBox><RoundedBox args={[2.8, 0.85, 0.2]} position={[0, 0.95, -0.32]} radius={0.1}><meshStandardMaterial color={accent} /></RoundedBox></group>)}
    <mesh position={[-0.7, 0.5, 0]}><cylinderGeometry args={[0.72, 0.72, 0.12, 24]} /><meshStandardMaterial color={wood} /></mesh><mesh position={[-0.7, 0.25, 0]}><cylinderGeometry args={[0.08, 0.11, 0.5, 12]} /><meshStandardMaterial color="#686d69" /></mesh>
  </group>;
}

function CatSuite({ position, accent }: { position: [number, number, number]; accent: string }) {
  return <group position={position}><RoundedBox args={[1.25, 1.35, 0.85]} position={[0, 0.7, 0]} radius={0.09}><meshStandardMaterial color="#e9e4da" /></RoundedBox><mesh position={[0, 0.74, 0.44]}><boxGeometry args={[0.92, 0.88, 0.035]} /><meshStandardMaterial color={accent} wireframe opacity={0.7} transparent /></mesh><mesh position={[0, 0.3, 0.46]}><boxGeometry args={[0.7, 0.13, 0.07]} /><meshStandardMaterial color="#8b6749" /></mesh></group>;
}

function Cat({ position, color, paused }: { position: [number, number, number]; color: string; paused: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!paused && group.current) {
      group.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.4 + position[0]) * 0.025;
      group.current.rotation.y = Math.sin(clock.elapsedTime * 0.35 + position[2]) * 0.18;
    }
  });
  return <group ref={group} position={position}>
    <mesh position={[0, 0.32, 0]} castShadow><sphereGeometry args={[0.35, 18, 18]} /><meshStandardMaterial color={color} /></mesh>
    <mesh position={[0.36, 0.48, 0]} castShadow><sphereGeometry args={[0.22, 18, 18]} /><meshStandardMaterial color={color} /></mesh>
    {[[-0.1, 0.58, -0.13], [-0.1, 0.58, 0.13]].map((p, index) => <mesh key={index} position={[p[0] + 0.45, p[1], p[2]]} rotation={[0, 0, Math.PI / 4]}><coneGeometry args={[0.11, 0.25, 3]} /><meshStandardMaterial color={color} /></mesh>)}
    <mesh position={[-0.36, 0.53, 0]} rotation={[0, 0, -0.7]}><torusGeometry args={[0.3, 0.055, 8, 18, Math.PI * 1.35]} /><meshStandardMaterial color={color} /></mesh>
  </group>;
}

function Furniture({ preset, visible, catsVisible, paused }: { preset: MaterialPreset; visible: boolean; catsVisible: boolean; paused: boolean }) {
  const materials = MATERIAL_PRESETS[preset];
  if (!visible) return catsVisible ? <Cats paused={paused} /> : null;
  return <group>
    {[-6.2, -2.1, 2.1, 6.2].map((x) => <Shelf key={x} position={[x, 0, 7.1]} wood={materials.wood} accent={materials.accent} />)}
    {[-4.1, 0, 4.1].map((x) => <group key={x} position={[x, 0, 10.7]}><RoundedBox args={[2.8, 0.7, 1.25]} position={[0, 0.35, 0]} radius={0.14}><meshStandardMaterial color={x === 0 ? "#bd6f50" : materials.accent} /></RoundedBox>{[-0.75, 0, 0.75].map((px) => <mesh key={px} position={[px, 0.92, 0]}><boxGeometry args={[0.42, 0.38, 0.42]} /><meshStandardMaterial color="#ead7a2" /></mesh>)}</group>)}
    <Counter wood={materials.wood} accent={materials.accent} />
    <WaitingArea wood={materials.wood} accent={materials.accent} />
    <GroomingRoom position={[-9.1, 0, -4.8]} accent={materials.accent} />
    <GroomingRoom position={[-9.1, 0, 0.5]} accent={materials.accent} />
    <group position={[9.7, 0, 7.4]}><RoundedBox args={[1.2, 0.9, 5.5]} position={[0, 0.45, 0]} radius={0.14}><meshStandardMaterial color={materials.wood} /></RoundedBox>{[-1.9, 0, 1.9].map((z) => <mesh key={z} position={[0, 1.12, z]}><cylinderGeometry args={[0.28, 0.38, 0.5, 16]} /><meshStandardMaterial color={z === 0 ? "#c97856" : materials.accent} /></mesh>)}</group>
    {[-3.8, -2.2, -0.6, 1, 2.6, 4.2].map((x) => <CatSuite key={x} position={[x, 0, -10.6]} accent={materials.accent} />)}
    {[-3.8, -2.2, -0.6, 1, 2.6, 4.2].map((x) => <CatSuite key={x} position={[x, 1.45, -10.6]} accent={materials.accent} />)}
    <group position={[-8.2, 0, -10.6]}>{[-1.2, 0, 1.2].map((x, index) => <group key={x} position={[x, 0, 0]}><mesh position={[0, 0.45 + index * 0.28, 0]}><cylinderGeometry args={[0.48, 0.55, 0.16, 20]} /><meshStandardMaterial color={materials.accent} /></mesh><mesh position={[0, 0.22 + index * 0.28, 0]}><cylinderGeometry args={[0.09, 0.09, 0.55, 12]} /><meshStandardMaterial color={materials.wood} /></mesh></group>)}</group>
    <group position={[8.7, 0, -10.6]}><RoundedBox args={[3.8, 0.95, 0.8]} position={[0, 0.48, -0.8]} radius={0.08}><meshStandardMaterial color={materials.wood} /></RoundedBox><mesh position={[0.8, 1, -0.8]}><cylinderGeometry args={[0.3, 0.3, 0.1, 20]} /><meshStandardMaterial color="#9aa2a0" metalness={0.7} /></mesh></group>
    {catsVisible && <Cats paused={paused} />}
  </group>;
}

function Cats({ paused }: { paused: boolean }) {
  return <><Cat position={[-7.9, 0, -10.4]} color="#c9804d" paused={paused} /><Cat position={[2.7, 0, -9.7]} color="#6f7774" paused={paused} /><Cat position={[8.1, 0, -1]} color="#ddd4c4" paused={paused} /></>;
}

function Labels({ visible, hiddenRooms, isolatedRoom }: { visible: boolean; hiddenRooms: Set<string>; isolatedRoom: string | null }) {
  if (!visible) return null;
  return <>{ROOMS.filter((room) => !hiddenRooms.has(room.id) && (!isolatedRoom || isolatedRoom === room.id)).map((room) => <Billboard key={room.id} position={[room.center[0], 3.15, room.center[2]]} follow lockX={false} lockY={false} lockZ={false}><Text fontSize={0.42} color="#24322d" anchorX="center" anchorY="middle" outlineColor="#f5f0e6" outlineWidth={0.04} maxWidth={3.4}>{room.shortName}</Text></Billboard>)}</>;
}

function CameraDirector({ room, mode }: { room: RoomConfig | null; mode: Props["mode"] }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());
  useFrame((_, delta) => {
    if (mode !== "orbit" || !room) return;
    const desired = new THREE.Vector3(...room.camera);
    camera.position.lerp(desired, 1 - Math.exp(-delta * 2.5));
    target.current.set(room.center[0], 0.7, room.center[2]);
    camera.lookAt(target.current);
  });
  return null;
}

enum Controls { forward = "forward", backward = "backward", left = "left", right = "right" }

function WalkController() {
  const { camera, gl } = useThree();
  const [, get] = useKeyboardControls<Controls>();
  const yaw = useRef(0);
  const pitch = useRef(-0.08);
  const dragging = useRef(false);
  useEffect(() => {
    camera.position.set(0, 1.7, 12.5);
    const down = () => { dragging.current = true; };
    const up = () => { dragging.current = false; };
    const move = (event: PointerEvent) => { if (!dragging.current) return; yaw.current -= event.movementX * 0.003; pitch.current = THREE.MathUtils.clamp(pitch.current - event.movementY * 0.002, -1.1, 1.1); };
    gl.domElement.addEventListener("pointerdown", down); window.addEventListener("pointerup", up); window.addEventListener("pointermove", move);
    return () => { gl.domElement.removeEventListener("pointerdown", down); window.removeEventListener("pointerup", up); window.removeEventListener("pointermove", move); };
  }, [camera, gl]);
  useFrame((_, delta) => {
    const state = get();
    const direction = new THREE.Vector3(Number(state.right) - Number(state.left), 0, Number(state.backward) - Number(state.forward));
    if (direction.lengthSq()) {
      direction.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);
      const next = camera.position.clone().addScaledVector(direction, delta * 5.1);
      next.x = THREE.MathUtils.clamp(next.x, -10.8, 10.8); next.z = THREE.MathUtils.clamp(next.z, -13.8, 13.8);
      camera.position.copy(next);
    }
    camera.rotation.set(pitch.current, yaw.current, 0, "YXZ");
  });
  return null;
}

function SceneContents(props: Props) {
  const material = MATERIAL_PRESETS[props.preset];
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const visibility = () => setPaused(document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    visibility(); document.addEventListener("visibilitychange", visibility); return () => document.removeEventListener("visibilitychange", visibility);
  }, []);
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[SHOP.width, SHOP.depth]} /><meshStandardMaterial color={material.floor} roughness={0.9} /></mesh>
    <mesh position={[0, -0.15, 0]} receiveShadow><boxGeometry args={[SHOP.width + 1.6, 0.28, SHOP.depth + 1.6]} /><meshStandardMaterial color="#8f887c" roughness={1} /></mesh>
    <RoomZones {...props} visible={props.layers.zones} />
    <Walls color={material.wall} visible={props.layers.walls} selectedRoom={props.selectedRoom} />
    {props.layers.roof && <mesh position={[0, SHOP.wallHeight + 0.08, 0]}><boxGeometry args={[SHOP.width, 0.15, SHOP.depth]} /><meshStandardMaterial color={material.wall} transparent opacity={0.72} /></mesh>}
    <Furniture preset={props.preset} visible={props.layers.furniture} catsVisible={props.layers.cats} paused={paused} />
    <Labels visible={props.layers.labels} hiddenRooms={props.hiddenRooms} isolatedRoom={props.isolatedRoom} />
    <CameraDirector room={props.selectedRoom} mode={props.mode} />
    {props.mode === "walk" && <WalkController />}
    {props.evening && <pointLight position={[0, 3.2, -1]} intensity={13} distance={14} color="#ffd6a1" />}
  </group>;
}

export default function ShopScene(props: Props) {
  return <KeyboardControls map={[
    { name: Controls.forward, keys: ["ArrowUp", "KeyW"] }, { name: Controls.backward, keys: ["ArrowDown", "KeyS"] },
    { name: Controls.left, keys: ["ArrowLeft", "KeyA"] }, { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
  ]}><SceneContents {...props} /></KeyboardControls>;
}
