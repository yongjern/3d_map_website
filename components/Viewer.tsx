"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, Environment, Html, OrbitControls, PerspectiveCamera, useProgress } from "@react-three/drei";
import { Bloom, EffectComposer, N8AO, ToneMapping } from "@react-three/postprocessing";
import { Physics } from "@react-three/rapier";
import { Box, ChevronLeft, ChevronRight, CirclePause, CirclePlay, Eye, EyeOff, Focus, Fullscreen, Layers3, Lightbulb, Menu, Moon, MousePointer2, PawPrint, RotateCcw, Search, Settings2, Sun, X } from "lucide-react";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import ShopScene from "./scene/ShopScene";
import { MATERIAL_PRESETS, ROOMS, TOUR, type MaterialPreset, type RoomConfig } from "@/lib/shop-config";

type Mode = "orbit" | "walk";
type LayerState = { walls: boolean; roof: boolean; furniture: boolean; labels: boolean; zones: boolean; cats: boolean };

const INITIAL_LAYERS: LayerState = { walls: true, roof: false, furniture: true, labels: true, zones: true, cats: true };

function ProgressOverlay() {
  const { progress } = useProgress();
  return <Html center className="canvas-loader"><PawPrint /><span>Preparing the shop</span><progress value={progress || 18} max="100" /></Html>;
}

function WebGLFallback() {
  return <div className="webgl-fallback"><PawPrint /><h1>Interactive 3D pet shop plan</h1><p>This browser cannot open the 3D viewer. Try a current Chromium browser with hardware acceleration enabled.</p></div>;
}

export default function Viewer() {
  const [webgl, setWebgl] = useState(true);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<Mode>("orbit");
  const [selected, setSelected] = useState<RoomConfig | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [layers, setLayers] = useState(INITIAL_LAYERS);
  const [hiddenRooms, setHiddenRooms] = useState<Set<string>>(new Set());
  const [isolatedRoom, setIsolatedRoom] = useState<string | null>(null);
  const [preset, setPreset] = useState<MaterialPreset>("warm");
  const [evening, setEvening] = useState(false);
  const [lightIntensity, setLightIntensity] = useState(1);
  const [tourIndex, setTourIndex] = useState(-1);
  const [tourPaused, setTourPaused] = useState(false);
  const [tutorial, setTutorial] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const controls = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setWebgl(Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
  }, []);

  const filteredRooms = useMemo(() => ROOMS.filter((room) => room.name.toLowerCase().includes(query.toLowerCase())), [query]);
  const currentTourRoom = tourIndex >= 0 ? ROOMS.find((room) => room.id === TOUR[tourIndex]) ?? null : null;

  const selectRoom = useCallback((room: RoomConfig) => {
    setSelected(room);
    setMode("orbit");
    setMenuOpen(false);
  }, []);

  const resetView = () => {
    setSelected(null);
    setMode("orbit");
    setTourIndex(-1);
    setIsolatedRoom(null);
    controls.current?.reset();
  };

  const toggleRoom = (id: string) => setHiddenRooms((previous) => {
    const next = new Set(previous);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const resetDesign = () => {
    setPreset("warm");
    setEvening(false);
    setLightIntensity(1);
    setLayers(INITIAL_LAYERS);
    setHiddenRooms(new Set());
    setIsolatedRoom(null);
  };

  const stepTour = (delta: number) => setTourIndex((current) => Math.max(0, Math.min(TOUR.length - 1, current + delta)));
  const toggleFullscreen = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();

  useEffect(() => {
    if (tourIndex < 0 || tourPaused) return;
    const timer = window.setTimeout(() => {
      if (tourIndex < TOUR.length - 1) setTourIndex(tourIndex + 1); else setTourPaused(true);
    }, 7000);
    return () => window.clearTimeout(timer);
  }, [tourIndex, tourPaused]);

  const activeRoom = currentTourRoom ?? selected;

  if (!webgl) return <WebGLFallback />;

  return (
    <main className={`viewer ${evening ? "is-evening" : ""}`} id="top">
      <a className="skip-link" href="#viewer-controls">Skip to viewer controls</a>
      <header className="topbar" data-enter>
        <a className="brand" href="#top" aria-label="The Jin Little Paws Co. home">
          <span className="brand-mark"><PawPrint aria-hidden="true" /></span>
          <span><strong>The Jin Little Paws Co.</strong><small>Interactive shop plan · one floor</small></span>
        </a>
        <div className="top-actions">
          <button className="icon-button desktop-only" onClick={resetView} aria-label="Reset camera view"><RotateCcw /></button>
          <button className="icon-button desktop-only" onClick={toggleFullscreen} aria-label="Enter fullscreen"><Fullscreen /></button>
          <button className="icon-button" onClick={() => setSettingsOpen(!settingsOpen)} aria-label="Open display settings" aria-expanded={settingsOpen}><Settings2 /></button>
          <button className="primary-button" onClick={() => { setTourIndex(0); setTourPaused(false); }}><CirclePlay /> Start guided tour</button>
        </div>
      </header>

      <section className="canvas-shell" aria-label="Interactive 3D model of the pet shop">
        <Canvas shadows dpr={[0.75, 1.5]} gl={{ antialias: true, powerPreference: "high-performance" }} onCreated={() => setReady(true)}>
          <color attach="background" args={[evening ? "#17211d" : "#ece8df"]} />
          <fog attach="fog" args={[evening ? "#17211d" : "#ece8df", 34, 72]} />
          <PerspectiveCamera makeDefault position={[25, 31, 35]} fov={38} near={0.1} far={120} />
          <ambientLight intensity={(evening ? 0.52 : 0.85) * lightIntensity} />
          <directionalLight position={[-12, 26, 12]} intensity={(evening ? 1.4 : 2.2) * lightIntensity} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-28} shadow-camera-right={28} shadow-camera-top={28} shadow-camera-bottom={-28} />
          <Suspense fallback={<ProgressOverlay />}>
            <Physics gravity={[0, -9.81, 0]} timeStep="vary">
              <ShopScene mode={mode} selectedRoom={activeRoom} hoveredRoom={hovered} onHover={setHovered} onSelect={selectRoom} layers={layers} hiddenRooms={hiddenRooms} isolatedRoom={isolatedRoom} preset={preset} evening={evening} />
            </Physics>
            <Environment preset={evening ? "city" : "apartment"} environmentIntensity={evening ? 0.35 : 0.55} />
          </Suspense>
          {mode === "orbit" && <OrbitControls ref={controls} makeDefault target={[0, 0, 0]} minDistance={12} maxDistance={58} maxPolarAngle={Math.PI / 2.15} enableDamping dampingFactor={0.08} />}
          <AdaptiveDpr pixelated />
          <EffectComposer enableNormalPass={false} multisampling={0}>
            <N8AO aoRadius={2.3} intensity={0.75} quality="performance" />
            {evening && <Bloom intensity={0.18} luminanceThreshold={0.82} mipmapBlur />}
            <ToneMapping />
          </EffectComposer>
        </Canvas>
        {!ready && <div className="loading-screen"><div className="loading-mark"><PawPrint /></div><p>Building the one-floor shop model</p><div className="loading-track"><span /></div></div>}
      </section>

      <aside className={`room-browser ${menuOpen ? "is-open" : ""}`} id="viewer-controls" aria-label="Room selection">
        <div className="panel-heading"><div><span className="eyebrow">Rooms</span><h1>Interactive 3D pet shop plan</h1></div><button className="close-button mobile-only" onClick={() => setMenuOpen(false)} aria-label="Close room menu"><X /></button></div>
        <label className="search-field"><Search aria-hidden="true" /><span className="sr-only">Search rooms</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search rooms" /></label>
        <div className="room-list">
          {filteredRooms.map((room, index) => <button key={room.id} className={activeRoom?.id === room.id ? "is-active" : ""} onClick={() => selectRoom(room)} onMouseEnter={() => setHovered(room.id)} onMouseLeave={() => setHovered(null)}><span>{String(index + 1).padStart(2, "0")}</span>{room.shortName}<ChevronRight /></button>)}
        </div>
        <div className="plan-fact"><Box /><span><strong>Estimated 24 × 30 m</strong><small>4 m floor-to-ceiling height</small></span></div>
      </aside>

      <div className="mode-switch" role="group" aria-label="Viewing mode">
        <button className={mode === "orbit" ? "is-active" : ""} onClick={() => setMode("orbit")}><Box /> Dollhouse</button>
        <button className={mode === "walk" ? "is-active" : ""} onClick={() => { setMode("walk"); setSelected(null); }}><MousePointer2 /> Walkthrough</button>
      </div>

      <button className="mobile-room-button mobile-only" onClick={() => setMenuOpen(true)} aria-label="Open room menu"><Menu /> Rooms</button>

      <div className="viewer-tools" aria-label="Quick controls">
        <button onClick={() => setLayers((state) => ({ ...state, labels: !state.labels }))} aria-label="Toggle room labels">{layers.labels ? <Eye /> : <EyeOff />}</button>
        <button onClick={() => setLayers((state) => ({ ...state, roof: !state.roof }))} aria-label="Toggle roof"><Layers3 /></button>
        <button onClick={resetView} aria-label="Reset view"><Focus /></button>
        <button onClick={toggleFullscreen} aria-label="Enter fullscreen"><Fullscreen /></button>
      </div>

      {activeRoom && <aside className="room-detail" aria-live="polite">
        <button className="close-button" onClick={() => { setSelected(null); setTourIndex(-1); }} aria-label="Close room details"><X /></button>
        <div className="thumbnail" style={{ background: activeRoom.color }}><PawPrint /><span>{activeRoom.shortName}</span></div>
        <span className="eyebrow">{activeRoom.kind} space</span>
        <h2>{activeRoom.name}</h2>
        <p>{activeRoom.description}</p>
        <div className="purpose"><strong>Purpose</strong><p>{activeRoom.purpose}</p></div>
        <div className="detail-actions">
          <button onClick={() => setIsolatedRoom(isolatedRoom === activeRoom.id ? null : activeRoom.id)}>{isolatedRoom === activeRoom.id ? <Eye /> : <Focus />}{isolatedRoom === activeRoom.id ? "Restore all rooms" : "Isolate room"}</button>
          <button onClick={() => toggleRoom(activeRoom.id)}>{hiddenRooms.has(activeRoom.id) ? <Eye /> : <EyeOff />}{hiddenRooms.has(activeRoom.id) ? "Show room" : "Hide room"}</button>
        </div>
      </aside>}

      {settingsOpen && <aside className="settings-panel">
        <div className="panel-heading"><div><span className="eyebrow">Display</span><h2>Layers and materials</h2></div><button className="close-button" onClick={() => setSettingsOpen(false)} aria-label="Close settings"><X /></button></div>
        <div className="settings-group"><h3>Scene layers</h3>{Object.entries(layers).map(([key, value]) => <label key={key}><span>{key === "roof" ? "Roof and ceiling" : key.charAt(0).toUpperCase() + key.slice(1)}</span><input type="checkbox" checked={value} onChange={() => setLayers((state) => ({ ...state, [key]: !value }))} /></label>)}</div>
        <div className="settings-group"><h3>Material preset</h3><div className="swatches">{(Object.keys(MATERIAL_PRESETS) as MaterialPreset[]).map((name) => <button key={name} className={preset === name ? "is-active" : ""} onClick={() => setPreset(name)}><i style={{ background: MATERIAL_PRESETS[name].accent }} />{name}</button>)}</div></div>
        <div className="settings-group"><h3>Lighting</h3><div className="light-modes"><button className={!evening ? "is-active" : ""} onClick={() => setEvening(false)}><Sun /> Day</button><button className={evening ? "is-active" : ""} onClick={() => setEvening(true)}><Moon /> Evening</button></div><label className="range-label"><span>Intensity</span><input type="range" min="0.55" max="1.35" step="0.05" value={lightIntensity} onChange={(event) => setLightIntensity(Number(event.target.value))} /></label></div>
        <button className="secondary-button" onClick={resetDesign}><RotateCcw /> Reset design</button>
      </aside>}

      {tourIndex >= 0 && currentTourRoom && <div className="tour-controls">
        <span>{tourIndex + 1} / {TOUR.length}</span><div><strong>{currentTourRoom.shortName}</strong><small>{currentTourRoom.purpose}</small></div>
        <button onClick={() => stepTour(-1)} disabled={tourIndex === 0} aria-label="Previous tour stop"><ChevronLeft /></button>
        <button onClick={() => setTourPaused(!tourPaused)} aria-label={tourPaused ? "Resume guided tour" : "Pause guided tour"}>{tourPaused ? <CirclePlay /> : <CirclePause />}</button>
        <button onClick={() => stepTour(1)} disabled={tourIndex === TOUR.length - 1} aria-label="Next tour stop"><ChevronRight /></button>
        <button onClick={() => { setTourIndex(-1); setTourPaused(false); }} aria-label="Exit guided tour"><X /></button>
      </div>}

      {tutorial && <div className="tutorial" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
        <div className="tutorial-card"><button className="close-button" onClick={() => setTutorial(false)} aria-label="Close tutorial"><X /></button><span className="eyebrow">First visit</span><h2 id="tutorial-title">Move through the shop</h2><div className="tutorial-grid"><div><MousePointer2 /><strong>Dollhouse</strong><p>Drag to orbit. Scroll to zoom. Select any room to focus.</p></div><div><Box /><strong>Walkthrough</strong><p>Use WASD or arrow keys. Drag to look on touch screens.</p></div><div><Layers3 /><strong>Layers</strong><p>Show the roof, hide furniture or isolate one room.</p></div></div><button className="primary-button" onClick={() => setTutorial(false)}>Open the 3D plan</button></div>
      </div>}

      <footer className="viewer-credit"><span>Plan reconstructed from the supplied floor-plan image.</span><span>Estimated dimensions can be edited in <code>lib/shop-config.ts</code>.</span></footer>
    </main>
  );
}
