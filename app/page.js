"use client";
import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import { OrbitControls, useTexture, useProgress } from "@react-three/drei";
import * as THREE from "three";


// =========================
// 🔥 PRELOADER
// =========================
function Loader() {
  const { progress } = useProgress();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setHidden(true);
      }, 500);
    }
  }, [progress]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: hidden ? "none" : "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "black",
        color: "white",
        fontSize: "2rem",
        fontWeight: "bold",
        transition: "opacity 0.4s ease",
        opacity: progress === 100 ? 0 : 1,
        zIndex: 9999,
      }}
    >
      {Math.floor(progress)}%
    </div>
  );
}


// =========================
// 🔥 CYLINDER MESH
// =========================
const CylinderMesh = () => {
  const meshRef = useRef(null);
  const texture = useTexture("./text.png");

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[0, -0.1, 0.1]}>
      <cylinderGeometry args={[2, 2, 2, 64, 16, true]} />
      <meshStandardMaterial
        side={THREE.DoubleSide}
        transparent
        opacity={0.8}
        map={texture}
      />
    </mesh>
  );
};


// =========================
// 🔥 RESPONSIVE WRAPPER
// =========================
const ResponsiveWrapper = ({ children }) => {
  const { size, camera } = useThree();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const w = size.width;

    if (w < 500) {
      setScale(0.6);
      camera.position.z = 6;
    } else if (w < 900) {
      setScale(0.8);
      camera.position.z = 5;
    } else {
      setScale(1);
      camera.position.z = 4.5;
    }
  }, [size, camera]);

  return <group scale={scale}>{children}</group>;
};


// =========================
// 🔥 MAIN PAGE
// =========================
export default function Home() {
  return (
    <section className="w-full h-screen">

      {/* LOADER */}
      <Loader />

      {/* NAV TOP */}
      <nav className="w-full absolute top-0 left-0 h-16 flex items-center justify-center ">
        <h1 className="text-white text-3xl font-bold text-center">
          React Three Fiber
        </h1>
      </nav>

      {/* NAV BOTTOM */}
      <div
        className="w-full h-20 absolute bottom-0 left-0 flex justify-between items-center z-10"
        style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
      >
        <a
          className="text-white text-xl font-bold text-center border-4 border-white w-24 py-2 px-4 rounded-full"
          href="https://jotirmoy.vercel.app"
        >
          Dev
        </a>

        <a
          className="text-white text-xl font-bold text-center border-4 border-white w-24 py-2 px-4 rounded-full"
          href="https://r3f.docs.pmnd.rs/getting-started/introduction"
        >
          Docs
        </a>
      </div>

      {/* 3D SCENE */}
      <Canvas camera={{ fov: 60 }}>
        <OrbitControls enableZoom={false} />
        <ambientLight intensity={3} />

        <ResponsiveWrapper>
          <CylinderMesh />
        </ResponsiveWrapper>

        <EffectComposer multisampling={0} resolution={256}>
          <Bloom
            mipmapBlur={true}
            intensity={2.0}
            luminanceThreshold={0.34}
            luminanceSmoothing={0}
          />
        </EffectComposer>

        <ToneMapping adaptive={true} />
      </Canvas>
    </section>
  );
}
